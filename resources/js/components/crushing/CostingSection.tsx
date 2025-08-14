import React from 'react';

export type Costing = {
    load_unload: string;
    bag_repair: string;
    weighing: string;
    khudi_cut: string;
    bran_cut: string;
    other: string;
    market_rate: string;
};

interface Props {
    costing: Costing;
    onChange: (patch: Partial<Costing>) => void;
}

const fields: Array<[keyof Costing, string]> = [
    ['load_unload', 'Load–Unload (৳)'],
    ['bag_repair', 'Bag Repair (৳)'],
    ['weighing', 'Weighing Cost (৳)'],
    ['khudi_cut', 'Khudi Cutting Cost (৳)'],
    ['bran_cut', 'Bran Cutting Cost (৳)'],
    ['other', 'Other (৳)'],
];

const CostingSection: React.FC<Props> = React.memo(({ costing, onChange }) => {
    return (
        <div className="mt-8 rounded border bg-slate-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">Cost Analysis</h3>
            <div className="grid grid-cols-2 gap-3">
                {fields.map(([key, label]) => (
                    <label key={key} className="block">
                        <span className="mb-1 block text-sm">{label}</span>
                        <input
                            type="number"
                            className="w-full rounded border p-2"
                            value={costing[key] || ''}
                            onChange={(e) => onChange({ [key]: e.target.value } as Partial<Costing>)}
                        />
                    </label>
                ))}
                <label className="col-span-2 block">
                    <span className="mb-1 block text-sm">Market rate (৳ / unit, optional)</span>
                    <input
                        type="number"
                        className="w-full rounded border p-2"
                        value={costing.market_rate || ''}
                        onChange={(e) => onChange({ market_rate: e.target.value })}
                    />
                </label>
            </div>
        </div>
    );
});

export default CostingSection;
