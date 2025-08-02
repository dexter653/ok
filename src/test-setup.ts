import '@testing-library/jest-dom';
import { vi } from 'vitest';

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

// Mock window.confirm and window.alert
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
});

Object.defineProperty(window, 'alert', {
  value: vi.fn(),
});