import { useTranslation } from '@/components/useTranslation';
import { router } from '@inertiajs/react';

interface PaginationProps {
    links: { url: string | null; label: string; active: boolean }[];
    currentPage: number;
    lastPage: number;
    total: number;
}

const Pagination: React.FC<PaginationProps> = ({ links = [], currentPage, lastPage, total }) => {
    const t = useTranslation();

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, { preserveState: true });
    };

    return (
        <div className="my-4">
            {/* Pagination Info */}
            <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
                <span>
                    {t('paginationPageOf')} {currentPage} {t('paginationOf')} {lastPage}
                </span>
                <span>
                    {t('paginationTotal')} {total}
                </span>
            </div>

            {/* Pagination Navigation */}
            <nav aria-label={t('paginationNavigation')} className="flex lg:justify-end">
                <ul className="pagination flex flex-wrap justify-center gap-2">
                    {links.map((link, index) => (
                        <li
                            key={`${index}-${link.url ?? 'x'}`}
                            className={`page-item m-1 md:m-0 ${link.active ? 'rounded bg-blue-500 text-white' : 'text-gray-500'} ${!link.url ? 'disabled' : ''}`}
                        >
                            <a
                                className={`page-link rounded border px-3 py-1 transition-all duration-200 ${
                                    link.active ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'
                                } ${!link.url ? 'cursor-not-allowed text-gray-400' : ''}`}
                                href={link.url || '#'}
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
