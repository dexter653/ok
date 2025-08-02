import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FieldRenderer } from '../../components/forms/FieldRenderer';
import { Field } from '../../types';

describe('FieldRenderer', () => {
  it('should render text field correctly', () => {
    const field: Field = {
      id: '1',
      type: 'text',
      label: 'Name',
      placeholder: 'Enter your name',
      required: true,
      order: 0,
    };

    const onChange = vi.fn();
    render(<FieldRenderer field={field} value="" onChange={onChange} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('should render number field with constraints', () => {
    const field: Field = {
      id: '1',
      type: 'number',
      label: 'Age',
      min: 18,
      max: 65,
      required: true,
      order: 0,
    };

    const onChange = vi.fn();
    render(<FieldRenderer field={field} value={25} onChange={onChange} />);

    const input = screen.getByLabelText(/age/i) as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.min).toBe('18');
    expect(input.max).toBe('65');
    expect(input.value).toBe('25');
  });

  it('should render boolean field as checkbox', () => {
    const field: Field = {
      id: '1',
      type: 'boolean',
      label: 'Subscribe',
      variant: 'checkbox',
      order: 0,
    };

    const onChange = vi.fn();
    render(<FieldRenderer field={field} value={false} onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should render enum field as select', () => {
    const field: Field = {
      id: '1',
      type: 'enum',
      label: 'Color',
      options: [
        { id: 'opt1', label: 'Red', value: 'red' },
        { id: 'opt2', label: 'Blue', value: 'blue' },
      ],
      order: 0,
    };

    const onChange = vi.fn();
    render(<FieldRenderer field={field} value="" onChange={onChange} />);

    expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('should render label field as heading', () => {
    const field: Field = {
      id: '1',
      type: 'label',
      label: 'Section Title',
      size: 'h2',
      order: 0,
    };

    const onChange = vi.fn();
    render(<FieldRenderer field={field} value="" onChange={onChange} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title');
  });

  it('should display error message', () => {
    const field: Field = {
      id: '1',
      type: 'text',
      label: 'Name',
      required: true,
      order: 0,
    };

    const onChange = vi.fn();
    render(<FieldRenderer field={field} value="" onChange={onChange} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
});