import useInterface from "@/hooks/useInterface";
import { Link } from "@inertiajs/react";


const AddLink = ({ href, children }: ReturnType<typeof useInterface>) => {
    return (
        <Link href={`${href || "#"}`} className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-hover">
            {children || "+ Add New"}
        </Link>
    );
};

export default AddLink;