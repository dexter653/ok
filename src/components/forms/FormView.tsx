import React, { useState } from 'react';
import { Template, Field, ValidationError } from '../../types';
import { Button } from '../ui/Button';
import { FieldRenderer } from './FieldRenderer';
import { validateForm } from '../../utils/validation';
import { useFormSubmissions } from '../../hooks/useFormSubmissions';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FormViewProps {
  template: Template;
  onBack: () => void;
}

export function FormView({ template, onBack }: FormViewProps) {
  const { submitForm } = useFormSubmissions();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allFields = template.sections.flatMap(section => section.fields);
  const nonLabelFields = allFields.filter(field => field.type !== 'label');

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error for this field if it exists
    setErrors(prev => prev.filter(error => error.fieldId !== fieldId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const validationErrors = validateForm(nonLabelFields, formData);
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        // Scroll to first error
        setTimeout(() => {
          const firstErrorElement = document.querySelector('[data-error="true"]');
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        return;
      }

      // Submit the form
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          const field = nonLabelFields.find(f => f.id === key);
          return field && (value !== undefined && value !== null && value !== '');
        })
      );
      
      submitForm(template.id, filteredData);
      setIsSubmitted(true);
      setErrors([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors([{ fieldId: 'form', message: 'Failed to submit form. Please try again.' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    setFormData({});
    setErrors([]);
  };

  const getFieldError = (fieldId: string) => {
    return errors.find(error => error.fieldId === fieldId)?.message;
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for your submission. Your data has been saved.</p>
          <div className="space-x-3">
            <Button onClick={handleSubmitAnother}>
              Submit Another
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
          {template.description && (
            <p className="text-gray-600 mt-1">{template.description}</p>
          )}
        </div>
      </div>

      {template.sections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form Not Ready</h3>
          <p className="text-gray-600 mb-6">This template doesn't have any sections or input fields yet.</p>
          <Button onClick={onBack}>
            Back to Templates
          </Button>
        </div>
      ) : template.sections.every(section => section.fields.every(field => field.type === 'label')) ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Input Fields</h3>
          <p className="text-gray-600 mb-6">This template only contains labels. Add some input fields to make it fillable.</p>
          <Button onClick={onBack}>
            Back to Templates
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {template.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{section.title}</h2>
                
                <div className="space-y-6">
                  {section.fields
                    .sort((a, b) => a.order - b.order)
                    .map((field) => (
                      <div key={field.id} data-error={!!getFieldError(field.id)}>
                        <FieldRenderer
                          field={field}
                          value={formData[field.id]}
                          onChange={(value) => handleFieldChange(field.id, value)}
                          error={getFieldError(field.id)}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle size={16} className="text-red-600 mr-2" />
                <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Send size={16} />
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}