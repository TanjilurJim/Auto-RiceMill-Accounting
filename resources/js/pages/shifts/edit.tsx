import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Shift {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    description: string;
}

export default function EditShift({ shift }: { shift: Shift }) {
    // Helper for 12-hour time
    function formatTime(hour: string, minute: string, period: string) {
        return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
    }

    // Parse initial time values
    function parseTimeString(timeStr: string) {
        if (!timeStr) return { hour: '01', minute: '00', period: 'AM' };
        const [hm, period] = timeStr.split(' ');
        const [hour, minute] = hm.split(':');
        return { hour, minute, period: period || 'AM' };
    }

    const { data, setData, put, processing, errors } = useForm({
        name: shift.name,
        start_time: shift.start_time,
        end_time: shift.end_time,
        description: shift.description,
    });

    // Start time state
    const startParsed = parseTimeString(data.start_time);
    const [startHour, setStartHour] = useState(startParsed.hour);
    const [startMinute, setStartMinute] = useState(startParsed.minute);
    const [startPeriod, setStartPeriod] = useState(startParsed.period);
    const [startOpen, setStartOpen] = useState(false);

    // End time state
    const endParsed = parseTimeString(data.end_time);
    const [endHour, setEndHour] = useState(endParsed.hour);
    const [endMinute, setEndMinute] = useState(endParsed.minute);
    const [endPeriod, setEndPeriod] = useState(endParsed.period);
    const [endOpen, setEndOpen] = useState(false);

    // Update form data when picker changes
    useEffect(() => {
        setData('start_time', formatTime(startHour, startMinute, startPeriod));
    }, [setData, startHour, startMinute, startPeriod]);
    useEffect(() => {
        setData('end_time', formatTime(endHour, endMinute, endPeriod));
    }, [setData, endHour, endMinute, endPeriod]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/shifts/${shift.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Shift" />
            <div className="h-full w-screen lg:w-full">
                <div className="h-full rounded-lg p-4 md:p-12">
                    <PageHeader title="Edit Shift" addLinkHref="/shifts" addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-background p-6 dark:bg-neutral-900">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Shift Name */}
                            <div>
                                <label htmlFor="name" className="mb-1 block font-medium">
                                    Shift Name
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                    placeholder="Enter shift name"
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Start Time - Custom Picker */}
                            <div>
                                <label className="mb-1 block font-medium">Start Time</label>
                                <Popover open={startOpen} onOpenChange={setStartOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {formatTime(startHour, startMinute, startPeriod)}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="flex w-auto gap-2 p-4">
                                        <Select value={startHour} onValueChange={setStartHour}>
                                            <SelectTrigger className="w-16">
                                                <SelectValue placeholder="Hour" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                                            {(i + 1).toString().padStart(2, '0')}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <span className="self-center">:</span>
                                        <Select value={startMinute} onValueChange={setStartMinute}>
                                            <SelectTrigger className="w-16">
                                                <SelectValue placeholder="Minute" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {['00', '15', '30', '45'].map((m) => (
                                                        <SelectItem key={m} value={m}>
                                                            {m}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Select value={startPeriod} onValueChange={setStartPeriod}>
                                            <SelectTrigger className="w-16">
                                                <SelectValue placeholder="AM/PM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {['AM', 'PM'].map((p) => (
                                                        <SelectItem key={p} value={p}>
                                                            {p}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </PopoverContent>
                                </Popover>
                                {errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}
                            </div>

                            {/* End Time - Custom Picker */}
                            <div>
                                <label className="mb-1 block font-medium">End Time</label>
                                <Popover open={endOpen} onOpenChange={setEndOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {formatTime(endHour, endMinute, endPeriod)}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="flex w-auto gap-2 p-4">
                                        <Select value={endHour} onValueChange={setEndHour}>
                                            <SelectTrigger className="w-16">
                                                <SelectValue placeholder="Hour" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                                            {(i + 1).toString().padStart(2, '0')}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <span className="self-center">:</span>
                                        <Select value={endMinute} onValueChange={setEndMinute}>
                                            <SelectTrigger className="w-16">
                                                <SelectValue placeholder="Minute" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {['00', '15', '30', '45'].map((m) => (
                                                        <SelectItem key={m} value={m}>
                                                            {m}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Select value={endPeriod} onValueChange={setEndPeriod}>
                                            <SelectTrigger className="w-16">
                                                <SelectValue placeholder="AM/PM" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {['AM', 'PM'].map((p) => (
                                                        <SelectItem key={p} value={p}>
                                                            {p}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </PopoverContent>
                                </Popover>
                                {errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="mb-1 block font-medium">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Optional description"
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Actions */}
                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/shifts"
                            processing={processing}
                            submitText="Save"
                            cancelText="Cancel"
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
