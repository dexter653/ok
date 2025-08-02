import React, { useState } from 'react';
import { Section, Field } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { DraggableField } from './DraggableField';
import { FieldEditor } from './FieldEditor';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface SectionBuilderProps {
  section: Section;
  templateId: string;
  onUpdateSection: (updates: Partial<Section>) => void;
  onDeleteSection: () => void;
  onAddField: (field: Omit<Field, 'id' | 'order'>) => void;
  onUpdateField: (fieldId: string, updates: Partial<Field>) => void;
  onDeleteField: (fieldId: string) => void;
  onReorderFields: (sourceIndex: number, destinationIndex: number) => void;
}

export function SectionBuilder({
  section,
  templateId,
  onUpdateSection,
  onDeleteSection,
  onAddField,
  onUpdateField,
  onDeleteField,
  onReorderFields,
}: SectionBuilderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [draggedFieldIndex, setDraggedFieldIndex] = useState<number | null>(null);

  const handleSaveTitle = () => {
    if (title.trim() && title !== section.title) {
      onUpdateSection({ title: title.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setTitle(section.title);
    setIsEditingTitle(false);
  };

  const handleDeleteSection = () => {
    const fieldCount = section.fields.length;
    const message = fieldCount > 0 
      ? `Are you sure you want to delete the section "${section.title}"? This will also delete ${fieldCount} field${fieldCount === 1 ? '' : 's'} in this section.`
      : `Are you sure you want to delete the section "${section.title}"?`;
      
    if (window.confirm(message)) {
      onDeleteSection();
    }
  };
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedFieldIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedFieldIndex !== null && draggedFieldIndex !== dropIndex) {
      onReorderFields(draggedFieldIndex, dropIndex);
    }
    setDraggedFieldIndex(null);
  };

  const sortedFields = [...section.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Section Header */}
      <div className="p-4 border-b border-gray-100">
        {isEditingTitle ? (
          <div className="flex items-center space-x-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') handleCancelTitle();
              }}
              className="text-lg font-semibold border-0 shadow-none p-0 focus:ring-0"
              autoFocus
            />
            <Button size="sm" onClick={handleSaveTitle}>Save</Button>
            <Button size="sm" variant="ghost" onClick={handleCancelTitle}>Cancel</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditingTitle(true)}
            >
              {section.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteSection}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="p-4 space-y-3">
        {sortedFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No fields in this section yet.</p>
            <p className="text-xs mt-1">Use the field palette on the right to add fields.</p>
          </div>
        ) : (
          sortedFields.map((field, index) => (
            <DraggableField
              key={field.id}
              field={field}
              onEdit={() => setEditingField(field)}
              onDelete={() => {
                if (window.confirm(`Are you sure you want to delete the field "${field.label}"?`)) {
                  onDeleteField(field.id);
                }
              }}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              isDragging={draggedFieldIndex === index}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={!!editingField}
        onClose={() => setEditingField(null)}
        title="Edit Field"
        size="lg"
      >
        {editingField && (
          <FieldEditor
            field={editingField}
            onSave={(fieldData) => {
              onUpdateField(editingField.id, fieldData);
              setEditingField(null);
            }}
            onCancel={() => setEditingField(null)}
          />
        )}
      </Modal>
    </div>
  );
}