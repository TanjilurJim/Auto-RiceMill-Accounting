import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { Link } from '@inertiajs/react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  companyLogo?: string;
  companyName?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[]; // ✅ role-based visibility
    children?: NavItem[]; // ✅ nested sidebar
    aliases?: string[];

    
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
