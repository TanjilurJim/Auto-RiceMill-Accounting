<?php

namespace App\Http\Controllers;
use App\Models\SmtpSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;


class SmtpSettingController extends Controller
{
    //
    public function index()
    {
        $this->authorizeAdmin(); // role gate

        $smtp = SmtpSetting::query()->latest('id')->first(); // singleton-ish
        return Inertia::render('settings/SmtpSettings', [
            'smtp' => $smtp ? [
                'id'           => $smtp->id,
                'host'         => $smtp->host,
                'port'         => $smtp->port,
                'encryption'   => $smtp->encryption,
                'username'     => $smtp->username,
                'from_name'    => $smtp->from_name,
                'from_address' => $smtp->from_address,
                'timeout'      => $smtp->timeout,
                'active'       => $smtp->active,
                'password'     => $smtp->password,
                // do NOT send password down
            ] : null,
        ]);
    }

    public function store(Request $req)
    {
        $this->authorizeAdmin();

        $data = $req->validate([
            'host'         => ['required','string','max:255'],
            'port'         => ['required','integer','between:1,65535'],
            'encryption'   => ['required','in:none,ssl,tls'],
            'username'     => ['nullable','string','max:255'],
            'password'     => ['nullable','string','max:1024'],
            'from_name'    => ['nullable','string','max:255'],
            'from_address' => ['nullable','email','max:255'],
            'timeout'      => ['nullable','integer','between:1,600'],
            'active'       => ['boolean'],
        ]);

        $smtp = SmtpSetting::query()->latest('id')->first();

        if ($smtp) {
            $smtp->fill($data);
            // only overwrite password if provided
            if (!filled($data['password'] ?? null)) {
                unset($smtp->password);
            }
            $smtp->updated_by = Auth::id();
            $smtp->save();
        } else {
            if (!filled($data['password'] ?? null)) {
                $data['password'] = null;
            }
            $smtp = SmtpSetting::create($data + ['created_by' => Auth::id()]);
        }

        return back()->with('success', 'SMTP settings saved.');
    }

    public function test(Request $req)
    {
        $this->authorizeAdmin();

        $req->validate([
            'to' => ['required','email'],
        ]);

        $smtp = SmtpSetting::where('active', true)->latest('id')->firstOrFail();

        // Apply settings at runtime for this request
        config([
            'mail.default'                 => 'smtp',
            'mail.mailers.smtp.transport'  => 'smtp',
            'mail.mailers.smtp.host'       => $smtp->host,
            'mail.mailers.smtp.port'       => $smtp->port,
            'mail.mailers.smtp.encryption' => $smtp->encryption === 'none' ? null : $smtp->encryption,
            'mail.mailers.smtp.username'   => $smtp->username,
            'mail.mailers.smtp.password'   => $smtp->password,
            'mail.mailers.smtp.timeout'    => $smtp->timeout,
            'mail.from.address'            => $smtp->from_address ?: $smtp->username,
            'mail.from.name'               => $smtp->from_name ?: config('app.name'),
        ]);

        try {
            Mail::raw('SMTP test mail from your software.', function ($m) use ($req) {
                $m->to($req->input('to'))->subject('SMTP Test');
            });
        } catch (\Throwable $e) {
            return back()->with('error', 'Failed to send test email: '.$e->getMessage());
        }

        return back()->with('success', 'Test email sent!');
    }

    private function authorizeAdmin(): void
    {
        abort_unless(auth()->user()?->hasRole('admin'), 403);
    }

}
