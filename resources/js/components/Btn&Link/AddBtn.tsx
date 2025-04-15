interface AddBtnProps {
    processing?: boolean;
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

const AddBtn: React.FC<AddBtnProps> = ({ processing, children }) => {
    return (
        <button
            type="submit"
            disabled={processing}
            className="w-full rounded bg-primary px-4 py-2 text-white hover:bg-primary-hover disabled:opacity-50"
        >
            {children}
        </button>
    );
};

export default AddBtn;