import { Link } from '@inertiajs/react';
import React, { ReactNode } from 'react';
import { useTranslation } from './useTranslation';

interface PageHeaderProps {
    title?: ReactNode;
    addLinkText?: ReactNode;
    addLinkHref?: string;
    printLinkHref?: string;
    printLinkText?: ReactNode;
    headingLevel?: 1 | 2;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, addLinkText, addLinkHref, printLinkHref, printLinkText, headingLevel = 2 }) => {
    const t = useTranslation();
    const HeadingTag = headingLevel === 1 ? 'h1' : 'h2';

    const displayTitle = title || t('defaultPageTitle');
    const displayPrintText = printLinkText || t('printText');

    return (
        <div className="mb-4 flex items-center justify-between md:flex-row md:gap-2">
            {/* Use token so it adapts to light/dark */}
            {React.createElement(HeadingTag, { className: 'text-lg md:text-2xl font-semibold tracking-tight text-foreground' }, displayTitle)}

            <div className="flex items-center gap-2">
                {printLinkHref && (
                    <Link
                        href={printLinkHref}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-ring inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                        {displayPrintText}
                    </Link>
                )}

                {addLinkText && addLinkHref && (
                    <Link
                        href={addLinkHref}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                        {addLinkText}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
