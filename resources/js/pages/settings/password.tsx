import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/components/useTranslation';

export default function Password() {
    const t = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('set-password-settings'),
            href: '/settings/password',
        },
    ];
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('set-password-settings')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title={t('set-update-password')} description={t('set-password-description')} />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">{t('set-current-password')}</Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder={t('set-current-password-placeholder')}
                            />

                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">{t('set-new-password')}</Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder={t('set-new-password-placeholder')}
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">{t('set-confirm-password')}</Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder={t('set-confirm-password-placeholder')}
                            />

                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>{t('set-save-password')}</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">{t('set-saved')}</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
