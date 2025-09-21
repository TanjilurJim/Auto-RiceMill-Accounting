import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { SearchBar } from '@/components/ui/search-bar';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import ActionButtons from '@/components/ActionButtons';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useMemo } from 'react';

interface Godown {
  id: number;
  name: string;
  godown_code: string;
  address?: string;
}

interface PaginatedGodowns {
  data: Godown[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function GodownIndex({ godowns }: { godowns: PaginatedGodowns }) {
  const handleDelete = (id: number) => {
    confirmDialog({}, () => {
      router.delete(`/godowns/${id}`, {
        onSuccess: () => {
          // optional: keep list fresh after delete
          router.reload({ only: ['godowns'], preserveState: true, preserveScroll: true });
        },
      });
    });
  };

  // read the current "search" from the URL so pagination preserves it
  const currentSearch = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).get('search') ?? undefined;
    } catch {
      return undefined;
    }
  }, [typeof window !== 'undefined' ? window.location.search : '']);

  const columns = [
    { header: '#Id.No', accessor: 'id', className: 'text-center' },
    { header: 'Godown Name', accessor: 'name' },
    { header: 'Godown Id', accessor: 'godown_code' },
    { header: 'Description', accessor: (row: Godown) => row.address || 'N/A' },
  ];

  return (
    <AppLayout>
      <Head title="All List Of Godowns" />
        <div className="bg-background h-full w-screen lg:w-full p-4 md:p-12 text-card-foreground shadow-sm">
          <PageHeader title="All List Of Godowns" addLinkHref="/godowns/create" addLinkText="+ Add New" />

          {/* 🔍 Search Bar */}
          <div className="mb-4">
            <SearchBar endpoint="/godowns" placeholder="Search godowns..." />
          </div>

          {/* Table */}
          <TableComponent
            columns={columns}
            data={godowns.data}
            actions={(godown: Godown) => (
              <ActionButtons editHref={`/godowns/${godown.id}/edit`} onDelete={() => handleDelete(godown.id)} />
            )}
            noDataMessage="No godowns found."
          />

          {/* Pagination */}
          <Pagination
            links={godowns.links}
            currentPage={godowns.current_page}
            lastPage={godowns.last_page}
            total={godowns.total}
            onPageChange={(url) => {
              if (!url) return;
              // Use the link’s URL to extract the target page, but keep our current "search"
              const urlObj = new URL(url, window.location.origin);
              const page = urlObj.searchParams.get('page') ?? undefined;

              router.get(
                '/godowns',
                { search: currentSearch, page },
                {
                  preserveState: true,
                  preserveScroll: true,
                  replace: true,
                  only: ['godowns'], // fetch only what this page needs
                }
              );
            }}
          />
        </div>

    </AppLayout>
  );
}
