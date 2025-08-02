import { useState } from 'react';
import { Template, Section, Field } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/helpers';

export function useTemplates() {
  const [templates, setTemplates] = useLocalStorage<Template[]>('form-templates', []);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const activeTemplate = templates.find(t => t.id === activeTemplateId) || null;

  const createTemplate = (name: string, description?: string): Template => {
    if (templates.length >= 5) {
      throw new Error('Maximum of 5 templates allowed');
    }

    const newTemplate: Template = {
      id: generateId(),
      name,
      description,
      sections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTemplates([...templates, newTemplate]);
    setActiveTemplateId(newTemplate.id);
    return newTemplate;
  };

  const updateTemplate = (templateId: string, updates: Partial<Omit<Template, 'id' | 'createdAt'>>) => {
    setTemplates(prevTemplates => {
      const updatedTemplates = prevTemplates.map(template => 
        template.id === templateId 
          ? { ...template, ...updates, updatedAt: new Date() }
          : template
      );
      return updatedTemplates;
    });
  };

  const deleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      setTemplates(templates.filter(template => template.id !== templateId));
      if (activeTemplateId === templateId) {
        setActiveTemplateId(null);
      }
    }
  };

  const addSection = (templateId: string, title: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newSection: Section = {
      id: generateId(),
      title,
      fields: [],
      order: template.sections.length,
    };

    setTemplates(prevTemplates => {
      return prevTemplates.map(t => 
        t.id === templateId 
          ? { ...t, sections: [...t.sections, newSection], updatedAt: new Date() }
          : t
      );
    });
  };

  const updateSection = (templateId: string, sectionId: string, updates: Partial<Section>) => {
    setTemplates(prevTemplates => {
      return prevTemplates.map(template => {
        if (template.id !== templateId) return template;
        
        const updatedSections = template.sections.map(section =>
          section.id === sectionId ? { ...section, ...updates } : section
        );
        
        return { ...template, sections: updatedSections, updatedAt: new Date() };
      });
    });
  };

  const deleteSection = (templateId: string, sectionId: string) => {
    setTemplates(prevTemplates => {
      return prevTemplates.map(template => {
        if (template.id !== templateId) return template;
        
        const updatedSections = template.sections.filter(section => section.id !== sectionId);
        return { ...template, sections: updatedSections, updatedAt: new Date() };
      });
    });
  };

  const addField = (templateId: string, sectionId: string, field: Omit<Field, 'id' | 'order'>) => {
    setTemplates(prevTemplates => {
      return prevTemplates.map(template => {
        if (template.id !== templateId) return template;
        
        const updatedSections = template.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          const newField: Field = {
            ...field,
            id: generateId(),
            order: section.fields.length,
          } as Field;
          
          return { ...section, fields: [...section.fields, newField] };
        });
        
        return { ...template, sections: updatedSections, updatedAt: new Date() };
      });
    });
  };

  const updateField = (templateId: string, sectionId: string, fieldId: string, updates: Partial<Field>) => {
    setTemplates(prevTemplates => {
      return prevTemplates.map(template => {
        if (template.id !== templateId) return template;
        
        const updatedSections = template.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          const updatedFields = section.fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
          );
          
          return { ...section, fields: updatedFields };
        });
        
        return { ...template, sections: updatedSections, updatedAt: new Date() };
      });
    });
  };

  const deleteField = (templateId: string, sectionId: string, fieldId: string) => {
    setTemplates(prevTemplates => {
      return prevTemplates.map(template => {
        if (template.id !== templateId) return template;
        
        const updatedSections = template.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          const updatedFields = section.fields.filter(field => field.id !== fieldId);
          return { ...section, fields: updatedFields };
        });
        
        return { ...template, sections: updatedSections, updatedAt: new Date() };
      });
    });
  };

  const reorderFields = (templateId: string, sectionId: string, sourceIndex: number, destinationIndex: number) => {
    setTemplates(prevTemplates => {
      return prevTemplates.map(template => {
        if (template.id !== templateId) return template;
        
        const updatedSections = template.sections.map(section => {
          if (section.id !== sectionId) return section;
          
          const fields = [...section.fields];
          const [removed] = fields.splice(sourceIndex, 1);
          fields.splice(destinationIndex, 0, removed);
          
          // Update order values
          const reorderedFields = fields.map((field, index) => ({
            ...field,
            order: index,
          }));
          
          return { ...section, fields: reorderedFields };
        });
        
        return { ...template, sections: updatedSections, updatedAt: new Date() };
      });
    });
  };

  return {
    templates,
    activeTemplate,
    activeTemplateId,
    setActiveTemplateId,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    addSection,
    updateSection,
    deleteSection,
    addField,
    updateField,
    deleteField,
    reorderFields,
  };
}