/* resources/js/Pages/dryers/Index.tsx
   -------------------------------------------------------------------------- */
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import ActionButtons from '@/components/ActionButtons';

import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
interface Row {
  id: number;
  dryer_name: string;
  dryer_type: string | null;
  capacity: string | number;
  manufacturer: string | null;
}

interface Paginator {
  data: Row[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  last_page: number;
  total: number;
}

interface PageProps {
  dryers: Paginator;
  filters: { q: string | null };
}

/* -------------------------------------------------------------------------- */
export default function Index({ dryers, filters }: PageProps) {
  /* ───────── state & debounce search ───────── */
  const [q, setQ] = useState(filters.q ?? '');

  useEffect(() => {
    const t = setTimeout(() => {
      router.get(route('dryers.index'), { q }, { preserveState: true, replace: true });
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  /* ───────── helpers ───────── */
  const fmt = (n: number | string) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(Number(n));

  const del = (id: number) => {
    if (confirm('Delete this dryer?')) router.delete(route('dryers.destroy', id));
  };

  /* ───────── table definition ───────── */
  const columns = [
    { header: 'Name',          accessor: 'dryer_name' },
    { header: 'Type',          accessor: (r: Row) => r.dryer_type ?? '—' },
    { header: 'Capacity (t)',  accessor: (r: Row) => fmt(r.capacity), className: 'text-right' },
    { header: 'Manufacturer',  accessor: (r: Row) => r.manufacturer ?? '—' },
  ];

  const actions = (row: Row) => (
    <ActionButtons
      size="sm"
      viewHref={route('dryers.show', row.id)}
      viewText={<Eye size={16} />}
      editHref={route('dryers.edit', row.id)}
      editText={<Edit size={16} />}
      onDelete={() => del(row.id)}
      deleteText={<Trash2 size={16} />}
      className="justify-end"
    />
  );

  /* ───────── render ───────── */
  return (
    <AppLayout title="Dryers">
      
    <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
      <PageHeader title="Dryers" addLinkHref='/dryers/create' addLinkText="+ Add New" />

      {/* Search box */}
      {/* <div className="mb-3">
        <input
          type="text"
          className="form-control max-w-xs"
          placeholder="Search dryer name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div> */}

      {/* Table */}
      <TableComponent<Row>
        columns={columns}
        data={dryers.data}
        actions={actions}
        noDataMessage="No dryers found."
      />

      {/* Pagination */}
      <Pagination links={dryers.links} className="mt-4" />
      </div>
      </div>
    </AppLayout>
  );
}
