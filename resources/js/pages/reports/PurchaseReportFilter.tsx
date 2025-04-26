import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm } from "@inertiajs/react";
import React, { useState } from "react";

interface Props {
  tab: "category" | "item" | "party" | "return" | "all";
  categories: { id: number; name: string }[];
  items: { id: number; item_name: string }[];
  suppliers: { id: number; name: string }[];
}

const tabs = [
  { key: "category", label: "Category-wise" },
  { key: "item",     label: "Item-wise" },
  { key: "party",    label: "Party-wise" },
  { key: "return",   label: "Purchase Returns" },
  { key: "all",      label: "All Purchases" },
];

export default function PurchaseReportFilter({
  tab, categories, items, suppliers
}: Props) {
  const [activeTab, setActiveTab] = useState(tab ?? "category");

  const { data, setData, get, processing, errors } = useForm({
    from_date: "",
    to_date:   "",
    category_id: "",
    item_id:     "",
    supplier_id: "",
  });

  /* ——— submit -> /reports/purchase/<tab> ——— */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    get(
      route("reports.purchase.index", { tab: activeTab }),   // /category, /item, etc
      { preserveState: true, preserveScroll: true }
    );
  };

  /* helper for conditional dropdown */
  const is = (k: string) => activeTab === k;

  return (
    <AppLayout title="Purchase Report Filter">
      <Head title="Purchase Report" />

      <div className="mx-auto max-w-6xl p-4">
        <Card className="shadow-xl">

          {/* ── Header + tab bar ───────────────────────────── */}
          <CardHeader className="border-b bg-gray-50 px-6 py-4">
            <h2 className="text-2xl font-semibold">Generate Purchase Report</h2>
            <nav className="mt-4 border-b border-gray-200">
              <ul className="-mb-px flex space-x-4">
                {tabs.map(t => (
                  <li key={t.key}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab(t.key);
                        router.replace(
                          route("reports.purchase.filter", { tab: t.key })
                        );
                      }}
                      className={`inline-block px-3 py-2 text-sm font-medium ${
                        activeTab === t.key
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                    >
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </CardHeader>

          {/* ── Form ───────────────────────────────────────── */}
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* From Date */}
                <div>
                  <label className="block text-sm font-medium">From Date *</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300"
                    value={data.from_date}
                    onChange={e => setData("from_date", e.target.value)}
                  />
                  {errors.from_date && <p className="text-sm text-red-500">{errors.from_date}</p>}
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-medium">To Date *</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300"
                    value={data.to_date}
                    onChange={e => setData("to_date", e.target.value)}
                  />
                  {errors.to_date && <p className="text-sm text-red-500">{errors.to_date}</p>}
                </div>

                {/* Conditional extra dropdowns */}
                {is("category") && (
                  <div>
                    <label className="block text-sm font-medium">
                      Category <span className="text-gray-400">(optional)</span>
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300"
                      value={data.category_id}
                      onChange={e => setData("category_id", e.target.value)}
                    >
                      <option value="">— All Categories —</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {is("item") && (
                  <div>
                    <label className="block text-sm font-medium">
                      Item <span className="text-gray-400">(optional)</span>
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300"
                      value={data.item_id}
                      onChange={e => setData("item_id", e.target.value)}
                    >
                      <option value="">— All Items —</option>
                      {items.map(i => (
                        <option key={i.id} value={i.id}>{i.item_name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {is("party") && (
                  <div>
                    <label className="block text-sm font-medium">
                      Supplier <span className="text-gray-400">(optional)</span>
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300"
                      value={data.supplier_id}
                      onChange={e => setData("supplier_id", e.target.value)}
                    >
                      <option value="">— All Suppliers —</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={processing}>View Report</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
