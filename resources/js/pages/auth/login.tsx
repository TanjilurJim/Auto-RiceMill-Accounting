import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

import AppLogoIcon from '@/components/app-logo-icon';
import { FcGoogle } from 'react-icons/fc';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-20">
                <div className="w-full md:w-2/4 lg:w-1/3 xl:w-[30%]">
                    <div className="flex flex-col gap-8 rounded-xl border border-gray-400 p-3 lg:p-8">
                        <a href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="h-16 w-20 rounded-sm">
                                <AppLogoIcon className="fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                        </a>
                        <h1 className="text-center text-2xl font-bold">Log in to account</h1>
                        {/* Log in Form  */}
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="remember"
                                            name="remember"
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={() => setData('remember', !data.remember)}
                                            tabIndex={3}
                                            className="peer h-4 w-4 rounded border-gray-300 text-[#F15A29] focus:ring-[#F15A29]"
                                        />
                                        <Label htmlFor="remember">Remember me</Label>
                                    </div>
                                    <div className="flex items-center">
                                        {canResetPassword && (
                                            <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded bg-[#5e0404] px-6 py-2 text-white transition duration-300 ease-in-out hover:bg-[#1D1C1E] hover:text-white cursor-pointer"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Log in
                                </button>

                                <a
                                    href={route('google.redirect')}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded border px-4 py-2"
                                >
                                    <FcGoogle className="h-5 w-5" />
                                    Continue with Google
                                </a>
                            </div>

                            <div className="text-muted-foreground text-center text-sm">
                                Don't have an account?{' '}
                                <TextLink href={route('register')} tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
