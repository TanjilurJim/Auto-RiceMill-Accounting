// components/LedgerTypeCheatSheet.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from './useTranslation';

export default function LedgerTypeCheatSheet() {
    const i = useTranslation();

    const cheatSheetData = [
        // Assets
        {
            type: i('customerAccountsReceivable'),
            group: i('sundryDebtors'),
            side: i('debit'),
            rule: i('customerDuesRule'),
        },
        { type: i('cashBank'), group: i('cashInHandBankAccount'), side: i('debit'), rule: i('actualOpeningBalanceRule') },
        { type: i('inventoryTracksGoods'), group: i('currentAssets'), side: i('debit'), rule: i('inventoryRule') },

        // Liabilities & Equity
        { type: i('supplierAccountsPayable'), group: i('sundryCreditors'), side: i('credit'), rule: i('supplierPayablesRule') },
        {
            type: i('liabilityGeneral'),
            group: i('currentLiabilitiesLoans'),
            side: i('credit'),
            rule: i('liabilityRule'),
        },
        { type: i('equityCapital'), group: i('capitalAccount'), side: i('credit'), rule: i('equityRule') },

        // Income
        { type: i('salesIncome'), group: i('directIncome'), side: i('credit'), rule: i('salesIncomeRule') },
        {
            type: i('otherIncome'),
            group: i('nonOperatingIncome'),
            side: i('credit'),
            rule: i('otherIncomeRule'),
        },

        // Expenses
        { type: i('cogs'), group: i('directExpenses'), side: i('debit'), rule: i('cogsRule') },
        { type: i('operatingExpense'), group: i('indirectExpenses'), side: i('debit'), rule: i('operatingExpenseRule') },
    ];
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    {i('ledgerTypeCheatSheetButton')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] w-full sm:max-w-[95vw] lg:max-w-[1400px]">
                <DialogHeader>
                    <DialogTitle>{i('ledgerTypeMappingGuide')}</DialogTitle>
                </DialogHeader>

                <div className="overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{i('ledgerType')}</TableHead>
                                <TableHead>{i('typicalAccountGroup')}</TableHead>
                                <TableHead>{i('debitCreditCol')}</TableHead>
                                <TableHead>{i('openingBalanceRule')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cheatSheetData.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.group}</TableCell>
                                    <TableCell>{row.side}</TableCell>
                                    <TableCell>{row.rule}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <p className="text-muted-foreground mt-2 text-xs">{i('ledgerTypeNotes')}</p>
            </DialogContent>
        </Dialog>
    );
}
