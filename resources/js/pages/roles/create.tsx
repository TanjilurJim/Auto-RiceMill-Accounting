// resources/js/Pages/roles/Create.tsx
import { useState, useEffect, useMemo } from 'react';
import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, useRemember, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

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
    modules: {
        data: Module[];
        links: any[];
        current_page: number;
        total: number;
        per_page: number;
    };
}

export default function CreateRole({ modules }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [selected, setSelected] = useRemember<number[]>([], 'role-permissions');
    const [activeModule, setActiveModule] = useState(modules.data[0]?.name || '');
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: selected,
    });

    // Filter modules based on search term
    const filteredModules = useMemo(() => {
        if (!searchTerm) return modules.data;
        
        return modules.data.filter(module => 
            module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.permissions.some(p => 
                p.ability.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [modules.data, searchTerm]);

    // Set active module if current one is filtered out
    useEffect(() => {
        if (filteredModules.length > 0 && !filteredModules.some(m => m.name === activeModule)) {
            setActiveModule(filteredModules[0].name);
        }
    }, [filteredModules, activeModule]);

    const toggle = (permId: number) => {
        const next = selected.includes(permId)
            ? selected.filter(id => id !== permId)
            : [...selected, permId];
        
        setSelected(next);
        setData('permissions', next);
    };

    const toggleModule = (moduleName: string) => {
        const module = modules.data.find(m => m.name === moduleName);
        if (!module) return;

        const allSelected = module.permissions.every(p => selected.includes(p.id));
        
        const next = allSelected
            ? selected.filter(id => !module.permissions.some(p => p.id === id))
            : [...new Set([...selected, ...module.permissions.map(p => p.id)])];
        
        setSelected(next);
        setData('permissions', next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/roles');
    };

    const selectedPermissions = useMemo(() => {
        return modules.data.flatMap(module => 
            module.permissions.filter(p => selected.includes(p.id))
        );
    }, [selected, modules.data]);

    return (
        <AppLayout>
            <Head title="Create Role" />
            <PageHeader 
                title="Create New Role"
                description="Define permissions and access levels"
                addLinkHref="/roles" 
                addLinkText="Back to Roles" 
            />

            {/* Success Message */}
            {flash.success && (
                <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {flash.success}
                </div>
            )}

            <form onSubmit={submit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800">
                {/* Role Name */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role Name
                    </label>
                    <div className="relative">
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none ${
                                errors.name 
                                    ? 'border-red-300 focus:ring-red-200' 
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                            }`}
                            placeholder="e.g. Content Moderator"
                        />
                        {errors.name && (
                            <div className="absolute right-3 top-3.5 text-red-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Permission Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Permissions</h2>
                        {/* <div className="w-64">
                            <input
                                type="text"
                                placeholder="Search permissions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div> */}
                    </div>

                    {/* Module Tabs */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {filteredModules.map(module => (
                            <button
                                key={module.name}
                                type="button"
                                onClick={() => setActiveModule(module.name)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeModule === module.name
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700'
                                }`}
                            >
                                {module.name.replace(/-/g, ' ')}
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                    {module.permissions.filter(p => selected.includes(p.id)).length}/
                                    {module.permissions.length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Module Actions */}
                    {filteredModules.length > 0 && (
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-700 capitalize">
                                {activeModule.replace(/-/g, ' ')} Permissions
                            </h3>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() => toggleModule(activeModule)}
                                >
                                    {filteredModules
                                        .find(m => m.name === activeModule)
                                        ?.permissions.every(p => selected.includes(p.id)) 
                                        ? 'Deselect All' 
                                        : 'Select All'}
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Module Pagination */}
                    <Pagination
                        links={modules.links}
                        currentPage={modules.current_page}
                        lastPage={Math.ceil(modules.total / modules.per_page)}
                        total={modules.total}
                        className="mt-6"
                    />

                    {/* Permissions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredModules
                            .find(m => m.name === activeModule)
                            ?.permissions.map(permission => (
                                <div 
                                    key={permission.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                        selected.includes(permission.id)
                                            ? 'border-blue-500 bg-blue-50 shadow-sm dark:bg-blue-900/20'
                                            : 'hover:bg-gray-50 dark:hover:bg-neutral-800'
                                    }`}
                                    onClick={() => toggle(permission.id)}
                                >
                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 text-blue-600 rounded mt-0.5"
                                            checked={selected.includes(permission.id)}
                                            readOnly
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium capitalize">
                                                {permission.ability}
                                            </span>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {permission.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    
                </div>

                    

                {/* Selected Permissions Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 dark:bg-neutral-800">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-700">
                            Selected Permissions 
                            <span className="text-sm text-gray-500 ml-2">
                                ({selected.length} selected)
                            </span>
                        </h3>
                        <button
                            type="button"
                            className="text-sm text-gray-500 hover:text-gray-700"
                            onClick={() => {
                                setSelected([]);
                                setData('permissions', []);
                            }}
                        >
                            Clear All
                        </button>
                    </div>
                    
                    {selected.length === 0 ? (
                        <p className="text-gray-500 text-sm py-2">No permissions selected yet</p>
                    ) : (
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto py-2">
                            {selectedPermissions.map(permission => (
                                <span 
                                    key={permission.id} 
                                    className="bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full flex items-center dark:bg-blue-900/30 dark:text-blue-200"
                                >
                                    {permission.name}
                                    <button
                                        type="button"
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggle(permission.id);
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
                    submitText={processing ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                        </span>
                    ) : 'Create Role'}
                    cancelHref="/roles"
                    className="mt-6 justify-end"
                />
            </form>
        </AppLayout>
    );
}