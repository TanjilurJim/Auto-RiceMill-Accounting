interface AddBtnProps {
    processing?: boolean;
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

const AddBtn = ({ processing, children }: AddBtnProps) => {
    return (
        <button
            type="submit"
            disabled={processing}
            className="bg-primary hover:bg-primary-hover w-full rounded px-4 py-2 text-white disabled:opacity-50 cursor-pointer transition"
        >
            {children}
        </button>
    );
};

export default AddBtn;
