// resources/js/pages/items/edit.tsx
import ItemForm from '@/components/Form/ItemForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Item {
    id: number;
    item_name: string;
    // item_part: string;
    unit_id: number;
    category_id: number;
    godown_id: number;
    purchase_price: number;
    sale_price: number;
    previous_stock: number;
    total_previous_stock_value: number;
    description?: string;
    weight?: number | null;
    total_weight?: number | null;
    lot_no?: string;
    received_at?: string;
}

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

export default function EditItem({ item, categories, units, godowns }: { item: Item; categories: Category[]; units: Unit[]; godowns: Godown[] }) {
    const { data, setData, put, processing, errors } = useForm({
        item_name: item.item_name,
        // item_part: item.item_part,
        category_id: item.category_id,
        unit_id: item.unit_id,
        godown_id: item.godown_id,
        purchase_price: item.purchase_price,
        sale_price: item.sale_price,
        previous_stock: item.previous_stock,
        total_previous_stock_value: item.total_previous_stock_value,
        weight: item.weight ?? '',
        total_weight: item.total_weight ?? '',
        description: item.description || '',
        lot_no: item.lot_no || '',
        received_at: item.received_at || '',
    });
    // { header: 'Stock', accessor: (item: Item) => item.current_stock ?? 0 },
    //

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/items/${item.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Item" />
            <div className="h-full bg-gray-100 p-6">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader title="Edit Item" addLinkHref="/items" addLinkText="Back" />
                    <ItemForm
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        errors={errors}
                        submitText="Update Item"
                        cancelHref="/items"
                        categories={categories}
                        units={units}
                        godowns={godowns}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
