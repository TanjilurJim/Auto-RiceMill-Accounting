import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { route } from "ziggy-js"; // ✅ ensure TS knows about `route(...)`
import { useTranslation } from "../../components/useTranslation";

interface Row {
  date: string;
  voucher_no: string;
  supplier: string; // account ledger name
  item: string; // item details / name
  total_qty: number | string;
  price_each: number | string;
  net_amount: number | string;
  unit_name: string; // ✅ was used but missing in the interface
}

interface Company {
  company_name: string;
  email?: string;
  mobile?: string;
  address?: string;
  logo_path?: string;
  logo_url?: string;
  logo_thumb_url?: string;
  website?: string;
  financial_year?: string; // string, not varchar
}

export default function PurchaseCategoryReport({
  entries,
  filters,
  company,
}: {
  entries: Row[];
  filters: { from_date: string; to_date: string; category_id?: string };
  company: Company;
}) {
  const t = useTranslation();

  // helpers
  const toNum = (v: number | string | undefined) => Number(v ?? 0);
  const fmt2 = (v: number | string | undefined) => toNum(v).toFixed(2);

  // totals
  const totalQty = entries.reduce((s, r) => s + toNum(r.total_qty), 0);
  const totalAmt = entries.reduce((s, r) => s + toNum(r.net_amount), 0);

  // print
  const handlePrint = () => window.print();

  // grand total by unit
  const qtyByUnit = entries.reduce<Record<string, number>>((acc, r) => {
    const unit = r.unit_name || "-";
    acc[unit] = (acc[unit] || 0) + toNum(r.total_qty);
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="max-w-full space-y-4 p-4">
        <Head title={t("purchaseCategoryReportTitle")} />
        <Card className="shadow-lg">
          {/* ── Header ───────────────────────────────────────────── */}
          <CardHeader className="relative bg-background py-6 text-center">
            {/* company block */}
            <div className="space-y-1">
              {company?.logo_url && (
                <img
                  src={company.logo_url}
                  alt={t("repCompanyLogoAlt")}
                  className="mx-auto mb-2 h-20 object-contain print:h-12"
                />
              )}
              <h1 className="text-3xl font-bold uppercase">
                {company?.company_name ?? "Company Name"}
              </h1>
              {company?.address && (
                <p className="text-foreground text-sm">{company.address}</p>
              )}
              {company?.mobile && (
                <p className="text-foreground text-sm">
                  {t("repPhoneText")}: {company.mobile}
                </p>
              )}
              {(company?.email || company?.website) && (
                <p className="text-foreground text-sm">
                  {company?.email && <span>{company.email}</span>}
                  {company?.email && company?.website && (
                    <span className="mx-1">|</span>
                  )}
                  {company?.website && <span>{company.website}</span>}
                </p>
              )}
            </div>

            {/* title + date range */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold underline">
                Category-wise Purchase Report
              </h2>
              <p className="text-foreground text-sm">
                From: <strong>{filters.from_date}</strong>, To:{" "}
                <strong>{filters.to_date}</strong>
              </p>
            </div>

            {/* “Change filters” link */}
            <div className="absolute right-4 top-4 print:hidden">
              <Link
                href={route("reports.purchase.filter", { tab: "category" })}
                className="text-sm text-blue-600 hover:underline"
              >
                {t("repChangeFiltersText") || "Change Filters"}
              </Link>
            </div>
          </CardHeader>

          {/* ── Body ─────────────────────────────────────────────── */}
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                <thead className="bg-background print:bg-white">
                  <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Vch&nbsp;No</th>
                    <th className="border px-2 py-1">Account&nbsp;Ledger</th>
                    <th className="border px-2 py-1">Item&nbsp;Details</th>
                    <th className="border px-2 py-1 text-right">Total&nbsp;Qty</th>
                    <th className="border px-2 py-1">Unit</th>
                    <th className="border px-2 py-1 text-right">
                      Price&nbsp;(each)
                    </th>
                    <th className="border px-2 py-1 text-right">
                      Total&nbsp;Price&nbsp;(Tk)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length ? (
                    <>
                      {entries.map((r, i) => (
                        <tr key={i} className="print:bg-white">
                          <td className="border px-2 py-1">{i + 1}</td>
                          <td className="border px-2 py-1">
                            {new Date(r.date).toLocaleDateString()}
                          </td>
                          <td className="border px-2 py-1">{r.voucher_no}</td>
                          <td className="border px-2 py-1">{r.supplier}</td>
                          <td className="border px-2 py-1">{r.item}</td>
                          <td className="border px-2 py-1 text-right">
                            {fmt2(r.total_qty)}
                          </td>
                          <td className="border px-2 py-1">{r.unit_name}</td>
                          <td className="border px-2 py-1 text-right">
                            {fmt2(r.price_each)}
                          </td>
                          <td className="border px-2 py-1 text-right">
                            {fmt2(r.net_amount)}
                          </td>
                        </tr>
                      ))}

                      {/* totals row */}
                      <tr className="bg-background font-semibold print:bg-white">
                        <td className="border px-2 py-1 text-right" colSpan={5}>
                          Grand&nbsp;Total
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {totalQty.toFixed(2)}
                        </td>
                        <td className="border px-2 py-1" />
                        <td className="border px-2 py-1 text-right" colSpan={2}>
                          {totalAmt.toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      {/* ✅ 9 columns total */}
                      <td
                        colSpan={9}
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        No purchase data found.
                      </td>
                    </tr>
                  )}

                  {/* qty by unit */}
                  <tr className="bg-background font-semibold print:bg-white">
                    <td className="border px-2 py-2 text-sm font-medium" colSpan={9}>
                      <strong>Total Qty by Unit:</strong>
                      <ul className="text-foreground mt-1 list-disc space-y-0.5 pl-5 text-sm">
                        {Object.entries(qtyByUnit).map(([unit, qty]) => (
                          <li key={unit}>
                            {qty.toFixed(2)} {unit}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Action buttons ───────────────────────── */}
            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>

              <a
                href={route("reports.purchase.export", {
                  tab: "category",
                  type: "pdf",
                  ...filters,
                })}
                target="_blank"
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileText className="h-4 w-4" />
                Save&nbsp;as&nbsp;PDF
              </a>

              <a
                href={route("reports.purchase.export", {
                  tab: "category",
                  type: "xlsx",
                  ...filters,
                })}
                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export&nbsp;Excel
              </a>
            </div>
          </CardContent>

          {/* ── Footer ─────────────────────────────────── */}
          <div className="text-muted-foreground flex justify-between px-6 pb-6 text-sm">
            <span>Generated on {new Date().toLocaleString()}</span>
            <span>
              {company?.company_name}
              {company?.email ? ` • ${company.email}` : ""}
            </span>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
