export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export type FieldType = 'label' | 'text' | 'number' | 'boolean' | 'enum';

export type LabelSize = 'h1' | 'h2' | 'h3';

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  order: number;
}

export interface LabelField extends BaseField {
  type: 'label';
  size: LabelSize;
}

export interface TextField extends BaseField {
  type: 'text';
  placeholder?: string;
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface BooleanField extends BaseField {
  type: 'boolean';
  variant: 'checkbox' | 'toggle';
}

export interface EnumField extends BaseField {
  type: 'enum';
  options: FieldOption[];
}

export type Field = LabelField | TextField | NumberField | BooleanField | EnumField;

export interface Section {
  id: string;
  title: string;
  fields: Field[];
  order: number;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: string;
  templateId: string;
  data: Record<string, any>;
  submittedAt: Date;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}