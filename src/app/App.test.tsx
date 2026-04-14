import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../app/App';

vi.mock('@/app/components/Navbar', () => ({
  Navbar: () => <div data-testid="navbar" />,
}));

vi.mock('@/app/components/Footer', () => ({
  Footer: () => <div data-testid="footer" />,
}));

vi.mock('@/app/components/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/app/components/AdminRoute', () => ({
  AdminRoute: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('App', () => {
  it('renders the main application', () => {
    render(<App />);

    // Check if main elements are present
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
