import React from 'react';
import { Field } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';

interface FieldRendererProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  switch (field.type) {
    case 'label':
      const HeadingTag = field.size;
      const headingClasses = {
        h1: 'text-3xl font-bold text-gray-900',
        h2: 'text-2xl font-semibold text-gray-900',
        h3: 'text-xl font-medium text-gray-900',
      };
      
      return (
        <HeadingTag className={headingClasses[field.size]}>
          {field.label}
        </HeadingTag>
      );

    case 'text':
      return (
        <Input
          label={field.label}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          required={field.required}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          label={field.label}
          placeholder={field.placeholder}
          value={value !== undefined && value !== null ? String(value) : ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') {
              onChange(undefined);
            } else {
              const numVal = Number(val);
              onChange(isNaN(numVal) ? val : numVal);
            }
          }}
          min={field.min}
          max={field.max}
          error={error}
          required={field.required}
        />
      );

    case 'boolean':
      if (field.variant === 'toggle') {
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Toggle
              checked={Boolean(value)}
              onChange={onChange}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );
      } else {
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={field.id}
                checked={Boolean(value)}
                onChange={(e) => onChange(e.target.checked)}
                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${error ? 'border-red-300' : ''}`}
              />
              <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );
      }

    case 'enum':
      return (
        <Select
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
          options={field.options.map(opt => ({ value: opt.value, label: opt.label }))}
          placeholder="Select an option..."
          error={error}
          required={field.required}
        />
      );

    default:
      return null;
  }
}