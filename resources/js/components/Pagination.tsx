import { router } from "@inertiajs/react";

interface PaginationProps {
    links: { url: string | null; label: string; active: boolean }[];
}

const Pagination: React.FC<PaginationProps> = ({ links = [] }) => {
    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, { preserveState: true });
    };

    return (
        <div className="my-4 mx-4 flex justify-end gap-1">
            <nav aria-label="Pagination Navigation">
                <ul className="pagination flex justify-center space-x-2">
                    {links.map((link, index) => (
                        <li
                            key={link.url || index}
                            className={`page-item ${link.active
                                    ? "bg-blue-500 text-white rounded"
                                    : "text-gray-500"
                                } ${!link.url ? "disabled" : ""}`}
                        >
                            <a
                                className={`page-link px-3 py-1 border rounded ${link.active
                                        ? "bg-blue-500 text-white"
                                        : "text-blue-500 hover:bg-blue-200"
                                    } ${!link.url
                                        ? "cursor-not-allowed text-gray-400"
                                        : ""
                                    }`}
                                href={link.url || "#"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(link.url);
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;