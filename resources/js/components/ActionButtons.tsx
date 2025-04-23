import { Link } from "@inertiajs/react";
import { ReactNode } from "react";

interface ActionButtonsProps {
    editHref?: string;
    onEdit?: () => void;
    onDelete: () => void;
    editText?: ReactNode;
    deleteText?: ReactNode;
    printHref?: string;
    printText?: ReactNode;
    onPrint?: (e: any) => void;
    className?: string;
    deleteClassName?: string;
    editClassName?: string;
    printClassName?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    editHref,
    onEdit,
    onDelete,
    editText = 'Edit',
    deleteText = 'Delete',
    printHref,
    printText = 'Print',
    onPrint,
    deleteClassName,
}) => {
    return (
        <div className={`flex justify-center space-x-2`}>
            {/* Render Edit Link if editHref is provided */}
            {editHref && (
                <Link
                    href={editHref}
                    className="rounded bg-warning px-3 py-1 text-sm text-white hover:bg-warning-hover flex items-center"
                >
                    {editText}
                </Link>
            )}

            {/* Render Edit Button if onEdit is provided */}
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="rounded bg-warning px-3 py-1 text-sm text-white hover:bg-warning-hover"
                >
                    {editText}
                </button>
            )}

            {/* Delete Button */}
            <button
                onClick={onDelete}
                className={deleteClassName ? deleteClassName : "rounded bg-danger px-3 py-1 text-sm text-white hover:bg-danger-hover"}
            >
                {deleteText}
            </button>

            {/* Print Link */}
            {printHref && (
                <Link
                    href={printHref}
                    className="rounded bg-info px-3 py-1 text-sm text-white hover:bg-info-hover"
                >
                    {printText}
                </Link>
            )}

            {/* Print Button */}
            {onPrint && (
                <button
                    onClick={onPrint}
                    className="rounded bg-info px-3 py-1 text-sm text-white hover:bg-info-hover"
                >
                    {printText}
                </button>
            )}
        </div>
    );
};

export default ActionButtons;