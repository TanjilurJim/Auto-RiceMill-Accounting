// resources/js/components/FilterBar.tsx

import { router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { pickBy } from 'lodash';

interface FilterProps {
    q?: string;
    from?: string;
    to?: string;
    [key: string]: any; // Allow other potential filters
}

interface Props {
    endpoint: string;
    filters: FilterProps;
}

export default function FilterBar({ endpoint, filters }: Props) {
    const [values, setValues] = useState({
        q: filters.q ?? '',
        from: filters.from ?? '',
        to: filters.to ?? '',
    });

    const isFirstRun = useRef(true);

    useEffect(() => {
        // Don't run on initial mount
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            // Pick only truthy values to avoid empty params in URL
            const queryParams = pickBy(values);
            
            router.get(endpoint, queryParams, {
                preserveState: true,
                replace: true,
            });
        }, 300); // Debounce by 300ms

        return () => clearTimeout(timeout);
    }, [values, endpoint]);


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    }

    function reset() {
        setValues({ q: '', from: '', to: '' });
    }

    const hasFilters = values.q || values.from || values.to;

    return (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <input
                className="input"
                name="q"
                placeholder="Search customer / voucher..."
                value={values.q}
                onChange={handleChange}
                autoComplete="off"
            />
            <input className="input w-36" type="date" name="from" value={values.from} onChange={handleChange} />
            <input className="input w-36" type="date" name="to" value={values.to} onChange={handleChange} />
            
            {hasFilters && (
                 <button type="button" onClick={reset} className="btn-gray">
                    Clear
                </button>
            )}
        </div>
    );
}