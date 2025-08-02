import { describe, it, expect } from 'vitest';
import { validateForm, validateField } from '../utils/validation';
import { Field } from '../types';

describe('Form Validation', () => {
  describe('validateForm', () => {
    it('should validate required text fields', () => {
      const fields: Field[] = [
        {
          id: '1',
          type: 'text',
          label: 'Name',
          required: true,
          order: 0,
        },
      ];

      const emptyData = {};
      const validData = { '1': 'John Doe' };
      const whitespaceData = { '1': '   ' };

      expect(validateForm(fields, emptyData)).toHaveLength(1);
      expect(validateForm(fields, validData)).toHaveLength(0);
      expect(validateForm(fields, whitespaceData)).toHaveLength(1);
    });

    it('should validate number fields with min/max constraints', () => {
      const fields: Field[] = [
        {
          id: '1',
          type: 'number',
          label: 'Age',
          required: true,
          min: 18,
          max: 65,
          order: 0,
        },
      ];

      const validData = { '1': 25 };
      const tooLowData = { '1': 15 };
      const tooHighData = { '1': 70 };
      const invalidData = { '1': 'not a number' };

      expect(validateForm(fields, validData)).toHaveLength(0);
      expect(validateForm(fields, tooLowData)).toHaveLength(1);
      expect(validateForm(fields, tooHighData)).toHaveLength(1);
      expect(validateForm(fields, invalidData)).toHaveLength(1);
    });

    it('should validate enum fields', () => {
      const fields: Field[] = [
        {
          id: '1',
          type: 'enum',
          label: 'Color',
          required: true,
          options: [
            { id: 'opt1', label: 'Red', value: 'red' },
            { id: 'opt2', label: 'Blue', value: 'blue' },
          ],
          order: 0,
        },
      ];

      const validData = { '1': 'red' };
      const invalidData = { '1': 'green' };
      const emptyData = {};

      expect(validateForm(fields, validData)).toHaveLength(0);
      expect(validateForm(fields, invalidData)).toHaveLength(1);
      expect(validateForm(fields, emptyData)).toHaveLength(1);
    });

    it('should validate boolean fields', () => {
      const fields: Field[] = [
        {
          id: '1',
          type: 'boolean',
          label: 'Agree to terms',
          required: true,
          variant: 'checkbox',
          order: 0,
        },
      ];

      const validData = { '1': true };
      const falseData = { '1': false };
      const emptyData = {};

      expect(validateForm(fields, validData)).toHaveLength(0);
      expect(validateForm(fields, falseData)).toHaveLength(0);
      expect(validateForm(fields, emptyData)).toHaveLength(1);
    });

    it('should skip validation for label fields', () => {
      const fields: Field[] = [
        {
          id: '1',
          type: 'label',
          label: 'Section Header',
          size: 'h2',
          order: 0,
        },
      ];

      expect(validateForm(fields, {})).toHaveLength(0);
    });

    it('should not validate non-required empty fields', () => {
      const fields: Field[] = [
        {
          id: '1',
          type: 'text',
          label: 'Optional Field',
          required: false,
          order: 0,
        },
      ];

      expect(validateForm(fields, {})).toHaveLength(0);
      expect(validateForm(fields, { '1': '' })).toHaveLength(0);
    });
  });

  describe('validateField', () => {
    it('should validate individual fields', () => {
      const field: Field = {
        id: '1',
        type: 'number',
        label: 'Age',
        required: true,
        min: 0,
        max: 120,
        order: 0,
      };

      expect(validateField(field, 25)).toBeUndefined();
      expect(validateField(field, -5)).toBeDefined();
      expect(validateField(field, 150)).toBeDefined();
      expect(validateField(field, 'invalid')).toBeDefined();
    });
  });
});