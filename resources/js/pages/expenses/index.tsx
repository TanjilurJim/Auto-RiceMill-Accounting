// File: resources/js/Pages/expenses/index.jsx
import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Plus, Search } from "lucide-react";
import AppLayout from "@/layouts/app-layout";

function currency(n){
  if(n === null || n === undefined) return "—";
  return new Intl.NumberFormat(undefined, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function ExpensesIndex(){
  const { props } = usePage();
  const { expenses, filters } = props;

  return (
    <>
    <AppLayout>
      <Head title="Expenses" />
      <div className="space-y-4 mx-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <Button asChild>
            <Link href={route('expenses.create')}>
              <Plus className="mr-2 h-4 w-4" /> New Expense
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="get" className="grid md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label htmlFor="q">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
                  <Input id="q" name="q" defaultValue={filters?.q || ''} className="pl-8" placeholder="Voucher or note" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="from">From</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
                  <Input id="from" name="from" type="date" defaultValue={filters?.from || ''} className="pl-8" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="to">To</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
                  <Input id="to" name="to" type="date" defaultValue={filters?.to || ''} className="pl-8" />
                </div>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full">Apply</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Date</TableHead>
                    <TableHead>Voucher</TableHead>
                    <TableHead>Expense Head</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Paid Via</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses?.data?.length ? expenses.data.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.date}</TableCell>
                      <TableCell>{e.voucher_no}</TableCell>
                      <TableCell>
                        {e.expense_ledger?.account_ledger_name || e.expense_ledger?.name || '—'}
                        {e.expense_ledger?.group_under_id && (
                          <Badge variant="secondary" className="ml-2">G{e.expense_ledger.group_under_id}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">{currency(e.amount)}</TableCell>
                      <TableCell>
                        {e.payment_ledger ? (
                          <Badge>Cash/Bank</Badge>
                        ) : e.supplier_ledger ? (
                          <Badge variant="outline">A/P</Badge>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={route('expenses.show', e.id)}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No expenses found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {expenses?.links && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="text-muted-foreground">Showing {expenses.from || 0}-{expenses.to || 0} of {expenses.total || 0}</div>
                <div className="flex gap-2">
                  {expenses.links.map((l, idx) => (
                    <Link key={idx} href={l.url || ''} preserveScroll className={`px-3 py-1 rounded-md border ${l.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'} ${!l.url ? 'pointer-events-none opacity-50' : ''}`}>{l.label.replace('&laquo;','«').replace('&raquo;','»')}</Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </AppLayout>
    </>
    
  );
}

