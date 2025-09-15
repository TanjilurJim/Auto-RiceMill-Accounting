import AppLayout from "@/layouts/app-layout";
import SalesInboxTable from "./SalesInboxTable";

export default function RespInbox({ sales }) {
  return (
    <AppLayout title="Pending Responsible Approval">
      <div className="p-4 md:p-12">
        <h1 className="mb-4 text-xl font-semibold">Sales needing your Final Approval</h1>

      <SalesInboxTable
        sales={sales}
        approveRoute={id => `/sales/${id}/approve-final`}
        rejectRoute ={id => `/sales/${id}/reject`}
      />
      </div>
    </AppLayout>
  );
}
