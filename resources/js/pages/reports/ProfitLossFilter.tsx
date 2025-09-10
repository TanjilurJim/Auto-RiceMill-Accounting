import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import AppLayout from '@/layouts/app-layout'
import PageHeader from '@/components/PageHeader'
import { Head, router, useForm } from '@inertiajs/react'

export default function ProfitLossFilter() {
  const { data, setData, processing } = useForm({
    from_date: '',
    to_date: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(route('reports.profit-loss'), data, { preserveState: true })
  }

  return (
    <AppLayout>
      <Head title="Profit & Loss — Filter" />

      <div className="bg-background p-6 h-full w-screen lg:w-full">
        <div className="bg-background h-full rounded-lg p-6">

          <PageHeader title="Profit & Loss Filter" />

          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <InputCalendar
                      value={data.from_date}
                      onChange={val => setData('from_date', val)}
                      label="From Date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <InputCalendar
                      value={data.to_date}
                      onChange={val => setData('to_date', val)}
                      label="To Date"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="min-w-[150px]"
                  >
                    {processing ? 'Processing…' : 'Generate Report'}
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
