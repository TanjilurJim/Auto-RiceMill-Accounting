import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import PageHeader from '@/components/PageHeader'
import { Head, router, useForm } from '@inertiajs/react'

export default function AllReceivablePayableFilter() {
  const { data, setData, processing } = useForm({
    from_date: '',
    to_date: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(route('reports.receivable-payable'), data, { preserveState: true })
  }

  return (
    <AppLayout>
      <Head title="Receivable & Payable — Filter" />

      <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
        <div className="bg-white h-full rounded-lg p-6">

          <PageHeader title="Receivable & Payable Report Filter" />

          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date range fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="from-date" className="text-gray-700">
                      From Date
                    </Label>
                    <Input
                      id="from-date"
                      type="date"
                      value={data.from_date}
                      onChange={e => setData('from_date', e.target.value)}
                      required
                      className="h-10 w-full rounded-md border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-date" className="text-gray-700">
                      To Date
                    </Label>
                    <Input
                      id="to-date"
                      type="date"
                      value={data.to_date}
                      onChange={e => setData('to_date', e.target.value)}
                      required
                      className="h-10 w-full rounded-md border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
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
