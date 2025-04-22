// resources/js/pages/items/edit.tsx
import ActionFooter from '@/components/ActionFooter';
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

export default function EditItem({
    item,
    categories,
    units,
    godowns,
}: {
    item: Item;
    categories: Category[];
    units: Unit[];
    godowns: Godown[];
}) {
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
        description: item.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/items/${item.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Item" />
            <div className="p-6 bg-gray-100">
                <PageHeader title="Edit Item" addLinkHref='/items' addLinkText="Back" />
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
        </AppLayout>
    );
}
