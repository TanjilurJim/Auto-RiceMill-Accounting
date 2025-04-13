import { ReactNode } from "react";

interface Props {
    href?: string;
    children?: ReactNode;
    ledger?: { id: number };
    handleDelete?: (id: number) => void;
    processing?: boolean;
}

const useInterface = (
    href?: string,
    children?: ReactNode,
    ledger?: { id: number },
    handleDelete?: (id: number) => void,
    processing?: boolean = false
): Props => {
    return { href, children, ledger, handleDelete,processing };
};

export default useInterface;