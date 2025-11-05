import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';

type Option = { value: number | null; label: string };

export default function SupplierCreatableSelect({
  value,
  onChange,
  onSelectedLedgerId,
  placeholder = 'Select or create supplier…',
  // NEW: accept phone/address from parent
  phone,
  address,
}: {
  value: number | '' | null;
  onChange?: (option: Option | null) => void;
  onSelectedLedgerId: (ledgerId: number | null) => void;
  placeholder?: string;
  phone?: string;
  address?: string;
}) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(() => {
    const id = value ? Number(value) : null;
    const found = options.find((o) => o.value === id);
    return found ?? (id ? { value: id, label: 'Loading…' } : null);
  }, [options, value]);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get('/account-ledgers/suppliers', { params: { q } });
      const opts = (data as Array<{ id: number; label: string }>).map((r) => ({ value: r.id, label: r.label }));
      setOptions(opts);
    } finally {
      setLoading(false);
    }
  }, []);

  // NEW: preload current value’s label if we only have an id
  useEffect(() => {
    const id = value ? Number(value) : null;
    if (!id) return;
    // if options already contain it, skip
    if (options.some((o) => o.value === id)) return;

    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get(`/account-ledgers/${id}`); // add a tiny show endpoint returning {id,label}
        if (!mounted) return;
        const opt = { value: data.id, label: data.account_ledger_name || data.label };
        setOptions((prev) => (prev.some((p) => p.value === opt.value) ? prev : [...prev, opt]));
      } catch {
        // silently ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [value, options]);

  const handleChange = (opt: any) => {
    onChange?.(opt);
    onSelectedLedgerId(opt?.value ?? null);
  };

  const handleCreate = async (inputLabel: string) => {
    const res = await axios.post('/account-ledgers/suppliers', {
      name: inputLabel,
      phone_number: phone ?? '',
      address: address ?? '',
      group_under_id: 8, // Sundry Creditors
    });
    const created = { value: res.data.id, label: res.data.label } as Option;
    setOptions((prev) => [...prev, created]);
    handleChange(created);
  };

  // OPTIONAL: simple debounce for input (300ms)
  const debounceTimer = useRef<any>(null);
  const onInputChange = (input: string, meta: any) => {
    if (meta.action !== 'input-change') return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => load(input), 300);
  };

  return (
    <CreatableSelect
      isClearable
      isLoading={loading}
      placeholder={placeholder}
      value={selected}
      options={options}
      onChange={handleChange as any}
      onCreateOption={handleCreate}
      onInputChange={onInputChange}
      styles={{ menu: (base) => ({ ...base, zIndex: 50 }) }}
    />
  );
}
