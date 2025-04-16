import useInterface from "@/hooks/useInterface";

const DeleteBtn = ({ children, handleDelete, delId, className }: ReturnType<typeof useInterface>) => {
    return (
        <button
            type="button"
            onClick={() => {
                if (handleDelete) {
                    handleDelete(delId?.id || 0);
                }
            }}
            className={`rounded bg-danger px-3 py-1 text-sm text-white hover:bg-danger-hover ${className}`}
        >
            {children || "Delete"}
        </button>
    );
};

export default DeleteBtn;