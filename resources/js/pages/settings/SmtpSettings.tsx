import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
type Props = {
    smtp: {
        id: number;
        host: string;
        port: number;
        encryption: 'none' | 'ssl' | 'tls';
        username: string | null;
        from_name: string | null;
        from_address: string | null;
        password: any;
        timeout: number | null;
        active: boolean;
    } | null;
    flash?: { success?: string; error?: string };
};
function Notice({ kind = 'success', text, onClose }: { kind?: 'success' | 'error' | 'info'; text: string; onClose?: () => void }) {
    const color =
        kind === 'success'
            ? 'border-emerald-600/30 bg-emerald-50 text-emerald-700'
            : kind === 'error'
              ? 'border-red-600/30 bg-red-50 text-red-700'
              : 'border-blue-600/30 bg-blue-50 text-blue-700';

    return (
        <div className={`mb-3 flex items-start justify-between rounded-md border p-2 ${color}`}>
            <div className="pr-3 text-sm">{text}</div>
            <button type="button" className="ml-3 rounded px-2 text-xs opacity-70 hover:opacity-100" onClick={onClose}>
                ×
            </button>
        </div>
    );
}

export default function SmtpSettings() {
    const { smtp, flash } = usePage<Props>().props;
    const [notice, setNotice] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null);
    const [showPwd, setShowPwd] = useState(true);

    useEffect(() => {
        if (flash?.success) {
            setNotice({ kind: 'success', text: flash.success });
        } else if (flash?.error) {
            setNotice({ kind: 'error', text: flash.error });
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (!notice) return;
        const t = setTimeout(() => setNotice(null), 4000);
        return () => clearTimeout(t);
    }, [notice]);

    const { data, setData, post, processing, errors, reset } = useForm({
        host: smtp?.host ?? '',
        port: smtp?.port ?? 587,
        encryption: (smtp?.encryption ?? 'tls') as 'none' | 'ssl' | 'tls',
        username: smtp?.username ?? '',
        password: smtp?.password ?? '', // left blank; only set when updating
        from_name: smtp?.from_name ?? '',
        from_address: smtp?.from_address ?? '',
        timeout: smtp?.timeout ?? 60,
        active: smtp?.active ?? true,
    });

    const save = () =>
        router.post(route('smtp.store'), data, {
            preserveScroll: true,
            onStart: () => setNotice({ kind: 'info', text: t('smtp-saving-settings') }),
            onSuccess: () => setNotice({ kind: 'success', text: t('smtp-settings-saved') }),
            onError: (errs) => setNotice({ kind: 'error', text: (Object.values(errs)[0] as string) || t('smtp-failed-save') }),
        });

    const [isTesting, setIsTesting] = useState(false);
    const [testTo, setTestTo] = useState('');

    const testSend = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTesting(true);
        setNotice({ kind: 'info', text: t('smtp-sending-test-email') });

        const form = new FormData();
        form.append('to', testTo);

        // use axios directly; or router.post if you prefer
        // @ts-ignore
        window.axios
            .post(route('smtp.test'), form)
            .then(() => setNotice({ kind: 'success', text: t('smtp-test-email-sent') }))
            .catch((err: any) =>
                setNotice({
                    kind: 'error',
                    text: err?.response?.data?.message || t('smtp-failed-send-test'),
                }),
            )
            .finally(() => setIsTesting(false));
    };
    const t = useTranslation();

    return (
        <AppLayout breadcrumbs={[{ title: t('smtp-settings'), href: '/smtp' }]}>
            <Head title={t('smtp-settings')} />

            {notice && <Notice kind={notice.kind} text={notice.text} onClose={() => setNotice(null)} />}

            {/* {flash?.success && <div className="mb-3 rounded-md border border-emerald-600/30 bg-emerald-50 p-2 text-emerald-700">{flash.success}</div>}
            {flash?.error && <div className="mb-3 rounded-md border border-red-600/30 bg-red-50 p-2 text-red-700">{flash.error}</div>} */}

            <div className="grid gap-4 p-4 md:p-12 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('smtp-server-credentials')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label>{t('smtp-host')}</Label>
                                <Input value={data.host} onChange={(e) => setData('host', e.target.value)} />
                                {errors.host && <p className="text-xs text-red-600">{errors.host}</p>}
                            </div>
                            <div>
                                <Label>{t('smtp-port')}</Label>
                                <Input type="number" value={data.port} onChange={(e) => setData('port', Number(e.target.value))} />
                                {errors.port && <p className="text-xs text-red-600">{errors.port}</p>}
                            </div>

                            <div>
                                <Label>{t('smtp-encryption')}</Label>
                                <Select value={data.encryption} onValueChange={(v) => setData('encryption', v as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('smtp-select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">{t('smtp-none')}</SelectItem>
                                        <SelectItem value="ssl">{t('smtp-ssl')}</SelectItem>
                                        <SelectItem value="tls">{t('smtp-tls')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.encryption && <p className="text-xs text-red-600">{errors.encryption}</p>}
                            </div>

                            <div>
                                <Label>{t('smtp-username')}</Label>
                                <Input value={data.username} onChange={(e) => setData('username', e.target.value)} />
                                {errors.username && <p className="text-xs text-red-600">{errors.username}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <Label>{t('smtp-password')}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type={showPwd ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="new-password"
                                    />
                                    <Button type="button" variant="secondary" onClick={() => setShowPwd(!showPwd)}>
                                        {showPwd ? t('smtp-hide') : t('smtp-show')}
                                    </Button>
                                </div>
                                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                            </div>

                            <div>
                                <Label>{t('smtp-from-name')}</Label>
                                <Input value={data.from_name} onChange={(e) => setData('from_name', e.target.value)} />
                            </div>
                            <div>
                                <Label>{t('smtp-from-address')}</Label>
                                <Input type="email" value={data.from_address} onChange={(e) => setData('from_address', e.target.value)} />
                                {errors.from_address && <p className="text-xs text-red-600">{errors.from_address}</p>}
                            </div>

                            <div>
                                <Label>{t('smtp-timeout')}</Label>
                                <Input type="number" value={data.timeout ?? 60} onChange={(e) => setData('timeout', Number(e.target.value))} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch checked={data.active} onCheckedChange={(v) => setData('active', v)} />
                                <span>{t('smtp-active')}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button disabled={processing} onClick={save} className="w-full md:w-auto">
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('smtp-save')}
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('smtp-send-test-email')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={testSend} className="space-y-3">
                            <div>
                                <Label>{t('smtp-to')}</Label>
                                <Input
                                    type="email"
                                    value={testTo}
                                    onChange={(e) => setTestTo(e.target.value)}
                                    placeholder={t('smtp-email-placeholder')}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-amber-400 hover:bg-amber-300 md:w-auto" disabled={isTesting || !testTo}>
                                {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isTesting ? t('smtp-sending') : t('smtp-send-test')}
                            </Button>
                        </form>
                        <p className="text-muted-foreground mt-3 text-xs">{t('smtp-test-description')}</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
