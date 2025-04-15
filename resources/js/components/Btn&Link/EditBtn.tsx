import { ReactNode } from "react";

interface EditBtnProps {
    children?: ReactNode;
    processing?: boolean;
    editbtnclick: () => void;
    className?: string;
}

const EditBtn: React.FC<EditBtnProps> = ({ editbtnclick, children, className }) => {
    return (
        <button
            onClick={editbtnclick}
            className={`rounded bg-warning px-2 py-1 text-xs text-white hover:bg-warning-hover || ${className}`}
        >
            {children ||'Edit'}
        </button>
    );
};

export default EditBtn;