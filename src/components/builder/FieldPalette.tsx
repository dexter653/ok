import React, { useState } from 'react';
import { Section, Field } from '../../types';
import { Input } from '../ui/Input';
import { 
  Type, 
  Hash, 
  ToggleLeft, 
  ChevronDown, 
  Search,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface FieldPaletteProps {
  onAddField: (sectionId: string, field: Omit<Field, 'id' | 'order'>) => void;
  sections: Section[];
}

export function FieldPalette({ onAddField, sections }: FieldPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>(sections[0]?.id || '');

  const handleAddField = (fieldType: string, variant?: string, size?: string) => {
    if (!selectedSection) return;

    let field: Omit<Field, 'id' | 'order'>;

    switch (fieldType) {
      case 'text':
        field = {
          type: 'text',
          label: variant === 'paragraph' ? 'Paragraph Text' : 'Short Answer',
          placeholder: variant === 'paragraph' ? 'Enter your response...' : 'Type your answer here...',
        };
        break;
      case 'number':
        field = {
          type: 'number',
          label: 'Number',
          placeholder: 'Enter a number',
        };
        break;
      case 'boolean':
        field = {
          type: 'boolean',
          label: variant === 'radio' ? 'Checkbox' : 'Yes / No',
          variant: variant === 'radio' ? 'checkbox' : 'toggle',
        };
        break;
      case 'enum':
        field = {
          type: 'enum',
          label: 'Dropdown',
          options: [
            { id: generateId(), label: 'Option 1', value: 'option1' },
            { id: generateId(), label: 'Option 2', value: 'option2' },
          ],
        };
        break;
      case 'label':
        field = {
          type: 'label',
          label: `${size?.toUpperCase()} Heading`,
          size: size as 'h1' | 'h2' | 'h3',
        };
        break;
      default:
        return;
    }

    onAddField(selectedSection, field);
  };

  // Update selected section when sections change
  React.useEffect(() => {
    if (sections.length > 0 && !sections.find(s => s.id === selectedSection)) {
      setSelectedSection(sections[0].id);
    }
  }, [sections, selectedSection]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Add Fields</span>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search elements"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Section Selector */}
      {sections.length > 1 && (
        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add to Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Field Categories */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {sections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Add a section first to start adding fields</p>
          </div>
        ) : (
          <>
            {/* Labels */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                TEXT ELEMENTS
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddField('label', undefined, 'h1')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  disabled={!selectedSection}
                >
                  <Heading1 size={16} />
                  <span className="text-xs mt-1 text-gray-700">Heading 1</span>
                </button>
                <button
                  onClick={() => handleAddField('label', undefined, 'h2')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  disabled={!selectedSection}
                >
                  <Heading2 size={16} />
                  <span className="text-xs mt-1 text-gray-700">Heading 2</span>
                </button>
                <button
                  onClick={() => handleAddField('label', undefined, 'h3')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  disabled={!selectedSection}
                >
                  <Heading3 size={16} />
                  <span className="text-xs mt-1 text-gray-700">Heading 3</span>
                </button>
                <button
                  onClick={() => handleAddField('text', 'short')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  disabled={!selectedSection}
                >
                  <Type size={16} />
                  <span className="text-xs mt-1 text-gray-700">Short Answer</span>
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                INPUT FIELDS
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddField('number')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  disabled={!selectedSection}
                >
                  <Hash size={16} />
                  <span className="text-xs mt-1 text-gray-700">Number</span>
                </button>
                <button
                  onClick={() => handleAddField('enum')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  disabled={!selectedSection}
                >
                  <ChevronDown size={16} />
                  <span className="text-xs mt-1 text-gray-700">Dropdown</span>
                </button>
                <button
                  onClick={() => handleAddField('boolean', 'radio')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  disabled={!selectedSection}
                >
                  <div className="w-4 h-4 border-2 border-gray-400 rounded" />
                  <span className="text-xs mt-1 text-gray-700">Checkbox</span>
                </button>
                <button
                  onClick={() => handleAddField('boolean', 'toggle')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                  disabled={!selectedSection}
                >
                  <ToggleLeft size={16} />
                  <span className="text-xs mt-1 text-gray-700">Toggle</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}