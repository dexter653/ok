import { Field, ValidationError } from '../types';

export function validateForm(fields: Field[], formData: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  fields.forEach(field => {
    if (field.type === 'label') return; // Skip label fields

    const value = formData[field.id];
    const isEmpty = value === undefined || value === null || value === '';

    // Required field validation
    if (field.required && isEmpty) {
      errors.push({
        fieldId: field.id,
        message: `${field.label} is required`,
      });
      return;
    }

    // Skip further validation if field is empty and not required
    if (isEmpty) return;

    // Type-specific validation
    switch (field.type) {
      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors.push({
            fieldId: field.id,
            message: `${field.label} must be a valid number`,
          });
        } else {
          if (field.min !== undefined && numValue < field.min) {
            errors.push({
              fieldId: field.id,
              message: `${field.label} must be at least ${field.min}`,
            });
          }
          if (field.max !== undefined && numValue > field.max) {
            errors.push({
              fieldId: field.id,
              message: `${field.label} must be at most ${field.max}`,
            });
          }
        }
        break;

      case 'text':
        if (typeof value !== 'string') {
          errors.push({
            fieldId: field.id,
            message: `${field.label} must be text`,
          });
        }
        break;

      case 'enum':
        const validValues = field.options.map(opt => opt.value);
        if (!validValues.includes(value)) {
          errors.push({
            fieldId: field.id,
            message: `${field.label} must be one of the available options`,
          });
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({
            fieldId: field.id,
            message: `${field.label} must be true or false`,
          });
        }
        break;
    }
  });

  return errors;
}

export function validateField(field: Field, value: any): string | undefined {
  const errors = validateForm([field], { [field.id]: value });
  return errors.find(error => error.fieldId === field.id)?.message;
}