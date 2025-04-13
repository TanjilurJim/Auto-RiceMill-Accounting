interface InputCheckboxProps {
    label: string;
    check: boolean;
    labelOnChange: (check: boolean) => void;
}

const InputCheckbox: React.FC<InputCheckboxProps> = ({ label, check, labelOnChange }) => {
    return (
        <label className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={check}
                onChange={(e) => labelOnChange( e.target.checked)}
                className="accent-info-hover"
            />
            {label}
        </label>
    );
};

export default InputCheckbox;