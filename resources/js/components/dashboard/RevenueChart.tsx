import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '../useTranslation';

export function RevenueChart() {
  const [Chart, setChart] = useState<any>(null);
  const t = useTranslation();

  useEffect(() => {
    // Import ApexCharts dynamically on client-side only
    import('react-apexcharts').then((mod) => {
      setChart(() => mod.default);
    });
  }, []);
  const [period, setPeriod] = React.useState('7d');

  const options = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [50, 100, 100]
      }
    },
    xaxis: {
      categories: [t('chartMon'), t('chartTue'), t('chartWed'), t('chartThu'), t('chartFri'), t('chartSat'), t('chartSun')],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4 },
    colors: ['#3b82f6']
  };

  const series = [
    {
      name: 'Revenue',
      data: [30500, 45000, 35000, 50000, 49000, 60000, 70000],
    }
  ];



  return (
    <Card className="col-span-full shadow-sm xl:col-span-8 ">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium">{t('revenueOverview')}</CardTitle>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('selectPeriod')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">{t('last7Days')}</SelectItem>
            <SelectItem value="30d">{t('last30Days')}</SelectItem>
            <SelectItem value="90d">{t('last90Days')}</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          {!Chart && (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
          {Chart && (
            <Chart
              options={options as any}
              series={series}
              type="area"
              height="100%"
              width="100%"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
