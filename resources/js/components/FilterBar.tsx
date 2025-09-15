// resources/js/components/FilterBar.tsx

import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { pickBy } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';

interface FilterProps {
    q?: string;
    from?: string;
    to?: string;
    dateOfBirth?: string; // Added for the date of birth field
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
        dateOfBirth: filters.dateOfBirth ?? '',
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
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    function handleDateSelect(selectedDate: Date | undefined) {
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            setValues((prev) => ({ ...prev, dateOfBirth: formattedDate }));
        } else {
            setValues((prev) => ({ ...prev, dateOfBirth: '' }));
        }
        setOpen(false);
    }

    function reset() {
        setValues({ q: '', from: '', to: '', dateOfBirth: '' });
        setDate(undefined);
    }

    const hasFilters = values.q || values.from || values.to || values.dateOfBirth;

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(values.dateOfBirth ? new Date(values.dateOfBirth) : undefined);

    // Sync date state when values.dateOfBirth changes
    useEffect(() => {
        if (values.dateOfBirth) {
            setDate(new Date(values.dateOfBirth));
        } else {
            setDate(undefined);
        }
    }, [values.dateOfBirth]);

    return (
        <div className="my-8 text-sm">
            <Input
                className="input mb-5 w-full md:w-1/3"
                name="q"
                placeholder="Search customer / voucher..."
                value={values.q}
                onChange={handleChange}
                autoComplete="off"
            />

            <div className='flex flex-col md:flex-row md:items-center gap-4'>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="date" className="px-1">
                        Date of birth
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="date" className="w-full md:w-36 justify-between text-left font-normal">
                                {date ? date.toLocaleDateString() : 'Select date'}
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                                defaultMonth={date}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="from" className="px-1">
                        From
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="from" className="w-full md:w-36 justify-between text-left font-normal">
                                {values.from ? new Date(values.from).toLocaleDateString() : 'Select date'}
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={values.from ? new Date(values.from) : undefined}
                                onSelect={(selectedDate) => {
                                    const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
                                    setValues((prev) => ({ ...prev, from: formattedDate }));
                                }}
                                captionLayout="dropdown"
                                fromYear={2000}
                                toYear={new Date().getFullYear() + 1}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="to" className="px-1">
                        To
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="to" className="w-full md:w-36 justify-between text-left font-normal">
                                {values.to ? new Date(values.to).toLocaleDateString() : 'Select date'}
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={values.to ? new Date(values.to) : undefined}
                                onSelect={(selectedDate) => {
                                    const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
                                    setValues((prev) => ({ ...prev, to: formattedDate }));
                                }}
                                captionLayout="dropdown"
                                fromYear={2000}
                                toYear={new Date().getFullYear() + 1}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Clear button */}
                <div className='pt-4'>
                    {hasFilters && (
                        <button type="button" onClick={reset} className="w-full md:w-30 btn-gray cursor-pointer">
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
