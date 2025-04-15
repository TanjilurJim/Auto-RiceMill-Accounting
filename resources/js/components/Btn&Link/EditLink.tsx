import useInterface from "@/hooks/useInterface";
import { Link } from "@inertiajs/react";


const EditLink = ({ href, children, className }: ReturnType<typeof useInterface>) => {
    return (
        <Link href={`${href || "#"}`} className={`rounded bg-warning px-3 py-1 text-sm text-white hover:bg-warning-hover || ${className}`}> {children || "Edit"} </Link>
    );
};

export default EditLink;