import { Checkbox } from '@/components/ui/checkbox';

interface CheckBoxProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    id?: string;
    label?: string;
}

export const CheckBox = ({ checked, defaultChecked, onCheckedChange, id, label }: CheckBoxProps) => {
    return (
        <>
            <Checkbox
                id={id}
                checked={checked}
                defaultChecked={defaultChecked}
                onCheckedChange={onCheckedChange}
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
            {label && (
                <label htmlFor={id} className="text-sm text-gray-700">
                    {label}
                </label>
            )}
        </>
    );
};
