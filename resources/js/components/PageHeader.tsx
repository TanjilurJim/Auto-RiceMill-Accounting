import { Link } from "@inertiajs/react";
import { ReactNode } from "react";

interface PageHeaderProps {
  title?: ReactNode;
  addLinkText?: ReactNode;
  addLinkHref?: string;
  printLinkHref?: string;
  printLinkText?: ReactNode;
  headingLevel?: 1 | 2;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title = "Title",
  addLinkText,
  addLinkHref,
  printLinkHref,
  printLinkText = "Print",
  headingLevel = 2,
}) => {
  const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return (
    <div className="mb-4 flex flex-col md:flex-row md:gap-2 md:items-center justify-between">
      {/* Use token so it adapts to light/dark */}
      <HeadingTag className="text-lg md:text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </HeadingTag>

      <div className="flex items-center gap-2">
        {printLinkHref && (
          <Link
            href={printLinkHref}
            className="inline-flex items-center rounded-md border bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {printLinkText}
          </Link>
        )}

        {addLinkText && (
          <Link
            href={addLinkHref}
            className="inline-flex items-center rounded-md border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {addLinkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
