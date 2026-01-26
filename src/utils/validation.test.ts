import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema } from '../utils/validation'

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        fullName: 'John Doe'
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123!',
        fullName: 'John Doe'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('rejects weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        fullName: 'John Doe'
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})