import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import AppLayout from '@/layouts/app-layout'
import PageHeader from '@/components/PageHeader'
import { Head, router, useForm } from '@inertiajs/react'
import dayjs from 'dayjs'
import { useTranslation } from '@/components/useTranslation';
export default function AllReceivedPaymentFilter() {
          const today = dayjs().format('YYYY-MM-DD');

  const { data, setData, processing } = useForm({
    from_date: today,
    to_date: today,
    type: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(route('reports.all-received-payment'), data, { preserveState: true })
  }
const t = useTranslation();
  return (
    <AppLayout>
      <Head title="Received & Payment — Filter" />

      <div className="bg-background p-6 h-full w-screen lg:w-full">
        <div className="bg-background h-full rounded-lg p-6">

          <PageHeader title="Received & Payment Report Filter" />

          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date range fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <InputCalendar
                      value={data.from_date}
                      onChange={val => setData('from_date', val)}
                      label={t('fromDateLabel')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <InputCalendar
                      value={data.to_date}
                      onChange={val => setData('to_date', val)}
                      label={t('toDateLabel')}
                      required
                    />
                  </div>
                </div>
                {/* NEW: Type */}
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      value={data.type}
                      onChange={(e) => setData('type', e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="Received">Received</option>
                      <option value="Payment">Payment</option>
                    </select>
                  </div>
                
                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="min-w-[150px] bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500"
                  >
                    {processing ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Generate Report'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
