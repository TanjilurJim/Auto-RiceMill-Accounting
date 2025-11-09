// File: resources/js/Pages/expenses/show.jsx
import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
function currency(n){
  if(n === null || n === undefined) return "—";
  return new Intl.NumberFormat(undefined, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function ExpenseShow(){
  const { props } = usePage();
  const { expense } = props;
  const jl = expense?.journal;

  return (
    <>
    <AppLayout>
      <Head title={`Expense ${expense?.voucher_no || expense?.id}`} />
      <div className="space-y-4 mx-2">
        <div className="flex justify-between gap-3">
          
          <h1 className="text-2xl font-semibold tracking-tight">Expense Details</h1>
          <Button variant="ghost" asChild><Link href={route('expenses.index')}><ChevronLeft className="h-4 w-4 mr-1"/>Back</Link></Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{expense.date}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Voucher</div>
                  <div className="font-medium">{expense.voucher_no}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Expense Head</div>
                  <div className="font-medium">{expense.expense_ledger?.account_ledger_name || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium">{currency(expense.amount)}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-muted-foreground">Note</div>
                  <div className="font-medium whitespace-pre-wrap">{expense.note || '—'}</div>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">Paid From</div>
                  <div className="font-medium">{expense.payment_ledger?.account_ledger_name || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Supplier (A/P)</div>
                  <div className="font-medium">{expense.supplier_ledger?.account_ledger_name || '—'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Journal</CardTitle>
            </CardHeader>
            <CardContent>
              {jl ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Voucher</div>
                  <div className="font-medium">{jl.voucher_no} — {jl.date}</div>

                  <div className="rounded-md border mt-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ledger</TableHead>
                          <TableHead className="text-right">Debit</TableHead>
                          <TableHead className="text-right">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jl.entries?.map((en) => (
                          <TableRow key={en.id}>
                            <TableCell>{en.ledger?.account_ledger_name || '—'}</TableCell>
                            <TableCell className="text-right">{en.type === 'debit' ? currency(en.amount) : ''}</TableCell>
                            <TableCell className="text-right">{en.type === 'credit' ? currency(en.amount) : ''}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No journal found.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </AppLayout>
    </>
  );
}