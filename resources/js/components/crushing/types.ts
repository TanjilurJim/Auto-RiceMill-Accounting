export type Owner = 'company' | 'party';

export interface ConsumedRow {
  party_item_id?: string;   // party mode
  item_id?: string;         // company mode
  lot_id?: string;          // company mode
  qty: string;
  unit_name: string;
  weight?: string;
}

export interface GeneratedRow {

id: string;   // Unique identifier for the row
  item_id?: string;
  item_name: string;
  qty: string;
  unit_name: string;
  lot_no?: string;
  sale_value?: string;
  proc_cost?: string;
  is_main?: boolean;        // NEW
  per_kg_rate?: string; 
  weight?: string;

  _justComputed?: boolean; 
  
}

export interface UnitLite { id: number; name: string; }

// Small helpers
export type RSOption<T = number> = { value: T; label: string };
export type ErrorsBag = Record<string, string | string[]>;
