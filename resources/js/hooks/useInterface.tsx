import { ReactNode } from "react";

interface Props {
    href?: string;
    children?: ReactNode;
    delId?: { id: number };
    handleDelete?: (id: number) => void;
    processing?: boolean;
}

export const useInterface = (
    href?: string,
    children?: ReactNode,
    delId?: { id: number },
    handleDelete?: (id: number) => void,
    processing?: boolean,
): Props => {
    return {
        href,
        children,
        delId,
        handleDelete,
        processing,
    };
};



// export default useInterface;