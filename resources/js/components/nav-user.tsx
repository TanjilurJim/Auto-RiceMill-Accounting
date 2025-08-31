import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function NavUser() {
  const { auth } = usePage<SharedData>().props as any;
  const trial = auth?.trial;
  const needsAttention = !!trial && (trial.inactive || trial.expiring_soon);

  const { state } = useSidebar();
  const isMobile = useIsMobile();

  const avatarUrl =
    auth?.user?.google_avatar ||
    auth?.user?.avatar_url || // if you ever add your own avatar field
    null;

  const initials = (auth?.user?.name || auth?.user?.email || '?')
    .split(' ')
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
            >
              <div className="flex items-center gap-3">
                {/* Avatar with status pulse */}
                <div className="relative">
                  <Avatar className="size-8">
                    <AvatarImage src={avatarUrl ?? undefined} alt={auth?.user?.name ?? 'User'} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  {needsAttention && (
                    <span
                      className="absolute -right-0.5 -bottom-0.5 inline-flex h-2.5 w-2.5"
                      aria-label={trial.inactive ? 'Account inactive' : 'Trial expiring soon'}
                    >
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                          trial.inactive ? 'bg-red-400' : 'bg-amber-400'
                        } opacity-75`}
                      />
                      <span
                        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                          trial.inactive ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                      />
                    </span>
                  )}
                </div>

                {/* Name / email (kept simple; you can keep your <UserInfo /> if you prefer) */}
                <div className="flex min-w-0 flex-col text-left">
                  <span className="truncate text-sm font-medium leading-tight">{auth?.user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{auth?.user?.email}</span>
                </div>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg w-(--radix-dropdown-menu-trigger-width)"
            align="end"
            side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
          >
            <UserMenuContent user={auth.user} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
