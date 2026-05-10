import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  usePathname: vi.fn().mockReturnValue('/'),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));