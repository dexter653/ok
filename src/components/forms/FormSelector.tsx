import React from 'react';
import { Template } from '../../types';
import { Button } from '../ui/Button';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface FormSelectorProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  onBack: () => void;
}

export function FormSelector({ templates, onSelectTemplate, onBack }: FormSelectorProps) {
  // Filter templates that have at least one section with fields
  const availableTemplates = templates.filter(template => 
    template.sections.length > 0 && 
    template.sections.some(section => 
      section.fields.some(field => field.type !== 'label')
    )
  );

  if (availableTemplates.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} />
            Back to Templates
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Fill a Form</h1>
        </div>

        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Forms Available</h3>
          <p className="text-gray-600 mb-6">
            {templates.length === 0 
              ? 'You need to create at least one template before you can fill out forms.'
              : 'Your templates need sections with input fields to be fillable. Labels alone are not enough.'
            }
          </p>
          <Button onClick={onBack}>
            {templates.length === 0 ? 'Create Your First Template' : 'Edit Templates'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Templates
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fill a Form</h1>
          <p className="text-gray-600 mt-1">Choose a template to fill out</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableTemplates.map((template) => {
          const totalFields = template.sections.reduce(
            (total, section) => total + section.fields.filter(f => f.type !== 'label').length, 
            0
          );
          
          return (
          <div
            key={template.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <span>{template.sections.length} sections</span>
                <span>
                  {totalFields} fields
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formatDate(template.updatedAt)}</span>
              </div>
            </div>
            
            <Button className="w-full">
              Fill This Form
            </Button>
          </div>
        );
        })}
      </div>
    </div>
  );
}