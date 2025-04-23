import { Link } from "@inertiajs/react";
import { ReactNode } from "react";

interface ActionFooterProps {
    onSubmit?: (e?: any) => void;
    onSaveAndPrint?: (e?: any) => void;
    processing?: boolean;
    submitText?: ReactNode;
    cancelHref?: string;
    onCancel?: () => void;
    cancelText?: string;
    saveAndPrintText?: string;
    printHref?: string;
    printText?: string;
    className?: string;
}

const ActionFooter: React.FC<ActionFooterProps> = ({
    onSubmit,
    onSaveAndPrint,
    cancelHref,
    onCancel,
    processing = false,
    submitText,
    saveAndPrintText,
    cancelText = "Cancel",
    printHref = "#",
    printText,
    className = "",
}) => {
    return (
        <div className={`col-span-2 mt-4 flex justify-end gap-3 || ${className}`}>
            {/* Submit Button */}
            {submitText && (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={processing}
                    className="rounded bg-primary px-1.5 py-1 md:px-4 md:py-2 text-white hover:bg-primary-hover disabled:opacity-50"
                >
                    {submitText}
                </button>
            )}

            {/* Save & Print Button */}
            {saveAndPrintText && (
                <button
                    type="button"
                    disabled={processing}
                    onClick={onSaveAndPrint}
                    className="rounded bg-info px-2 md:px-5 py-2 font-semibold text-white shadow hover:bg-info-hover"
                >
                    {saveAndPrintText}
                </button>
            )}

            {/* Print Link */}
            {printText && (
                <Link
                    href={printHref}
                    className="rounded bg-info px-4 py-2 text-white hover:bg-info-hover"
                >
                    {printText}
                </Link>
            )}

            {/* Cancel Link */}
            {cancelHref && (
                <Link
                    href={cancelHref}
                    className="rounded border px-3 md:px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center"
                >
                    {cancelText}
                </Link>
            )}

            {/* Cancel Button */}
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded border px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                    {cancelText}
                </button>
            )}
        </div>
    );
};

export default ActionFooter;