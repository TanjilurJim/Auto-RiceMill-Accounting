import useInterface from '@/hooks/useInterface';
import { Link } from '@inertiajs/react';

const CancelLink = ({ href, children, className }: ReturnType<typeof useInterface>) => {
    return (
        <Link 
            href={`${href}`} 
            className={`rounded border px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 || ${className}`}>
            {children || "Cancel"}
        </Link>
    );
};

export default CancelLink;