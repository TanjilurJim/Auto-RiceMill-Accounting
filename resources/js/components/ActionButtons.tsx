/* resources/js/components/ActionButtons.tsx */
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface Props {
  editHref?: string;
  onEdit?: () => void;
  onDelete: () => void;
  editText?: ReactNode;
  deleteText?: ReactNode;
  printHref?: string;
  printText?: ReactNode;
  onPrint?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'sm' | 'md';          // NEW – default is sm
  className?: string;          // wrapper flex
  editClassName?: string;
  deleteClassName?: string;
  printClassName?: string;
}

const pad = {
    
  sm: 'px-2.5 py-1 text-xs',   // slimmer
  md: 'px-4 py-2 text-sm',     // chunkier
};

const btn = (size: 'sm' | 'md') =>
  `${pad[size]} rounded font-medium text-white transition disabled:opacity-60`;

export default function ActionButtons({
  editHref,
  onEdit,
  onDelete,
  editText = 'Edit',
  deleteText = 'Delete',
  printHref,
  printText = 'Print',
  onPrint,
  size = 'sm',                // <- default slimmer
  className = '',
  editClassName,
  deleteClassName,
  printClassName,
}: Props) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Edit */}
      {editHref && (
        <Link
          href={editHref}
          className={editClassName ?? `${btn(size)} bg-warning hover:bg-warning-hover`}
        >
          {editText}
        </Link>
      )}
      {onEdit && !editHref && (
        <button
          onClick={onEdit}
          className={editClassName ?? `${btn(size)} bg-warning hover:bg-warning-hover`}
        >
          {editText}
        </button>
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        className={deleteClassName ?? `${btn(size)} bg-danger hover:bg-danger-hover`}
      >
        {deleteText}
      </button>

      {/* Print */}
      {printHref && (
        <Link
          href={printHref}
          target="_blank"
          className={printClassName ?? `${btn(size)} bg-info hover:bg-info-hover`}
        >
          {printText}
        </Link>
      )}
      {onPrint && (
        <button
          onClick={onPrint}
          className={printClassName ?? `${btn(size)} bg-info hover:bg-info-hover`}
        >
          {printText}
        </button>
      )}
    </div>
  );
}
