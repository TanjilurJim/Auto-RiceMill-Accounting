import { router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export function SearchBar({
  endpoint,
  placeholder,
  only = ['godowns'],                  // 👈 defaults for this page
}: {
  endpoint: string;
  placeholder?: string;
  only?: string[];
}) {
  const initial = useMemo(
    () => new URLSearchParams(window.location.search).get('search') ?? '',
    []
  );
  const [q, setQ] = useState(initial);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {               // ✅ don’t auto-request on first mount
      first.current = false;
      return;
    }
    const id = setTimeout(() => {
      router.get(
        endpoint,
        { search: q, page: 1 },        // ✅ reset to page 1 on new search
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only,                        // ✅ fetch just the required prop
        }
      );
    }, 300); // small debounce
    return () => clearTimeout(id);
  }, [q, endpoint, only]);

  return (
    <input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded border px-3 py-2"
    />
  );
}
