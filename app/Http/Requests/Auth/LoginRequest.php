<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];

        // If RECAPTCHA_SECRET present require token
        if (env('RECAPTCHA_SECRET')) {
            $rules['g-recaptcha-response'] = ['required', 'string'];
        }

        return $rules;
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // If RECAPTCHA_SECRET set, verify token with Google first
        $secret = env('RECAPTCHA_SECRET');
        if ($secret) {
            $token = $this->input('g-recaptcha-response', '');
            $remoteIp = $this->ip();

            $resp = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secret,
                'response' => $token,
                'remoteip' => $remoteIp,
            ]);

            $body = $resp->json();

            if (! ($body['success'] ?? false) ) {
                // for v3 you might check score, for v2 just require success
                throw ValidationException::withMessages([
                    'g-recaptcha-response' => 'Captcha verification failed. Please try again.',
                ]);
            }
        }

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        // support older/newer Laravel forms safely
        $email = $this->input('email') ?? ($this->string('email') ?? '');
        return Str::transliterate(Str::lower($email) . '|' . $this->ip());
    }
}
