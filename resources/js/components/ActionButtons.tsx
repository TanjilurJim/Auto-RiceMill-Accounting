import { Link } from "@inertiajs/react";
import { ReactNode } from "react";

interface ActionButtonsProps {
    editHref?: string; // Optional URL for the edit action
    onEdit?: () => void; // Optional function for the edit button
    onDelete: () => void; // Function to handle the delete action
    editText?: ReactNode; // Optional custom text for the Edit button or link
    deleteText?: ReactNode; // Optional custom text for the Delete button
    printHref?: string; // Optional URL for the print action
    printText?: ReactNode; // Optional custom text for the Print button
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    editHref,
    onEdit,
    onDelete,
    editText = 'Edit',
    deleteText = 'Delete',
    printHref,
    printText = 'Print',
}) => {
    return (
        <td className="flex justify-center space-x-2 px-4 py-2">
            {/* Render Edit Link if editHref is provided */}
            {editHref && (
                <Link
                    href={editHref}
                    className="rounded bg-warning px-3 py-1 text-sm text-white hover:bg-warning-hover"
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
                className="rounded bg-danger px-3 py-1 text-sm text-white hover:bg-danger-hover"
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
        </td>
    );
};

export default ActionButtons;