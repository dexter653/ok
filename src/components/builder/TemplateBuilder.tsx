import React, { useState } from 'react';
import { Template } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { SectionBuilder } from './SectionBuilder';
import { FieldPalette } from './FieldPalette';
import { useTemplates } from '../../hooks/useTemplates';
import { Plus, Eye, Save, ArrowLeft, Settings } from 'lucide-react';

interface TemplateBuilderProps {
  template: Template;
  onBack: () => void;
  onPreview: () => void;
}

export function TemplateBuilder({ template, onBack, onPreview }: TemplateBuilderProps) {
  const {
    templates,
    updateTemplate,
    addSection,
    updateSection,
    deleteSection,
    addField,
    updateField,
    deleteField,
    reorderFields,
  } = useTemplates();

  const [isAddingSection, setIsAddingSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const [templateName, setTemplateName] = useState(template.name);
  const [templateDescription, setTemplateDescription] = useState(template.description || '');
  const [showSettings, setShowSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Get the current template from the templates array to ensure we have the latest data
  const currentTemplate = templates.find(t => t.id === template.id) || template;

  const handleSaveTemplate = async () => {
    setSaveStatus('saving');
    try {
      updateTemplate(template.id, {
        name: templateName.trim(),
        description: templateDescription.trim() || undefined,
      });
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
      setSaveStatus('idle');
    }
  };

  const handleAddSection = () => {
    if (sectionTitle.trim()) {
      addSection(template.id, sectionTitle.trim());
      setSectionTitle('');
      setIsAddingSection(false);
    }
  };

  const sortedSections = [...currentTemplate.sections].sort((a, b) => a.order - b.order);

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...';
      case 'saved': return 'Saved!';
      default: return 'Save';
    }
  };

  const getSaveButtonClass = () => {
    switch (saveStatus) {
      case 'saved': return 'bg-green-600 hover:bg-green-700';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} size="sm">
              <ArrowLeft size={16} />
              Back
            </Button>
            <div className="text-sm text-gray-500">
              Templates / <span className="text-gray-900 font-medium">{currentTemplate.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
              <Settings size={16} />
              Settings
            </Button>
            <Button variant="secondary" size="sm" onClick={onPreview}>
              <Eye size={16} />
              Preview
            </Button>
            <Button 
              size="sm" 
              onClick={handleSaveTemplate} 
              disabled={saveStatus === 'saving'}
              className={getSaveButtonClass()}
            >
              <Save size={16} />
              {getSaveButtonText()}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            {sortedSections.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your form</h3>
                <p className="text-gray-600 mb-6">Add your first section to get started.</p>
                <Button onClick={() => setIsAddingSection(true)}>
                  <Plus size={16} />
                  Add Section
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedSections.map((section) => (
                  <SectionBuilder
                    key={section.id}
                    section={section}
                    templateId={template.id}
                    onUpdateSection={(updates) => updateSection(template.id, section.id, updates)}
                    onDeleteSection={() => deleteSection(template.id, section.id)}
                    onAddField={(field) => addField(template.id, section.id, field)}
                    onUpdateField={(fieldId, updates) => updateField(template.id, section.id, fieldId, updates)}
                    onDeleteField={(fieldId) => deleteField(template.id, section.id, fieldId)}
                    onReorderFields={(sourceIndex, destinationIndex) => 
                      reorderFields(template.id, section.id, sourceIndex, destinationIndex)
                    }
                  />
                ))}
                
                <div className="flex justify-center pt-4">
                  <Button variant="ghost" onClick={() => setIsAddingSection(true)}>
                    <Plus size={16} />
                    Add Section
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Field Palette */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-auto">
          <FieldPalette
            onAddField={(sectionId, field) => addField(template.id, sectionId, field)}
            sections={sortedSections}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Template Settings"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name"
          />
          <Input
            label="Description (Optional)"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            placeholder="Brief description of this template"
          />
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleSaveTemplate();
              setShowSettings(false);
            }}>
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddingSection}
        onClose={() => {
          setIsAddingSection(false);
          setSectionTitle('');
        }}
        title="Add New Section"
      >
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            placeholder="Enter section title"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSection();
            }}
            autoFocus
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddingSection(false);
                setSectionTitle('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSection} disabled={!sectionTitle.trim()}>
              Add Section
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}