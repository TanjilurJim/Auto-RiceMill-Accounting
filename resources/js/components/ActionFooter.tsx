import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

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
    cancelText = 'Cancel',
    printHref = '#',
    printText,
    className = '',
}) => {
    return (
        <div className={`mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5 ${className}`}>
            {/* Submit Button */}
            {submitText && (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={processing}
                    className="bg-primary hover:bg-primary-hover w-full rounded px-1.5 py-1 text-white hover:cursor-pointer disabled:opacity-50 md:w-auto md:px-4 md:py-2"
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
                    className="bg-info hover:bg-info-hover rounded px-2 py-2 font-semibold text-white shadow md:px-5"
                >
                    {saveAndPrintText}
                </button>
            )}

            {/* Print Link */}
            {printText && (
                <Link href={printHref} className="bg-info hover:bg-info-hover rounded px-4 py-2 text-white">
                    {printText}
                </Link>
            )}

            {/* Cancel Link */}
            {cancelHref && (
                <Link
                    href={cancelHref}
                    className="w-full flex justify-center rounded border px-1.5 py-1 hover:bg-neutral-200 md:w-auto md:px-4 md:py-2 dark:hover:bg-neutral-800"
                >
                    {cancelText}
                </Link>
            )}

            {/* Cancel Button */}
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-background rounded border px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                    {cancelText}
                </button>
            )}
        </div>
    );
};

export default ActionFooter;
