import React, { useState } from 'react';
import { Template } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useTemplates } from '../../hooks/useTemplates';
import { formatDate } from '../../utils/helpers';
import { Plus, Edit2, Trash2, FileText, Eye } from 'lucide-react';

interface TemplateListProps {
  onSelectTemplate: (template: Template) => void;
  onPreviewTemplate: (template: Template) => void;
  onFillForm: () => void;
}

export function TemplateList({ onSelectTemplate, onPreviewTemplate, onFillForm }: TemplateListProps) {
  const { templates, createTemplate, deleteTemplate } = useTemplates();
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');

  const handleCreateTemplate = () => {
    if (newTemplateName.trim()) {
      try {
        const template = createTemplate(newTemplateName.trim(), newTemplateDescription.trim() || undefined);
        setIsCreating(false);
        setNewTemplateName('');
        setNewTemplateDescription('');
        onSelectTemplate(template);
      } catch (error) {
        console.error('Error creating template:', error);
      }
    }
  };

  const canCreateTemplate = templates.length < 5;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Form Templates</h1>
          <p className="text-gray-600 mt-2">Create and manage your form templates</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="secondary"
            onClick={onFillForm}
            disabled={templates.length === 0}
          >
            <FileText size={16} />
            Fill a Form
          </Button>
          <Button 
            onClick={() => setIsCreating(true)}
            disabled={!canCreateTemplate}
          >
            <Plus size={16} />
            New Template {!canCreateTemplate && `(${templates.length}/5)`}
          </Button>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-600 mb-6">Create your first template to get started with form building.</p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus size={16} />
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTemplate(template.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                <p>{template.sections.length} sections</p>
                <p>Created {formatDate(template.createdAt)}</p>
                <p>Updated {formatDate(template.updatedAt)}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectTemplate(template)}
                  className="flex-1"
                >
                  <Edit2 size={14} />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreviewTemplate(template)}
                  className="flex-1"
                >
                  <Eye size={14} />
                  Preview
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreating}
        onClose={() => {
          setIsCreating(false);
          setNewTemplateName('');
          setNewTemplateDescription('');
        }}
        title="Create New Template"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="Enter template name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateTemplate();
            }}
            autoFocus
          />
          
          <Input
            label="Description (Optional)"
            value={newTemplateDescription}
            onChange={(e) => setNewTemplateDescription(e.target.value)}
            placeholder="Brief description of this template"
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreating(false);
                setNewTemplateName('');
                setNewTemplateDescription('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!newTemplateName.trim()}>
              Create Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}