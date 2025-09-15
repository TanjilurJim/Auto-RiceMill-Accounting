import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Salesman {
  id: number;
  salesman_code: string;
  name: string;
  phone_number: string;
  email?: string;
  address?: string;
  created_by_user?: { name: string };
}

export default function SalesmanIndex({ salesmen }: { salesmen: Salesman[] }) {
  const handleDelete = (id: number) => {
    confirmDialog({}, () => router.delete(`/salesmen/${id}`));
  };

  const columns = [
    {
      header: '#',
      accessor: (_: any, index?: number) => (index !== undefined ? index + 1 : '-'),
      className: 'text-center',
    },
    { header: 'Salesman Code', accessor: 'salesman_code' },
    { header: 'Salesman Name', accessor: 'name' },
    { header: 'Phone Number', accessor: 'phone_number' },
    { header: 'E-mail', accessor: (row: Salesman) => row.email || 'N/A' },
    { header: 'Address', accessor: (row: Salesman) => row.address || 'N/A' },
    { header: 'Created By', accessor: (row: Salesman) => row.created_by_user?.name || 'N/A' },
  ];

  return (
    <AppLayout>
      <Head title="All Salesmen" />

      {/* Page background adapts to theme */}
      <div className="bg-background h-full w-screen md:p-6 lg:w-full">
        {/* Card surface with border + correct text color */}
        <div className="bg-background h-full rounded-lg p-3 md:p-6">
          <PageHeader title="All Salesmen" addLinkHref="/salesmen/create" addLinkText="+ Add New" />

          <TableComponent
            columns={columns}
            data={salesmen}
            actions={(salesman) => (
              <ActionButtons
                editHref={`/salesmen/${salesman.id}/edit`}
                onDelete={() => handleDelete(salesman.id)}
              />
            )}
            noDataMessage="No salesmen found."
          />
        </div>
      </div>
    </AppLayout>
  );
}
