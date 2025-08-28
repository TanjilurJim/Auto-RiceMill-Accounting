// resources/ts/Pages/dashboard/AdminDashboard.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { ArrowRight, CircleUser, Search, Shield, Users, UserPlus, CheckCircle2 } from 'lucide-react';

/**
 * Admin Dashboard — UI-first skeleton
 * ------------------------------------------------------------
 * Data contract (server → Inertia → page props):
 * {
 *   stats: {
 *     totalUsers: number;
 *     activeUsers: number;
 *     newThisWeek: number;
 *     rolesSummary: Array<{ role: string; count: number }>;
 *   };
 *   recentUsers: Array<{
 *     id: number | string;
 *     name: string;
 *     email: string;
 *     roleNames: string[];
 *     joinedAt: string; // ISO date
 *     isActive: boolean;
 *   }>
 * }
 *
 * For now, this file focuses on layout/UX. If props are missing,
 * we render sensible placeholders so you can wire the backend later.
 */

function fmt(n?: number) {
  if (typeof n !== 'number') return '—';
  return new Intl.NumberFormat('en-BD').format(n);
}

function shortDate(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Import our new components
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';

export default function AdminDashboard() {
  const { stats, recentUsers } = (usePage().props as any) ?? {};
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState('7d');

  const safeStats = {
    totalUsers: stats?.totalUsers ?? 0,
    activeUsers: stats?.activeUsers ?? 0,
    newThisWeek: stats?.newThisWeek ?? 0,
    rolesSummary: (stats?.rolesSummary as Array<{ role: string; count: number }>) ?? [],
  };

  const allRoles: string[] = useMemo(() => {
    const rs = new Set<string>();
    safeStats.rolesSummary.forEach((r) => rs.add(r.role));
    (recentUsers ?? []).forEach((u: any) => (u.roleNames ?? []).forEach((r: string) => rs.add(r)));
    return ['all', ...Array.from(rs).sort((a, b) => a.localeCompare(b))];
  }, [safeStats.rolesSummary, recentUsers]);

  const filtered = useMemo(() => {
    let rows: any[] = Array.isArray(recentUsers) ? recentUsers : [];
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q));
    }
    if (roleFilter !== 'all') {
      rows = rows.filter((u) => (u.roleNames ?? []).includes(roleFilter));
    }
    if (statusFilter !== 'all') {
      const wantActive = statusFilter === 'active';
      rows = rows.filter((u) => !!u.isActive === wantActive);
    }
    return rows.slice(0, 12); // show top 12 newest by default (server can already sort desc joined)
  }, [recentUsers, query, roleFilter, statusFilter]);

  const inactiveCount = Math.max(safeStats.totalUsers - safeStats.activeUsers, 0);

  return (
    <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}> 
      <Head title="Admin Dashboard" />

      {/* Top header & quick actions */}
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center p-6">
        <div>
          <h1 className="  text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organization-wide user overview, activity, and onboarding.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={route('users.index')} className="inline-flex items-center">
            <Button variant="default" className="gap-2">
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
          </Link>
          <Link href={route('users.create')} className="inline-flex items-center">
            <Button variant="secondary" className="gap-2">
              <UserPlus className="h-4 w-4" />
              New User
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      {/* <QuickStats /> */}

      {/* User Stats Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{fmt(safeStats.totalUsers)}</div>
            <p className="text-muted-foreground mt-1 text-xs">All registered accounts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{fmt(safeStats.activeUsers)}</div>
            <p className="text-muted-foreground mt-1 text-xs">Logged-in recently / marked active</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <CircleUser className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn('text-3xl font-bold', inactiveCount > 0 ? 'text-amber-600' : '')}>{fmt(inactiveCount)}</div>
            <p className="text-muted-foreground mt-1 text-xs">Haven't been active recently</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <UserPlus className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{fmt(safeStats.newThisWeek)}</div>
            <p className="text-muted-foreground mt-1 text-xs">Accounts created in the last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">Recent Registrations</CardTitle>
                <p className="text-muted-foreground mt-1 text-xs">Newest user accounts and their status</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-56">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name or email..."
                    className="pl-9"
                  />
                  <Search className="text-muted-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Role" /></SelectTrigger>
                  <SelectContent>
                    {allRoles.map((r) => (
                      <SelectItem key={r} value={r}>{r === 'all' ? 'All roles' : r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">User</TableHead>
                    <TableHead className="w-[20%]">Roles</TableHead>
                    <TableHead className="w-[20%]">Joined</TableHead>
                    <TableHead className="w-[20%] text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground py-10 text-center text-sm">No users found.</TableCell>
                    </TableRow>
                  )}

                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      {/* User */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{(u.name ?? 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="truncate font-medium">{u.name}</div>
                            <div className="text-muted-foreground truncate text-xs">{u.email}</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Roles */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(u.roleNames ?? []).length === 0 && <Badge variant="outline">—</Badge>}
                          {(u.roleNames ?? []).map((r: string) => (
                            <Badge key={r} variant="secondary" className="capitalize">{r}</Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* Joined */}
                      <TableCell>
                        <span className="text-sm">{shortDate(u.joinedAt)}</span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-right">
                        {u.isActive ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Showing {filtered.length} users</span>
            <Link href={route('users.index')} className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              View all users <ArrowRight className="h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

      {/* Revenue Chart & Stats */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <RevenueChart />
        <div className="lg:col-span-1">
          <NotificationsPanel />
        </div>
      </div>

      {/* Roles distribution & filters */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Roles Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {safeStats.rolesSummary.length === 0 && (
                <p className="text-muted-foreground text-sm">No roles to show yet.</p>
              )}
              {safeStats.rolesSummary.map(({ role, count }) => (
                <div key={role} className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{role}</span>
                  </div>
                  <Badge variant="secondary">{fmt(count)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href={route('permissions.index')} className="text-primary inline-flex items-center gap-1 text-sm font-medium">
              Manage roles & permissions <ArrowRight className="h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        {/* Recent registrations panel */}
        
      </div>

      {/* Onboarding & activity tabs (placeholder for future widgets) */}
      <div className="mt-6">
        <Tabs defaultValue="onboarding" className="w-full">
          <TabsList>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="onboarding" className="mt-3">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Quick Onboarding Health</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Hook up your real metrics later (invites sent, pending verifications, first-login completion, etc.).
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="mt-3">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Recent Admin Activity</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Add audit trail widgets here (role changes, new users created, disabled accounts, etc.).
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
