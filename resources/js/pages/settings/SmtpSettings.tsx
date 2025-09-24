import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
            onStart: () => setNotice({ kind: 'info', text: 'Saving settings…' }),
            onSuccess: () => setNotice({ kind: 'success', text: 'SMTP settings saved.' }),
            onError: (errs) => setNotice({ kind: 'error', text: (Object.values(errs)[0] as string) || 'Failed to save.' }),
        });

    const [isTesting, setIsTesting] = useState(false);
    const [testTo, setTestTo] = useState('');

    const testSend = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTesting(true);
        setNotice({ kind: 'info', text: 'Sending test email…' });

        const form = new FormData();
        form.append('to', testTo);

        // use axios directly; or router.post if you prefer
        // @ts-ignore
        window.axios
            .post(route('smtp.test'), form)
            .then(() => setNotice({ kind: 'success', text: 'Test email sent.' }))
            .catch((err: any) =>
                setNotice({
                    kind: 'error',
                    text: err?.response?.data?.message || 'Failed to send test email.',
                }),
            )
            .finally(() => setIsTesting(false));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'SMTP Settings', href: '/smtp' }]}>
            <Head title="SMTP Settings" />

            {notice && <Notice kind={notice.kind} text={notice.text} onClose={() => setNotice(null)} />}

            {/* {flash?.success && <div className="mb-3 rounded-md border border-emerald-600/30 bg-emerald-50 p-2 text-emerald-700">{flash.success}</div>}
            {flash?.error && <div className="mb-3 rounded-md border border-red-600/30 bg-red-50 p-2 text-red-700">{flash.error}</div>} */}

            <div className="grid gap-4 p-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Server & Credentials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label>Host</Label>
                                <Input value={data.host} onChange={(e) => setData('host', e.target.value)} />
                                {errors.host && <p className="text-xs text-red-600">{errors.host}</p>}
                            </div>
                            <div>
                                <Label>Port</Label>
                                <Input type="number" value={data.port} onChange={(e) => setData('port', Number(e.target.value))} />
                                {errors.port && <p className="text-xs text-red-600">{errors.port}</p>}
                            </div>

                            <div>
                                <Label>Encryption</Label>
                                <Select value={data.encryption} onValueChange={(v) => setData('encryption', v as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="ssl">SSL</SelectItem>
                                        <SelectItem value="tls">TLS</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.encryption && <p className="text-xs text-red-600">{errors.encryption}</p>}
                            </div>

                            <div>
                                <Label>Username</Label>
                                <Input value={data.username} onChange={(e) => setData('username', e.target.value)} />
                                {errors.username && <p className="text-xs text-red-600">{errors.username}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <Label>Password</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type={showPwd ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="new-password"
                                    />
                                    <Button type="button" variant="secondary" onClick={() => setShowPwd(!showPwd)}>
                                        {showPwd ? 'Hide' : 'Show'}
                                    </Button>
                                </div>
                                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                            </div>

                            <div>
                                <Label>From Name</Label>
                                <Input value={data.from_name} onChange={(e) => setData('from_name', e.target.value)} />
                            </div>
                            <div>
                                <Label>From Address</Label>
                                <Input type="email" value={data.from_address} onChange={(e) => setData('from_address', e.target.value)} />
                                {errors.from_address && <p className="text-xs text-red-600">{errors.from_address}</p>}
                            </div>

                            <div>
                                <Label>Timeout (sec)</Label>
                                <Input type="number" value={data.timeout ?? 60} onChange={(e) => setData('timeout', Number(e.target.value))} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch checked={data.active} onCheckedChange={(v) => setData('active', v)} />
                                <span>Active</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button disabled={processing} onClick={save} className='w-full md:w-auto'>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Send Test Email</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={testSend} className="space-y-3">
                            <div>
                                <Label>To</Label>
                                <Input type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@example.com" />
                            </div>
                            <Button type="submit" className="bg-amber-400 hover:bg-amber-300 w-full md:w-auto" disabled={isTesting || !testTo}>
                                {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isTesting ? 'Sending…' : 'Send Test'}
                            </Button>
                        </form>
                        <p className="text-muted-foreground mt-3 text-xs">Uses current active settings for this request only.</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
