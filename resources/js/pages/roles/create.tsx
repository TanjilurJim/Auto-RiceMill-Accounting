// resources/js/Pages/roles/Create.tsx
import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Permission {
    id: number;
    name: string;
    ability: string;
}

interface Module {
    name: string;
    permissions: Permission[];
}

interface Props {
    modules: Module[];
}

export default function CreateRole({ modules }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [selected, setSelected] = useState<number[]>([]);
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: selected,
    });

    // Initialize expanded state for all modules
    useEffect(() => {
        const initialExpanded: Record<string, boolean> = {};
        modules.forEach((module) => {
            initialExpanded[module.name] = false;
        });
        setExpandedModules(initialExpanded);
    }, [modules]);

    // Filter modules based on search term
    const filteredModules = useMemo(() => {
        if (!searchTerm) return modules;

        return modules.filter(
            (module) =>
                module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                module.permissions.some(
                    (p) => p.ability.toLowerCase().includes(searchTerm.toLowerCase()) || p.name.toLowerCase().includes(searchTerm.toLowerCase()),
                ),
        );
    }, [modules, searchTerm]);

    const togglePermission = (permId: number) => {
        setSelected((prev) => (prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]));
    };

    const toggleModule = (moduleName: string) => {
        const module = modules.find((m) => m.name === moduleName);
        if (!module) return;

        const allSelected = module.permissions.every((p) => selected.includes(p.id));
        const modulePermissionIds = module.permissions.map((p) => p.id);

        setSelected((prev) =>
            allSelected ? prev.filter((id) => !modulePermissionIds.includes(id)) : [...new Set([...prev, ...modulePermissionIds])],
        );
    };

    const toggleExpand = (moduleName: string) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleName]: !prev[moduleName],
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('permissions', selected);
        post('/roles');
    };

    const selectedPermissions = useMemo(() => {
        return modules.flatMap((module) => module.permissions.filter((p) => selected.includes(p.id)));
    }, [selected, modules]);

    // Update form data whenever selection changes
    useEffect(() => {
        setData('permissions', selected);
    }, [selected]);

    return (
        <AppLayout>
            <div className="p-4 md:p-12">
                <Head title="Create Role" />
                <PageHeader title="Create New Role" addLinkHref="/roles" addLinkText="Back to Roles" />

                {/* Success Message */}
                {flash.success && (
                    <div className="mb-6 flex items-center rounded-lg bg-green-50 p-4 text-green-700">
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {flash.success}
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                    {/* Role Name */}
                    <div className="mb-8">
                        <label className="mb-1 block text-lg font-semibold text-gray-700 md:text-xl">Role Name</label>
                        <div className="relative">
                            <input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none ${
                                    errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                                }`}
                                placeholder="e.g. Content Moderator"
                            />
                            {errors.name && (
                                <div className="absolute top-3.5 right-3 text-red-500">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Permission Section */}
                    <div className="mb-8">
                        {/* Header and Search */}
                        <div className="mb-4 grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:justify-between">
                            <h2 className="text-lg font-semibold text-gray-800 md:text-xl">Permissions</h2>
                            <div className="">
                                <input
                                    type="text"
                                    placeholder="Search permissions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Modules Accordion */}
                        <div className="space-y-3">
                            {filteredModules.length > 0 ? (
                                filteredModules.map((module) => (
                                    <div key={module.name} className="overflow-hidden rounded-lg border">
                                        <button
                                            type="button"
                                            className="flex w-full cursor-pointer items-center justify-between bg-gray-50 p-4 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                                            onClick={() => toggleExpand(module.name)}
                                        >
                                            <div className="flex items-center">
                                                <span className="mr-3 font-medium capitalize">{module.name.replace(/-/g, ' ')}</span>
                                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                                    {module.permissions.filter((p) => selected.includes(p.id)).length}/{module.permissions.length}
                                                </span>
                                            </div>
                                            <ChevronDown />
                                        </button>

                                        {expandedModules[module.name] && (
                                            <div className="bg-white p-4 dark:bg-neutral-900">
                                                {/* Permissions + Select All */}
                                                <div className="mb-3 flex items-center justify-between">
                                                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Permissions</h3>
                                                    <button
                                                        type="button"
                                                        className="text-sm text-blue-600 hover:underline"
                                                        onClick={() => toggleModule(module.name)}
                                                    >
                                                        {module.permissions.every((p) => selected.includes(p.id)) ? 'Deselect All' : 'Select All'}
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                                    {module.permissions.map((permission) => (
                                                        <div
                                                            key={permission.id}
                                                            className={`cursor-pointer rounded-lg border p-4 transition-all ${
                                                                selected.includes(permission.id)
                                                                    ? 'border-blue-500 bg-blue-50 shadow-sm dark:bg-blue-900/20'
                                                                    : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                                                            }`}
                                                            onClick={() => togglePermission(permission.id)}
                                                        >
                                                            <div className="flex items-start">
                                                                <input
                                                                    type="checkbox"
                                                                    className="mt-0.5 h-5 w-5 rounded text-blue-600"
                                                                    checked={selected.includes(permission.id)}
                                                                    readOnly
                                                                />
                                                                <div className="ml-3">
                                                                    <span className="font-medium capitalize dark:text-gray-300">
                                                                        {permission.ability}
                                                                    </span>
                                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{permission.name}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">No permissions match your search</div>
                            )}
                        </div>
                    </div>

                    {/* Selected Permissions Summary */}
                    <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">
                                Selected Permissions
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({selected.length} selected)</span>
                            </h3>
                            <button
                                type="button"
                                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                onClick={() => setSelected([])}
                            >
                                Clear All
                            </button>
                        </div>

                        {selected.length === 0 ? (
                            <p className="py-2 text-sm text-gray-500 dark:text-gray-400">No permissions selected yet</p>
                        ) : (
                            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto py-2">
                                {selectedPermissions.map((permission) => (
                                    <span
                                        key={permission.id}
                                        className="flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                    >
                                        {permission.name}
                                        <button
                                            type="button"
                                            className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePermission(permission.id);
                                            }}
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <ActionFooter
                        processing={processing}
                        onSubmit={submit}
                        submitText={
                            processing ? (
                                <span className="flex items-center">
                                    <svg className="mr-2 -ml-1 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                'Create Role'
                            )
                        }
                        cancelHref="/roles"
                    />
                </form>
            </div>
        </AppLayout>
    );
}
