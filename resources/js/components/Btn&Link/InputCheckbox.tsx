import React from "react";

interface InputCheckboxProps {
    label: string; // Label for the checkbox
    checked: boolean; // Whether the checkbox is checked
    onChange: (checked: boolean) => void; // Function to handle the change event
    className?: string; // Optional additional classes for styling
}

const InputCheckbox: React.FC<InputCheckboxProps> = ({ label, checked, onChange, className = "" }) => {
    return (
        <label className={`flex items-center gap-2 ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="accent-info-hover"
            />
            {label}
        </label>
    );
};

export default InputCheckbox;