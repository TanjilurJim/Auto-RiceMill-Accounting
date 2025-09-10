// components/LedgerTypeCheatSheet.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const cheatSheetData = [
  { type: "Inventory – Tracks goods in stock", group: "Current Assets", side: "Debit", rule: "0 for new; enter stock value if migrating" },
  { type: "COGS – Cost of goods sold", group: "Direct Expenses", side: "Debit", rule: "Always 0; accumulates as sold" },
  { type: "Sales Income – From customer sales", group: "Direct Income", side: "Credit", rule: "Always 0; accumulates with sales" },
  { type: "Purchase Payable – Amounts owed to suppliers", group: "Current Liabilities / Sundry Creditors", side: "Credit", rule: "Enter outstanding payables if migrating; else 0" },
  { type: "Cash / Bank – Your physical or bank balance", group: "Cash-in-Hand / Bank Account", side: "Debit", rule: "Enter actual opening cash/bank balance; else 0" },
  { type: "Receive Mode – Where money is received", group: "Current Assets (control)", side: "Debit", rule: "Usually 0; transaction link only" },
  { type: "Payment Mode – Where money is paid from", group: "Current Assets / Liabilities", side: "Credit/Debit", rule: "Usually 0; control account only" },
  { type: "Expense – Regular operational expenses", group: "Indirect Expenses", side: "Debit", rule: "Always 0; accumulates as incurred" },
  { type: "Other Income – Miscellaneous earnings", group: "Indirect Income", side: "Credit", rule: "Always 0; accumulates as transactions happen" },
  { type: "Liability – Loans or obligations", group: "Loans (Liability) / Non-Current Liabilities", side: "Credit", rule: "Enter outstanding loan if migrating; else 0" },
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
      </DialogContent>
    </Dialog>
  );
}
