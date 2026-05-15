/**
 * Custom Fields system.
 *
 * Every entity in the platform can have tenant-defined custom fields. They
 * store as JSONB on the record's custom_fields column. The schema is defined
 * in the custom_field_definitions table.
 */

export type CustomFieldType =
  | 'text'
  | 'long_text'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multi_select'
  | 'url'
  | 'email'
  | 'phone'
  | 'file'
  | 'json'
  | 'rich_text'
  | 'lookup_user'
  | 'lookup_customer'
  | 'lookup_item'
  | 'tag';

export interface CustomFieldDefinition {
  id: string;
  tenant_id: string;
  entity_type: string;
  key: string;
  label: string;
  description?: string;
  type: CustomFieldType;
  required: boolean;
  default_value?: any;
  options?: Array<{ value: string; label: string; color?: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    error_message?: string;
  };
  show_in_list: boolean;
  show_in_form: boolean;
  show_to_customer: boolean;
  encrypted: boolean;
  sort_order: number;
  active: boolean;
}

export interface CustomFieldValue {
  key: string;
  value: any;
}

export function validateCustomField(
  definition: CustomFieldDefinition,
  value: any,
): { valid: boolean; error?: string } {
  if (definition.required && (value === null || value === undefined || value === '')) {
    return { valid: false, error: `${definition.label} is required` };
  }

  if (value === null || value === undefined || value === '') return { valid: true };

  switch (definition.type) {
    case 'number':
    case 'currency':
    case 'percent':
      const num = typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(num)) return { valid: false, error: `${definition.label} must be a number` };
      if (definition.validation?.min !== undefined && num < definition.validation.min) {
        return { valid: false, error: definition.validation.error_message ?? `Minimum ${definition.validation.min}` };
      }
      if (definition.validation?.max !== undefined && num > definition.validation.max) {
        return { valid: false, error: definition.validation.error_message ?? `Maximum ${definition.validation.max}` };
      }
      break;
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        return { valid: false, error: 'Invalid email format' };
      }
      break;
    case 'url':
      try {
        new URL(String(value));
      } catch {
        return { valid: false, error: 'Invalid URL' };
      }
      break;
    case 'date':
    case 'datetime':
      if (isNaN(Date.parse(String(value)))) {
        return { valid: false, error: `${definition.label} must be a valid date` };
      }
      break;
    case 'select':
      if (definition.options && !definition.options.some((o) => o.value === value)) {
        return { valid: false, error: `Invalid option for ${definition.label}` };
      }
      break;
    case 'multi_select':
      if (!Array.isArray(value)) {
        return { valid: false, error: `${definition.label} must be a list` };
      }
      if (definition.options) {
        const validValues = new Set(definition.options.map((o) => o.value));
        for (const v of value) {
          if (!validValues.has(v)) return { valid: false, error: `Invalid option: ${v}` };
        }
      }
      break;
  }

  return { valid: true };
}

export function defaultValueForType(type: CustomFieldType): any {
  switch (type) {
    case 'text':
    case 'long_text':
    case 'rich_text':
    case 'url':
    case 'email':
    case 'phone':
      return '';
    case 'number':
    case 'currency':
    case 'percent':
      return 0;
    case 'date':
    case 'datetime':
      return null;
    case 'boolean':
      return false;
    case 'select':
    case 'lookup_user':
    case 'lookup_customer':
    case 'lookup_item':
      return null;
    case 'multi_select':
    case 'tag':
      return [];
    case 'file':
      return null;
    case 'json':
      return {};
    default:
      return null;
  }
}
