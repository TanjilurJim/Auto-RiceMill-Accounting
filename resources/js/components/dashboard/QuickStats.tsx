import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, DollarSign, ShoppingBag, UserPlus2 } from 'lucide-react';

interface QuickStatProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

function QuickStat({ title, value, change, trend, icon }: QuickStatProps) {
  return (
    <Card>
      <CardContent className="flex flex-row items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
          <p className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStats() {
  const stats = [
    {
      title: "Today's Sales",
      value: '৳45,231.89',
      change: '+20.1%',
      trend: 'up' as const,
      icon: <DollarSign className="h-6 w-6 text-primary" />,
    },
    {
      title: 'New Customers',
      value: '356',
      change: '+32.5%',
      trend: 'up' as const,
      icon: <UserPlus2 className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Total Orders',
      value: '2,420',
      change: '-4.2%',
      trend: 'down' as const,
      icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Avg. Order Value',
      value: '৳1,250',
      change: '+12.3%',
      trend: 'up' as const,
      icon: <CalendarDays className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <QuickStat key={stat.title} {...stat} />
      ))}
    </div>
  );
}
