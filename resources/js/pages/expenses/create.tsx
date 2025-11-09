// File: resources/js/Pages/expenses/create.jsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function ExpenseCreate({ expenseLedgers = [], cashBankLedgers = [], supplierLedgers = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        date: new Date().toISOString().slice(0, 10),
        voucher_no: '',
        // pick existing OR type new
        expense_ledger_id: '',
        expense_ledger_name: '',
        group_under_id: 11,

        amount: '',
        note: '',

        pay_mode: 'cash_bank', // 'cash_bank' | 'supplier'
        payment_ledger_id: '',
        supplier_ledger_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // enforce XOR before submit
        if (data.pay_mode === 'cash_bank') {
            setData('supplier_ledger_id', '');
        } else {
            setData('payment_ledger_id', '');
        }
        post(route('expenses.store'));
    };

    return (
        <>
            <AppLayout>
                <Head title="New Expense" />
                <div className="space-y-4 mx-2">
                    <div className="flex justify-between gap-3">
                        
                        <h1 className="text-2xl font-semibold tracking-tight">Record Expense</h1>
                        <Button variant="ghost" asChild>
                            <Link href={route('expenses.index')}>
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>

                    <form onSubmit={submit} className="grid gap-4 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-base">Expense Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                                        {errors.date && <p className="text-destructive text-sm">{errors.date}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="voucher_no">Voucher No</Label>
                                        <Input
                                            id="voucher_no"
                                            value={data.voucher_no}
                                            onChange={(e) => setData('voucher_no', e.target.value)}
                                            placeholder="Auto if blank"
                                        />
                                        {errors.voucher_no && <p className="text-destructive text-sm">{errors.voucher_no}</p>}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label>Pick Existing Head</Label>
                                        <Select
                                            value={data.expense_ledger_id?.toString() || ''}
                                            onValueChange={(v) => {
                                                setData('expense_ledger_id', v);
                                                if (v) {
                                                    setData('expense_ledger_name', '');
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select expense head" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Operating Expenses</SelectLabel>
                                                    {expenseLedgers.map((l) => (
                                                        <SelectItem key={l.id} value={String(l.id)}>
                                                            {l.account_ledger_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.expense_ledger_id && <p className="text-destructive text-sm">{errors.expense_ledger_id}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Or Type New Head</Label>
                                        <Input
                                            value={data.expense_ledger_name}
                                            onChange={(e) => {
                                                setData('expense_ledger_name', e.target.value);
                                                if (e.target.value) {
                                                    setData('expense_ledger_id', '');
                                                }
                                            }}
                                            placeholder="e.g. Generator Fuel"
                                        />
                                        <p className="text-muted-foreground text-xs">Leave blank if you selected an existing head.</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-1">
                                        <Label>Group Under (for new head)</Label>
                                        <Select value={String(data.group_under_id)} onValueChange={(v) => setData('group_under_id', Number(v))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Common Groups</SelectLabel>
                                                    <SelectItem value="11">11 – Indirect Expenses (default)</SelectItem>
                                                    <SelectItem value="30">30 – Selling & Distribution</SelectItem>
                                                    <SelectItem value="31">31 – Administrative Overhead</SelectItem>
                                                    <SelectItem value="33">33 – Financial Expenses</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Amount</Label>
                                        <Input type="number" step="0.01" value={data.amount} onChange={(e) => setData('amount', e.target.value)} />
                                        {errors.amount && <p className="text-destructive text-sm">{errors.amount}</p>}
                                    </div>
                                    <div className="space-y-1 md:col-span-3">
                                        <Label>Note</Label>
                                        <Textarea
                                            value={data.note}
                                            onChange={(e) => setData('note', e.target.value)}
                                            placeholder="Optional description"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Payment Style</Label>
                                    <RadioGroup value={data.pay_mode} onValueChange={(v) => setData('pay_mode', v)} className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cash_bank" id="pm-cb" />
                                            <Label htmlFor="pm-cb">Pay Now (Cash/Bank)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="supplier" id="pm-sup" />
                                            <Label htmlFor="pm-sup">Accrue to Supplier (A/P)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {data.pay_mode === 'cash_bank' ? (
                                    <div className="space-y-1">
                                        <Label>Cash/Bank Ledger</Label>
                                        <Select
                                            value={data.payment_ledger_id?.toString() || ''}
                                            onValueChange={(v) => setData('payment_ledger_id', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select cash/bank" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cashBankLedgers.map((l) => (
                                                    <SelectItem key={l.id} value={String(l.id)}>
                                                        {l.account_ledger_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.payment_ledger_id && <p className="text-destructive text-sm">{errors.payment_ledger_id}</p>}
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <Label>Supplier (A/P)</Label>
                                        <Select
                                            value={data.supplier_ledger_id?.toString() || ''}
                                            onValueChange={(v) => setData('supplier_ledger_id', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {supplierLedgers.map((l) => (
                                                    <SelectItem key={l.id} value={String(l.id)}>
                                                        {l.account_ledger_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.supplier_ledger_id && <p className="text-destructive text-sm">{errors.supplier_ledger_id}</p>}
                                    </div>
                                )}

                                {(errors.expense_ledger_id || errors.expense_ledger_name) && (
                                    <Alert variant="destructive">
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>Validation</AlertTitle>
                                        <AlertDescription>Please fix the highlighted fields.</AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('expenses.index')}>Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Save
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Tips</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground space-y-2 text-sm">
                                <p>
                                    Either pick an existing expense head or type a new one. New heads default to{' '}
                                    <strong>Indirect Expenses (11)</strong>, but you can switch to Selling/Administrative/Financial groups for better
                                    P&L breakup.
                                </p>
                                <p>Choose exactly one: pay now from Cash/Bank or accrue to a Supplier (A/P).</p>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </AppLayout>
        </>
    );
}
