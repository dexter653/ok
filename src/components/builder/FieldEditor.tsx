import React, { useState } from 'react';
import { Field, FieldType, LabelSize, FieldOption } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Plus, X } from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface FieldEditorProps {
  field?: Field;
  onSave: (field: Omit<Field, 'id' | 'order'>) => void;
  onCancel: () => void;
}

const fieldTypeOptions = [
  { value: 'label', label: 'Label' },
  { value: 'text', label: 'Text Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'boolean', label: 'Boolean (Checkbox/Toggle)' },
  { value: 'enum', label: 'Dropdown' },
];

const labelSizeOptions = [
  { value: 'h1', label: 'Heading 1 (Large)' },
  { value: 'h2', label: 'Heading 2 (Medium)' },
  { value: 'h3', label: 'Heading 3 (Small)' },
];

const booleanVariantOptions = [
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'toggle', label: 'Toggle' },
];

export function FieldEditor({ field, onSave, onCancel }: FieldEditorProps) {
  const [fieldType, setFieldType] = useState<FieldType>(field?.type || 'text');
  const [label, setLabel] = useState(field?.label || '');
  const [required, setRequired] = useState(field?.required || false);
  
  // Label-specific
  const [labelSize, setLabelSize] = useState<LabelSize>(
    field?.type === 'label' ? field.size : 'h2'
  );
  
  // Text/Number-specific
  const [placeholder, setPlaceholder] = useState(
    (field?.type === 'text' || field?.type === 'number') ? field.placeholder || '' : ''
  );
  
  // Number-specific
  const [min, setMin] = useState<string>(
    field?.type === 'number' && field.min !== undefined ? String(field.min) : ''
  );
  const [max, setMax] = useState<string>(
    field?.type === 'number' && field.max !== undefined ? String(field.max) : ''
  );
  
  // Boolean-specific
  const [booleanVariant, setBooleanVariant] = useState<'checkbox' | 'toggle'>(
    field?.type === 'boolean' ? field.variant : 'checkbox'
  );
  
  // Enum-specific
  const [options, setOptions] = useState<FieldOption[]>(
    field?.type === 'enum' ? field.options : [{ id: generateId(), label: '', value: '' }]
  );

  const handleAddOption = () => {
    setOptions([...options, { id: generateId(), label: '', value: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, key: 'label' | 'value', value: string) => {
    setOptions(options.map((opt, i) => 
      i === index ? { ...opt, [key]: value } : opt
    ));
  };

  const handleSave = () => {
    if (!label.trim()) return;

    let fieldData: Omit<Field, 'id' | 'order'>;

    switch (fieldType) {
      case 'label':
        fieldData = {
          type: 'label',
          label: label.trim(),
          size: labelSize,
        };
        break;
        
      case 'text':
        fieldData = {
          type: 'text',
          label: label.trim(),
          required,
          placeholder: placeholder.trim() || undefined,
        };
        break;
        
      case 'number':
        fieldData = {
          type: 'number',
          label: label.trim(),
          required,
          placeholder: placeholder.trim() || undefined,
          min: min ? Number(min) : undefined,
          max: max ? Number(max) : undefined,
        };
        break;
        
      case 'boolean':
        fieldData = {
          type: 'boolean',
          label: label.trim(),
          required,
          variant: booleanVariant,
        };
        break;
        
      case 'enum':
        const validOptions = options.filter(opt => opt.label.trim() && opt.value.trim());
        if (validOptions.length < 1) return;
        
        fieldData = {
          type: 'enum',
          label: label.trim(),
          required,
          options: validOptions.map(opt => ({
            ...opt,
            label: opt.label.trim(),
            value: opt.value.trim(),
          })),
        };
        break;
        
      default:
        return;
    }

    onSave(fieldData);
  };

  const canSave = label.trim() && (fieldType !== 'enum' || options.some(opt => opt.label.trim() && opt.value.trim()));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Field Type"
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value as FieldType)}
          options={fieldTypeOptions}
        />
        
        <Input
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter field label"
        />
      </div>

      {fieldType === 'label' && (
        <Select
          label="Heading Size"
          value={labelSize}
          onChange={(e) => setLabelSize(e.target.value as LabelSize)}
          options={labelSizeOptions}
        />
      )}

      {(fieldType === 'text' || fieldType === 'number') && (
        <Input
          label="Placeholder"
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Enter placeholder text"
        />
      )}

      {fieldType === 'number' && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Minimum Value"
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="No minimum"
          />
          <Input
            label="Maximum Value"
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="No maximum"
          />
        </div>
      )}

      {fieldType === 'boolean' && (
        <Select
          label="Display Style"
          value={booleanVariant}
          onChange={(e) => setBooleanVariant(e.target.value as 'checkbox' | 'toggle')}
          options={booleanVariantOptions}
        />
      )}

      {fieldType === 'enum' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Options</label>
          {options.map((option, index) => (
            <div key={option.id} className="flex space-x-2">
              <Input
                placeholder="Option label"
                value={option.label}
                onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Option value"
                value={option.value}
                onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                className="flex-1"
              />
              {options.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                  className="p-2"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={handleAddOption}>
            <Plus size={16} />
            Add Option
          </Button>
        </div>
      )}

      {fieldType !== 'label' && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="required"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="required" className="text-sm font-medium text-gray-700">
            Required field
          </label>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!canSave}>
          {field ? 'Update Field' : 'Add Field'}
        </Button>
      </div>
    </div>
  );
}