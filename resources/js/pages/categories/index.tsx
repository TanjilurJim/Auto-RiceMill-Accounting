// resources/js/pages/categories/index.tsx
import ActionButtons from '@/components/ActionButtons';
import ActionFooter from '@/components/ActionFooter';
import AddBtn from '@/components/Btn&Link/AddBtn';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface PaginatedCategories {
    data: Category[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Category {
    id: number;
    name: string;
}

export default function CategoryIndex({ categories }: { categories: PaginatedCategories }) {
    const [editCategory, setEditCategory] = useState<Category | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        name: '',
    });

    const handleEdit = (category: Category) => {
        setEditCategory(category);
        setData('name', category.name);
    };

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            destroy(`/categories/${id}`);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editCategory) {
            put(`/categories/${editCategory.id}`, {
                onSuccess: () => {
                    reset();
                    setEditCategory(null);
                },
            });
        } else {
            post('/categories', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleCancel = () => {
        reset();
        setEditCategory(null);
    };

    const columns = [
        {
            header: '#SL',
            accessor: (_: Category, index?: number) => (index !== undefined ? index + 1 : '-'),
            className: 'text-center',
        },
        { header: 'Category Name', accessor: 'name' },
        {
            header: 'Action',
            accessor: (category: Category) => <ActionButtons onEdit={() => handleEdit(category)} onDelete={() => handleDelete(category.id)} />,
            className: 'text-center',
        },
    ];

    return (
        <AppLayout>
            <Head title="Category Manage" />
            <div className="text-foreground w-full p-4 md:p-12">
                <div className="grid grid-cols-12 gap-4">
                    {/* Left: List */}
                    <div className="col-span-12 lg:col-span-8">
                        <PageHeader title="All Category Manage" />
                        <TableComponent columns={columns} data={categories.data} noDataMessage="No categories found." />
                    </div>

                    {/* Right: Form */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="bg-background space-y-3 rounded-md border p-4">
                            <PageHeader title={editCategory ? 'Edit Category' : 'Add Category'} />
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded border p-2"
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

                                <div className="flex justify-between">
                                    {editCategory ? (
                                        <ActionFooter
                                            className="w-full justify-between"
                                            onSubmit={handleSubmit}
                                            onCancel={handleCancel}
                                            processing={processing}
                                            submitText="Update"
                                            cancelText="Cancel"
                                        />
                                    ) : (
                                        <AddBtn processing={processing}>Add Category</AddBtn>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Pagination */}
                <Pagination links={categories.links} currentPage={categories.current_page} lastPage={categories.last_page} total={categories.total} />
            </div>
        </AppLayout>
    );
}
