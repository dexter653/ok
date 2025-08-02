import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTemplates } from '../../hooks/useTemplates';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTemplates', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  it('should create a new template', () => {
    const { result } = renderHook(() => useTemplates());

    act(() => {
      const template = result.current.createTemplate('Test Template', 'Test Description');
      expect(template.name).toBe('Test Template');
      expect(template.description).toBe('Test Description');
      expect(template.sections).toHaveLength(0);
    });

    expect(result.current.templates).toHaveLength(1);
  });

  it('should not allow more than 5 templates', () => {
    const { result } = renderHook(() => useTemplates());

    // Create 5 templates
    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.createTemplate(`Template ${i + 1}`);
      }
    });

    expect(result.current.templates).toHaveLength(5);

    // Try to create a 6th template
    act(() => {
      expect(() => result.current.createTemplate('Template 6')).toThrow('Maximum of 5 templates allowed');
    });
  });

  it('should add section to template', () => {
    const { result } = renderHook(() => useTemplates());

    let templateId: string;

    act(() => {
      const template = result.current.createTemplate('Test Template');
      templateId = template.id;
    });

    act(() => {
      result.current.addSection(templateId, 'Test Section');
    });

    const template = result.current.templates.find(t => t.id === templateId);
    expect(template?.sections).toHaveLength(1);
    expect(template?.sections[0].title).toBe('Test Section');
  });

  it('should add field to section', () => {
    const { result } = renderHook(() => useTemplates());

    let templateId: string;
    let sectionId: string;

    act(() => {
      const template = result.current.createTemplate('Test Template');
      templateId = template.id;
    });

    act(() => {
      result.current.addSection(templateId, 'Test Section');
    });

    const template = result.current.templates.find(t => t.id === templateId);
    sectionId = template!.sections[0].id;

    act(() => {
      result.current.addField(templateId, sectionId, {
        type: 'text',
        label: 'Test Field',
        required: true,
      });
    });

    const updatedTemplate = result.current.templates.find(t => t.id === templateId);
    expect(updatedTemplate?.sections[0].fields).toHaveLength(1);
    expect(updatedTemplate?.sections[0].fields[0].label).toBe('Test Field');
  });

  it('should delete template', () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    const { result } = renderHook(() => useTemplates());

    let templateId: string;

    act(() => {
      const template = result.current.createTemplate('Test Template');
      templateId = template.id;
    });

    expect(result.current.templates).toHaveLength(1);

    act(() => {
      result.current.deleteTemplate(templateId);
    });

    expect(result.current.templates).toHaveLength(0);

    // Restore window.confirm
    window.confirm = originalConfirm;
  });
});