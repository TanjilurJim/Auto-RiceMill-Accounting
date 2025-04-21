import { ReactNode } from 'react';

interface CancelBtnProps {
    children: ReactNode;
    handleCancel: () => void;
}

const CancelBtn: React.FC<CancelBtnProps> = ({children, handleCancel }) => {
    return (
        <button
            type="button"
            onClick={handleCancel}
            className="rounded border px-4 py-2 hover:bg-neutral-200"
        >
            {children }
        </button>
    );
};

export default CancelBtn;