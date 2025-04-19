// import { Link } from "@inertiajs/react";
// import { ReactNode } from "react";


// interface PageHeaderProps {
//     title?: ReactNode;
//     addLinkText?: ReactNode;
//     addLinkHref?: string;
// }

// const PageHeader: React.FC<PageHeaderProps> = ({ title = "Title", addLinkText = '+ Add New', addLinkHref = "#" }) => {
//     return (
//         <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <h2 className="text-lg font-semibold text-gray-800 sm:text-xl lg:text-2xl">{title}</h2>
//             <Link href={`${addLinkHref}`} className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover sm:text-base lg:text-lg" >{ addLinkText }</Link>
//         </div>
//     );
// };

// export default PageHeader;


import { Link } from "@inertiajs/react";
import { ReactNode } from "react";

interface PageHeaderProps {
    title?: ReactNode;
    addLinkText?: ReactNode;
    addLinkHref?: string;
    printLinkHref?: string; // Optional URL for the print button
    printLinkText?: ReactNode; // Optional custom text for the print button
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title = "Title",
    addLinkText = '+ Add New',
    addLinkHref = "#",
    printLinkHref,
    printLinkText = "Print", // Default text for the print button
}) => {
    return (
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-800 sm:text-xl lg:text-2xl">{title}</h2>
            <div className="flex items-center gap-2">
                {/* Optional Print Button */}
                {printLinkHref && (
                    <Link
                        href={printLinkHref}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:text-base lg:text-lg"
                    >
                        {printLinkText}
                    </Link>
                )}
                {/* Add Link Button */}
                <Link
                    href={addLinkHref}
                    className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover sm:text-base lg:text-lg"
                >
                    {addLinkText}
                </Link>
            </div>
        </div>
    );
};

export default PageHeader;