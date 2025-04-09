import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Employee {
  id: number;
  name: string;
}

interface ReceivedMode {
  id: number;
  mode_name: string;
}

interface SalaryReceive {
  vch_no: string;
  date: string;
  employee: Employee;
  receivedMode: ReceivedMode;
  amount: string;
  description: string | null;
}

export default function SalaryReceiveView({ salaryReceive }: { salaryReceive: SalaryReceive }) {
  return (
    <AppLayout>
      <Head title="Salary Receive Details" />
      <div className="bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold">Salary Receive Details</h1>
        <div className="space-y-4 bg-white p-6 shadow-md">
          <div>
            <h3 className="font-semibold">Voucher No: </h3>
            <p>{salaryReceive.vch_no}</p>
          </div>
          <div>
            <h3 className="font-semibold">Date: </h3>
            <p>{salaryReceive.date}</p>
          </div>
          <div>
            <h3 className="font-semibold">Employee: </h3>
            <p>{salaryReceive.employee.name}</p>
          </div>
          <div>
            <h3 className="font-semibold">Received Mode: </h3>
            <p>{salaryReceive.receivedMode.mode_name}</p>
          </div>
          <div>
            <h3 className="font-semibold">Amount: </h3>
            <p>{salaryReceive.amount}</p>
          </div>
          <div>
            <h3 className="font-semibold">Description: </h3>
            <p>{salaryReceive.description || 'No description available'}</p>
          </div>
          <Link href="/salary-receives" className="bg-gray-300 text-gray-700 p-2 rounded">
            Back to Salary Receives
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
