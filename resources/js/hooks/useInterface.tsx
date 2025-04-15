import { ReactNode } from "react";

interface Props {
    href?: string;
    children?: ReactNode;
    delId?: { id: number };
    handleDelete?: (id: number) => void;
    processing?: boolean;
    className?: string; // Optional className prop for additional styling
}

const useInterface = (
    href?: string,
    children?: ReactNode,
    delId?: { id: number },
    handleDelete?: (id: number) => void,
    processing?: boolean,
    className?: string,
): Props => {
    return {
        href,
        children,
        delId,
        handleDelete,
        processing,
        className
    };
};



export default useInterface;