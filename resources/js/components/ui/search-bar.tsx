// components/ui/search-bar.tsx

import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface SearchBarProps {
    endpoint: string;
    searchQuery: string;
    filter?: string;
    placeholder?: string;
}

export function SearchBar({ endpoint, searchQuery = '', filter, placeholder = "Search..." }: SearchBarProps) {
    const [query, setQuery] = useState(searchQuery);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(endpoint, { search: query, filter }, { preserveState: true, replace: true });
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, filter]);

    return (
        <div className="mb-4 flex items-center gap-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-64 rounded border px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800"
            />
            {query && (
                <button type="button" onClick={() => setQuery('')} className="text-sm text-red-600 hover:underline">
                    Clear
                </button>
            )}
        </div>
    );
}
