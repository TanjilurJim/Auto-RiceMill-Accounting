import { router } from "@inertiajs/react";

interface PaginationProps {
    links: { url: string | null; label: string; active: boolean }[];
    currentPage: number;
    lastPage: number;
    total: number;
}

const Pagination: React.FC<PaginationProps> = ({ links = [], currentPage, lastPage, total }) => {
    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, { preserveState: true });
    };

    return (
        <div className="my-4">
            {/* Pagination Info */}
            <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
                <span>
                    Page {currentPage} of {lastPage}
                </span>
                <span>Total: {total}</span>
            </div>

            {/* Pagination Navigation */}
            <nav aria-label="Pagination Navigation" className="flex justify-center lg:justify-end">
                <ul className="pagination flex flex-wrap justify-center gap-2">
                    {links.map((link, index) => (
                        <li
                            key={link.url || index}
                            className={`page-item ${
                                link.active
                                    ? "bg-blue-500 text-white rounded"
                                    : "text-gray-500"
                            } ${!link.url ? "disabled" : ""}`}
                        >
                            <a
                                className={`page-link px-3 py-1 border rounded transition-all duration-200 ${
                                    link.active
                                        ? "bg-blue-500 text-white"
                                        : "text-blue-500 hover:bg-blue-100"
                                } ${
                                    !link.url
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