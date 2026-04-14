import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session, User } from '@supabase/supabase-js';
import { AuthService } from '@/services/auth.service';

const mockAuth = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
  resend: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: mockAuth,
  },
}));

describe('AuthService', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
  } as User;

  const mockSession = {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    expires_in: 3600,
    expires_at: 123456,
    token_type: 'bearer',
    user: mockUser,
  } as Session;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signs up a user with profile metadata', async () => {
    mockAuth.signUp.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const result = await AuthService.signUp(
      'test@example.com',
      'Password123!',
      'John Doe'
    );

    expect(mockAuth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!',
      options: {
        data: {
          full_name: 'John Doe',
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    expect(result.user).toBe(mockUser);
    expect(result.session).toBe(mockSession);
    expect(result.error).toBeNull();
  });

  it('signs in an existing user', async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const result = await AuthService.signIn('test@example.com', 'Password123!');

    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!',
    });
    expect(result.user).toBe(mockUser);
    expect(result.session).toBe(mockSession);
    expect(result.error).toBeNull();
  });

  it('signs out the current user', async () => {
    mockAuth.signOut.mockResolvedValue({ error: null });

    const result = await AuthService.signOut();

    expect(mockAuth.signOut).toHaveBeenCalledTimes(1);
    expect(result.error).toBeNull();
  });
});
