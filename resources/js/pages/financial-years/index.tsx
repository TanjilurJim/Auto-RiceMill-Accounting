import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Swal from 'sweetalert2';
import PageHeader from '@/components/PageHeader';
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import TableComponent from '@/components/TableComponent';

interface FinancialYear {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  is_closed: boolean;
}

export default function Index({ financialYears }: { financialYears: FinancialYear[] }) {
  const handleDelete = (id: number) => {

    confirmDialog(
      {}, () => {
        router.delete(`/financial-years/${id}`);
      }
    );

  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Start Date', accessor: 'start_date' },
    { header: 'End Date', accessor: 'end_date' },
    {
      header: 'Status',
      accessor: (row: any) =>
        row.is_closed ? (
          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Closed
          </span>
        ) : (
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Open
          </span>
        ),
      className: 'text-center',
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <ActionButtons
          editHref={`/financial-years/${row.id}/edit`}
          onDelete={() => handleDelete(row.id)}
        />
      ),
      className: 'text-center',
    },
  ];

  return (
    <AppLayout>
      <Head title="Financial Years" />

      <div className="bg-background p-4 md:p-12 h-full w-screen lg:w-full">
        <div className="bg-background h-full rounded-lg p-6">

          <PageHeader title="Financial Years" addLinkHref='/financial-years/create' addLinkText='+ Add Year' />

          {/* Table */}
          <TableComponent
            columns={columns}
            data={financialYears}
            noDataMessage="No financial years found."
          />
        </div>
      </div>

    </AppLayout>
  );
}
