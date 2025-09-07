import ActionFooter from '@/components/ActionFooter';
import React, { FormEvent } from 'react';

interface Props {
  data: {
    dryer_name: string;
    dryer_type: string;
    capacity: string | number;
    batch_time: string | number;
    manufacturer: string;
    model_number: string;
    power_kw: string | number;
    fuel_type: string;
    length_mm: string | number;
    width_mm: string | number;
    height_mm: string | number;
  };
  setData: (key: string, value: any) => void;
  onSubmit: (e: FormEvent) => void;
  processing: boolean;
  errors: Record<string, string>;
  submitText?: string;
  cancelHref: string;
}

const Form: React.FC<Props> = ({
  data,
  setData,
  onSubmit,
  processing,
  errors,
  submitText = 'Save',
  cancelHref,
}) => {
  const handleChange = (key: string, value: any) => setData(key, value);

  const inputCls =
    'w-full rounded-md border bg-background p-2 text-foreground outline-none focus:ring-2 focus:ring-ring';
  const labelCls = 'mb-1 block text-sm font-medium text-foreground';
  const optNoteCls = 'text-xs text-muted-foreground ml-1';
  const errCls = 'mt-1 text-xs text-rose-500';

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-background p-6 text-foreground">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Dryer Name (Required) */}
        <div>
          <label htmlFor="dryer_name" className={labelCls}>
            Dryer Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="dryer_name"
            type="text"
            value={data.dryer_name}
            onChange={(e) => handleChange('dryer_name', e.target.value)}
            className={inputCls}
            autoComplete="off"
            required
            aria-invalid={!!errors.dryer_name}
          />
          {errors.dryer_name && <p className={errCls}>{errors.dryer_name}</p>}
        </div>

        {/* Dryer Type (Optional) */}
        <div>
          <label htmlFor="dryer_type" className={labelCls}>
            Dryer Type <span className={optNoteCls}>(optional)</span>
          </label>
          <input
            id="dryer_type"
            type="text"
            value={data.dryer_type}
            onChange={(e) => handleChange('dryer_type', e.target.value)}
            className={inputCls}
            autoComplete="off"
            aria-invalid={!!errors.dryer_type}
          />
          {errors.dryer_type && <p className={errCls}>{errors.dryer_type}</p>}
        </div>

        {/* Capacity (Required) */}
        <div>
          <label htmlFor="capacity" className={labelCls}>
            Capacity (tonnes) <span className="text-rose-500">*</span>
          </label>
          <input
            id="capacity"
            type="number"
            inputMode="decimal"
            step="any"
            value={data.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            className={inputCls}
            required
            aria-invalid={!!errors.capacity}
          />
          {errors.capacity && <p className={errCls}>{errors.capacity}</p>}
        </div>

        {/* Batch Time (Optional) */}
        <div>
          <label htmlFor="batch_time" className={labelCls}>
            Batch Time (minutes) <span className={optNoteCls}>(optional)</span>
          </label>
          <input
            id="batch_time"
            type="number"
            inputMode="numeric"
            step="1"
            value={data.batch_time}
            onChange={(e) => handleChange('batch_time', e.target.value)}
            className={inputCls}
            aria-invalid={!!errors.batch_time}
          />
          {errors.batch_time && <p className={errCls}>{errors.batch_time}</p>}
        </div>
      </div>

      {/* Technical Specs */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { id: 'manufacturer', label: 'Manufacturer', type: 'text' },
          { id: 'model_number', label: 'Model Number', type: 'text' },
          { id: 'power_kw', label: 'Power (kW)', type: 'number', inputMode: 'decimal', step: 'any' },
          { id: 'fuel_type', label: 'Fuel Type', type: 'text' },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className={labelCls}>
              {field.label} <span className={optNoteCls}>(optional)</span>
            </label>
            <input
              id={field.id}
              type={field.type as any}
              inputMode={(field as any).inputMode}
              step={(field as any).step}
              value={(data as any)[field.id]}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={inputCls}
              aria-invalid={!!errors[field.id]}
            />
            {errors[field.id] && <p className={errCls}>{errors[field.id]}</p>}
          </div>
        ))}
      </div>

      {/* Physical Dimensions */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { id: 'length_mm', label: 'Length (mm)' },
          { id: 'width_mm', label: 'Width (mm)' },
          { id: 'height_mm', label: 'Height (mm)' },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className={labelCls}>
              {field.label} <span className={optNoteCls}>(optional)</span>
            </label>
            <input
              id={field.id}
              type="number"
              inputMode="numeric"
              step="1"
              value={(data as any)[field.id]}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={inputCls}
              aria-invalid={!!errors[field.id]}
            />
            {errors[field.id] && <p className={errCls}>{errors[field.id]}</p>}
          </div>
        ))}
      </div>

      <ActionFooter
        onSubmit={onSubmit}
        cancelHref={cancelHref}
        processing={processing}
        submitText={submitText}
        cancelText="Cancel"
      />
    </form>
  );
};

export default Form;
