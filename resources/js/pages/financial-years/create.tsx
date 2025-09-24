import React from 'react';

import ActionFooter from '@/components/ActionFooter';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import { CheckBox } from '@/components/CheckBox';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        start_date: string;
        end_date: string;
        is_closed: boolean;
    }>({
        title: '',
        start_date: '',
        end_date: '',
        is_closed: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/financial-years');
    };

    return (
        <AppLayout>
            <Head title="Create Financial Year" />
            <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                <div className="bg-background h-full rounded-lg">
                    <PageHeader title="Add Financial Year" addLinkHref="/financial-years" addLinkText="<- Back" />

                    <form onSubmit={handleSubmit} className="bg-background space-y-6 rounded-lg border p-6">
                        {/* Title */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="text-foreground w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold shadow focus:border-blue-500 focus:ring-blue-500"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g., 2024-2025"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Start Date & End Date */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Start Date */}
                            <div>
                                <InputCalendar label="Start Date" value={data.start_date} onChange={(val) => setData('start_date', val)} />
                                {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                            </div>

                            {/* End Date */}
                            <div>
                                <InputCalendar label="End Date" value={data.end_date} onChange={(val) => setData('end_date', val)} />
                                {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                            <CheckBox
                                id="is_closed"
                                checked={data.is_closed}
                                onCheckedChange={(checked) => setData('is_closed', !!checked)}
                                label="Mark as Closed"
                            />
                        </div>

                        <ActionFooter
                            processing={processing}
                            submitText={processing ? 'Saving...' : 'Save'}
                            onSubmit={handleSubmit}
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
