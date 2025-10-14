import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import FlashMessage from "@/components/FlashMessage";


export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <>
            <FlashMessage />
            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent variant="sidebar" className="print:m-0 print:p-0 print:w-full">
                    <div className="print:hidden">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    </div>
                    {children}
                </AppContent>
            </AppShell>
        </>
    );
}
 