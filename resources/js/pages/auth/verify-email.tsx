// Components
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

function Notice({
  kind = 'success',
  text,
  onClose,
}: { kind?: 'success' | 'error' | 'info'; text: string; onClose?: () => void }) {
  const color =
    kind === 'success'
      ? 'border-emerald-600/30 bg-emerald-50 text-emerald-700'
      : kind === 'error'
      ? 'border-red-600/30 bg-red-50 text-red-700'
      : 'border-blue-600/30 bg-blue-50 text-blue-700';
  return (
    <div className={`mb-4 flex items-start justify-between rounded-md border p-2 ${color}`}>
      <div className="pr-3 text-sm">{text}</div>
      <button type="button" className="ml-3 rounded px-2 text-xs opacity-70 hover:opacity-100" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default function VerifyEmail({ status }: { status?: string }) {
  const { auth } = usePage().props as any;
  const email = auth?.user?.email as string | undefined;

  const { post, processing } = useForm({});
  const [notice, setNotice] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [cooldown, setCooldown] = useState(0); // seconds

  // reflect Laravel flash "verification-link-sent"
  useEffect(() => {
    if (status === 'verification-link-sent') {
      setNotice({ kind: 'success', text: 'Verification link sent. Check your inbox.' });
      setCooldown(10); // start a short cooldown
    }
  }, [status]);

  // auto-hide notice after 4s
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    router.post(
      route('verification.send'),
      {},
      {
        preserveScroll: true,
        onStart: () => setNotice({ kind: 'info', text: 'Sending verification email…' }),
        onSuccess: () => {
          setNotice({ kind: 'success', text: 'Verification link sent. Check your inbox.' });
          setCooldown(10);
        },
        onError: (errs) => {
          setNotice({
            kind: 'error',
            text:
              (errs as any)?.message ||
              'Could not send verification email. Please try again.',
          });
        },
        onFinish: () => {},
        onCancelToken: () => {},
        // Handle 429 too-many-requests gracefully
        onBefore: () => (cooldown > 0 ? false : true),
      }
    );
  };

  return (
    <AuthLayout
      title="Verify email"
      description={
        email
          ? `We've sent a verification link to ${email}.`
          : 'Please verify your email address by clicking on the link we just emailed to you.'
      }
    >
      <Head title="Email verification" />

      {notice && <Notice kind={notice.kind} text={notice.text} onClose={() => setNotice(null)} />}

      <form onSubmit={submit} className="space-y-6 text-center">
        <Button
          disabled={processing || cooldown > 0}
          variant="secondary"
          type="submit"
        >
          {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
        </Button>

        <p className="mt-2 text-xs text-muted-foreground">
          Didn’t get it? Check Spam/Junk, or wait a few seconds before resending.
        </p>

        <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
          Log out
        </TextLink>
      </form>
    </AuthLayout>
  );
}
