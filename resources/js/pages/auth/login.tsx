import { Head, useForm } from '@inertiajs/react';
import { Link, LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

import loginImg from '@/../../public/assets/undraw_login_weas.svg';

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
        // <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <div className='flex flex-col md:flex-row items-center justify-evenly gap-8'>
                <div className="md:w-1/3">
                    <div className="flex flex-col gap-8 p-5 rounded-xl border" >
                        <div className="flex flex-col items-center gap-4">
                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium" >Log in to your account</h1>
                                <p className="text-muted-foreground text-center text-sm">Enter your email and password below to log in</p>
                            </div>
                        </div>
                        {/* Log in Form  */}
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input id="email" type="email" required autoFocus tabIndex={1} autoComplete="email" value={data.email}
                                        onChange={(e)=> setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        {canResetPassword && (
                                        <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                        )}
                                    </div>
                                    <Input id="password" type="password" required tabIndex={2} autoComplete="current-password"
                                        value={data.password} onChange={(e)=> setData('password', e.target.value)}
                                    placeholder="Password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={() => setData('remember', !data.remember)}
                                        tabIndex={3}
                                        className="peer h-4 w-4 border-gray-300 rounded text-[#F15A29] focus:ring-[#F15A29]"
                                    />
                                    <Label htmlFor="remember">Remember me</Label>
                                </div>

                                <button type="submit" className="mt-4 w-full inline-flex gap-1 items-center justify-center bg-[#F15A29] text-white hover:text-[#F15A29] py-2 px-6 rounded hover:bg-[#1D1C1E] transition duration-300 ease-in-out" tabIndex={4} disabled={processing}>
                                    {processing &&
                                    <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Log in
                                </button>
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
                <div className="flex justify-center items-center">
                    <img 
                        src={loginImg} 
                        alt="Login Illustration" 
                        className="w-full max-w-md h-auto object-contain"
                    />
                </div>
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
