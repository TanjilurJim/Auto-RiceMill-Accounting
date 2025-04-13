import useInterface from "@/hooks/useInterface";


const DeleteBtn = ({ children, handleDelete, ledger }: ReturnType<typeof useInterface>) => {
    return (
        <button
            onClick={() => {
                if (handleDelete) {
                    handleDelete(ledger?.id || 0);
                }
            }}
            className="rounded bg-danger px-3 py-1 text-sm text-white hover:bg-danger-hover"
        >
            {children || "Delete"}
        </button>
    );
};

export default DeleteBtn;