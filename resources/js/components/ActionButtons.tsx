import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import { useTranslation } from './useTranslation';

interface Props {
    viewHref?: string;
    viewText?: ReactNode;
    viewClassName?: string;

    editHref?: string;
    onEdit?: () => void;
    editText?: ReactNode;
    editClassName?: string;

    onDelete?: () => void;
    deleteText?: ReactNode;
    deleteClassName?: string;

    printHref?: string;
    onPrint?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    printText?: ReactNode;
    printClassName?: string;

    size?: 'sm' | 'md';
    className?: string; // wrapper flex
}

const pad = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
};

const btn = (size: 'sm' | 'md') => `${pad[size]} rounded font-medium text-white transition disabled:opacity-60`;

export default function ActionButtons({
    viewHref,
    viewText,
    viewClassName,

    editHref,
    onEdit,
    editText,
    editClassName,

    onDelete,
    deleteText,
    deleteClassName,

    printHref,
    onPrint,
    printText,
    printClassName,

    size = 'sm',
    className = '',
}: Props) {
    const t = useTranslation();

    return (
        <div className={`flex justify-items-center gap-2 ${className}`}>
            {/* View */}
            {viewHref && (
                <Link href={viewHref} className={viewClassName ?? `${btn(size)} bg-blue-600 hover:bg-blue-700`}>
                    {viewText ?? t('view')}
                </Link>
            )}

            {/* Edit */}
            {editHref && (
                <Link href={editHref} className={editClassName ?? `${btn(size)} bg-warning hover:bg-warning-hover`}>
                    {editText ?? t('edit')}
                </Link>
            )}
            {onEdit && !editHref && (
                <button onClick={onEdit} className={editClassName ?? `${btn(size)} bg-warning hover:bg-warning-hover`}>
                    {editText ?? t('edit')}
                </button>
            )}

            {/* Delete */}
            {onDelete && (
                <button onClick={onDelete} className={deleteClassName ?? `${btn(size)} bg-danger hover:bg-danger-hover`}>
                    {deleteText ?? t('delete')}
                </button>
            )}

            {/* Print */}
            {printHref && (
                <Link href={printHref} target="_blank" className={printClassName ?? `${btn(size)} bg-info hover:bg-info-hover`}>
                    {printText ?? t('print')}
                </Link>
            )}
            {onPrint && (
                <button onClick={onPrint} className={printClassName ?? `${btn(size)} bg-info hover:bg-info-hover`}>
                    {printText ?? t('print')}
                </button>
            )}
        </div>
    );
}
