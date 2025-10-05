import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { auth } = usePage().props as any;
    const trial = auth?.trial;
    const needsAttention = !!trial && (trial.inactive || trial.expiring_soon);
    const handleLogout = () => {
        router.post(
            route('logout'),
            {},
            {
                onFinish: () => {
                    window.location.href = '/login';
                },
            },
        );
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                    
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                        {needsAttention && (
                <span className="ml-2 relative inline-flex h-2.5 w-2.5">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${trial.inactive ? 'bg-red-400' : 'bg-amber-400'} opacity-75`}></span>
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${trial.inactive ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                </span>
              )}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                {/* <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={cleanup}> */}
                <Link
                    className="block w-full"
                    method="post"
                    href={route('logout')}
                    as="button"
                    onClick={() => {
                        handleLogout();
                        cleanup();
                    }}
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
