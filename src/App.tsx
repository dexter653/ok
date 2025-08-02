import React, { useState } from 'react';
import { Template } from './types';
import { useTemplates } from './hooks/useTemplates';
import { TemplateList } from './components/templates/TemplateList';
import { TemplateBuilder } from './components/builder/TemplateBuilder';
import { FormView } from './components/forms/FormView';
import { FormSelector } from './components/forms/FormSelector';

type View = 'list' | 'builder' | 'form' | 'form-selector';

function App() {
  const { templates } = useTemplates();
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentView('builder');
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentView('form');
  };

  const handleFillForm = () => {
    setCurrentView('form-selector');
  };

  const handleSelectFormTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTemplate(null);
  };

  const handleBackToSelector = () => {
    setCurrentView('form-selector');
    setSelectedTemplate(null);
  };

  // Get fresh template data when switching views
  const getCurrentTemplate = () => {
    if (!selectedTemplate) return null;
    return templates.find(t => t.id === selectedTemplate.id) || selectedTemplate;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'list' && (
        <TemplateList
          onSelectTemplate={handleSelectTemplate}
          onPreviewTemplate={handlePreviewTemplate}
          onFillForm={handleFillForm}
        />
      )}

      {currentView === 'form-selector' && (
        <FormSelector
          templates={templates}
          onSelectTemplate={handleSelectFormTemplate}
          onBack={handleBackToList}
        />
      )}

      {currentView === 'builder' && getCurrentTemplate() && (
        <TemplateBuilder
          template={getCurrentTemplate()!}
          onBack={handleBackToList}
          onPreview={() => setCurrentView('form')}
        />
      )}

      {currentView === 'form' && getCurrentTemplate() && (
        <FormView
          template={getCurrentTemplate()!}
          onBack={currentView === 'form' && selectedTemplate ? handleBackToSelector : handleBackToList}
        />
      )}
    </div>
  );
}

export default App;