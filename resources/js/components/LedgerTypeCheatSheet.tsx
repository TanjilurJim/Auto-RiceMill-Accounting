// components/LedgerTypeCheatSheet.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const cheatSheetData = [
  // Assets
  { type: "Customer (Accounts Receivable)", group: "Sundry Debtors", side: "Debit", rule: "Enter outstanding customer dues if migrating; else 0" },
  { type: "Cash / Bank", group: "Cash-in-Hand / Bank Account", side: "Debit", rule: "Enter actual opening balance; else 0" },
  { type: "Inventory – Tracks goods in stock", group: "Current Assets", side: "Debit", rule: "0 for new; enter stock value if migrating" },

  // Liabilities & Equity
  { type: "Supplier (Accounts Payable)", group: "Sundry Creditors", side: "Credit", rule: "Enter outstanding payables if migrating; else 0" },
  { type: "Liability (General)", group: "Current Liabilities / Loans", side: "Credit", rule: "Enter outstanding loan/dues if migrating; else 0" },
  { type: "Equity / Capital", group: "Capital Account", side: "Credit", rule: "Enter opening capital if migrating; else 0" },

  // Income
  { type: "Sales Income – From customer sales", group: "Direct Income", side: "Credit", rule: "Always 0; increases with sales vouchers" },
  { type: "Other Income – Miscellaneous earnings", group: "Non Operating Income", side: "Credit", rule: "Always 0; increases with income entries" },

  // Expenses
  { type: "COGS (Cost of Goods Sold)", group: "Direct Expenses", side: "Debit", rule: "Always 0; system posts cost when items are sold" },
  { type: "Operating Expense", group: "Indirect Expenses", side: "Debit", rule: "Always 0; increases as expenses are recorded" },
];

export default function LedgerTypeCheatSheet() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">📊 Ledger Type Cheat Sheet</Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[95vw] lg:max-w-[1400px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Ledger Type Mapping Guide</DialogTitle>
        </DialogHeader>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ledger Type</TableHead>
                <TableHead>Typical Account Group</TableHead>
                <TableHead>Debit / Credit</TableHead>
                <TableHead>Opening Balance Rule</TableHead>
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

        <p className="mt-2 text-xs text-muted-foreground">
          Notes: A/R and A/P are <strong>Balance Sheet</strong> ledgers (Assets/Liabilities) and do not hit P&L. Only
          Income/Expense (incl. COGS) affect the Profit &amp; Loss report. For Cash/Bank you may choose “Cash-in-Hand”
          or “Bank Account” as the group. For “Other Income” you can use “Non Operating Income” (or “Indirect Income” if preferred).
        </p>
      </DialogContent>
    </Dialog>
  );
}
