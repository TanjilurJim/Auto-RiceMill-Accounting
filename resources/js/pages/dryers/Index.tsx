/* resources/js/Pages/dryers/Index.tsx
   -------------------------------------------------------------------------- */
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';

import { Head, router } from '@inertiajs/react';
import { Edit, Eye, Trash2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    confirmDialog({}, () => {
      router.delete(route('dryers.destroy', id));
    });
  };

  /* ───────── table definition ───────── */
  const columns = [
    { header: 'Name', accessor: 'dryer_name' },
    { header: 'Type', accessor: (r: Row) => r.dryer_type ?? '—' },
    { header: 'Capacity (t)', accessor: (r: Row) => fmt(r.capacity), className: 'text-right' },
    { header: 'Manufacturer', accessor: (r: Row) => r.manufacturer ?? '—' },
  ];

  const actions = (row: Row) => (
    <ActionButtons
      size="md"
      viewHref={route('dryers.show', row.id)}
      viewText={<Eye size={16} />}
      editHref={route('dryers.edit', row.id)}
      editText={<Edit size={16} />}
      onDelete={() => del(row.id)}
      deleteText={<Trash2 size={16} />}
      className="justify-center"
    />
  );

  /* ───────── render ───────── */
  return (
    <AppLayout title="Dryers">
      <Head title="Dryers" />

      <div className="w-full p-4 md:p-12">
        <div className=" text-foreground">
          <PageHeader title="Dryers" addLinkHref="/dryers/create" addLinkText="+ Add New" />

          {/* Search box (optional) */}
          {/* Uncomment to show search */}
          {/* <div className="mb-3">
            <div className="relative max-w-xs">
              <input
                type="text"
                className="w-full rounded-md border bg-background p-2 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Search dryer name…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Search className="text-muted-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div> */}

          {/* Table container */}
          {dryers.data.length > 0 ? (<div className="rounded-sm border">
            <TableComponent<Row>
              columns={columns}
              data={dryers.data}
              actions={actions}
              noDataMessage="No dryers found."
            />
          </div>) : (
            <div className="my-16 flex flex-col items-center justify-center space-y-2 text-center">
              <h3 className="text-lg font-medium">No dryers found</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Get started by adding a new dryer. Click the button below to add your first dryer.
              </p>
            </div>)}

          {/* Pagination */}
            {dryers.data.length > 0 && (
                <div className="mt-4">
                <Pagination
                  links={dryers.links}
                  currentPage={dryers.current_page}
                  lastPage={dryers.last_page}
                  total={dryers.total}
                />
                </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
}
