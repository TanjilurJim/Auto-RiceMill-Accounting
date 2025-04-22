// resources/js/pages/items/create.tsx
import ItemForm from '@/components/Form/ItemForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
}

interface Godown {
    id: number;
    name: string;
}

export default function ItemCreate({ categories, units, godowns }: { categories: Category[]; units: Unit[]; godowns: Godown[] }) {
    const { data, setData, post, processing, errors } = useForm({
        item_name: '',
        unit_id: '',
        category_id: '',
        godown_id: '',
        purchase_price: '',
        sale_price: '',
        previous_stock: '',
        total_previous_stock_value: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/items');
    };

    return (
        <AppLayout>
            <Head title="Create Item" />
            <div className="bg-gray-100 p-6">
                <PageHeader title="Create Item" addLinkHref='/items' addLinkText="Back" />

                <ItemForm
                    data={data}
                    setData={setData}
                    handleSubmit={handleSubmit}
                    processing={processing}
                    errors={errors}
                    submitText="Create Item"
                    cancelHref="/items"
                    categories={categories}
                    units={units}
                    godowns={godowns}
                />
            </div>
        </AppLayout>
    );
}
