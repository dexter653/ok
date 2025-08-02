import React, { useState } from 'react';
import { Field } from '../../types';
import { FieldRenderer } from '../forms/FieldRenderer';
import { Button } from '../ui/Button';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';

interface DraggableFieldProps {
  field: Field;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragging: boolean;
}

export function DraggableField({
  field,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: DraggableFieldProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative border-2 border-dashed rounded-lg p-4 transition-all duration-200
        ${isDragging ? 'opacity-50 border-blue-300' : 'border-gray-200'}
        ${isHovered ? 'border-blue-300 bg-blue-50' : 'bg-white'}
        hover:shadow-sm cursor-move
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-gray-400 mt-1">
          <GripVertical size={16} />
        </div>
        
        <div className="flex-1 min-w-0">
          <FieldRenderer
            field={field}
            value={getPreviewValue(field)}
            onChange={() => {}}
          />
        </div>
        
        <div className={`
          flex-shrink-0 flex space-x-1 transition-opacity
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="p-1.5"
          >
            <Edit2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getPreviewValue(field: Field) {
  switch (field.type) {
    case 'text':
      return field.placeholder || 'Sample text';
    case 'number':
      return 42;
    case 'boolean':
      return false;
    case 'enum':
      return field.options[0]?.value || '';
    default:
      return '';
  }
}