import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const notifications = [
  {
    id: 1,
    title: 'New Order #1234',
    message: 'A new order has been placed worth ৳5,000',
    time: '2 minutes ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Payment Received',
    message: 'Payment of ৳12,000 received from Customer XYZ',
    time: '10 minutes ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Low Stock Alert',
    message: 'Item "Premium Rice" is running low on stock',
    time: '25 minutes ago',
    unread: false,
  },
  {
    id: 4,
    title: 'System Update',
    message: 'New features have been deployed successfully',
    time: '1 hour ago',
    unread: false,
  },
  {
    id: 5,
    title: 'Daily Report',
    message: 'Your daily sales report is ready for review',
    time: '2 hours ago',
    unread: false,
  },
];

export function NotificationsPanel() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Recent Notifications</CardTitle>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 rounded-lg border p-4 ${
                  notification.unread ? 'bg-primary/5' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{notification.title.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                {notification.unread && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
