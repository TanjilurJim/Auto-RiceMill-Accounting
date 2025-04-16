import { Link } from "@inertiajs/react";
import React from "react";

interface ActionFooterProps {
    onSubmit?: () => void; // Function to handle the submit action
    onSaveAndPrint?: () => void; // Optional function to handle the Save & Print action
    processing?: boolean; // Whether the form is processing
    submitText?: string; // Custom text for the submit button
    cancelHref?: string; // Optional URL for the cancel link
    onCancel?: () => void; // Optional function for the cancel button
    cancelText?: string; // Custom text for the cancel button
    saveAndPrintText?: string; // Custom text for the Save & Print button
    className?: string; // Optional className prop for additional styling
}

const ActionFooter: React.FC<ActionFooterProps> = ({
    onSubmit,
    onSaveAndPrint,
    cancelHref,
    onCancel,
    processing = false,
    submitText = "Submit",
    saveAndPrintText = "Save & Print",
    cancelText = "Cancel",
    className = "", // Default to an empty string if not provided
}) => {
    return (
        <div className={`col-span-2 mt-4 flex gap-3 || ${className}`}>
            {/* Submit Button */}
            <button
                type="button"
                onClick={onSubmit}
                disabled={processing}
                className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-hover disabled:opacity-50"
            >
                {submitText}
            </button>

            {/* Print Button */}
            {onSaveAndPrint && (
                <button
                    type="button"
                    onClick={onSaveAndPrint}
                    disabled={processing}
                    className="rounded bg-blue-600 px-5 py-2 font-semibold text-white shadow hover:bg-blue-700"
                >
                    {saveAndPrintText}
                </button>
            )}

            {/* Cancel Link */}
            {cancelHref && (
                <Link
                    href={cancelHref}
                    className="rounded border px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
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