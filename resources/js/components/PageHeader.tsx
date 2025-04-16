import { Link } from "@inertiajs/react";


interface PageHeaderProps {
    title?: string;
    addLinkText?: string;
    addLinkHref?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title = "Title", addLinkText = '+ Add New', addLinkHref = "#" }) => {
    return (
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-lg font-semibold text-gray-800 sm:text-xl lg:text-2xl">{title}</h1>
            <Link href={`${addLinkHref}`} className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover sm:text-base lg:text-lg" >{ addLinkText }</Link>
        </div>
    );
};

export default PageHeader;