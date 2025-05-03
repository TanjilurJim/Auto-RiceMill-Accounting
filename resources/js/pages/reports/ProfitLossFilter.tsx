import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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

      <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
        <div className="bg-white h-full rounded-lg p-6">

          <PageHeader title="Profit & Loss Filter" />

          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="from-date">From Date</Label>
                    <Input
                      id="from-date"
                      type="date"
                      value={data.from_date}
                      onChange={e => setData('from_date', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-date">To Date</Label>
                    <Input
                      id="to-date"
                      type="date"
                      value={data.to_date}
                      onChange={e => setData('to_date', e.target.value)}
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
