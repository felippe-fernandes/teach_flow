import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getUser } from '../auth';
import { prisma } from '@/lib/prisma';
import { getContractors, createContractor } from '../contractors';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    contractor: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock auth
jest.mock('../auth', () => ({
  getUser: jest.fn(),
}));

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Contractors Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Security Tests', () => {
    it('should validate user_id when getting contractors', async () => {
      mockGetUser.mockResolvedValue({ id: 'user-123', email: 'test@test.com', name: 'Test', phone_number: null, timezone: 'UTC', default_currency: 'USD', two_factor_enabled: false, totp_secret: null, notification_preferences: null, google_id: null, supabase_auth_id: 'auth-123', created_at: new Date(), updated_at: new Date() });
      mockPrisma.contractor.findMany.mockResolvedValue([]);

      await getContractors();

      expect(mockPrisma.contractor.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ user_id: 'user-123' }),
        })
      );
    });

    it('should prevent creating contractor without authentication', async () => {
      mockGetUser.mockResolvedValue(null);

      const formData = new FormData();
      const result = await createContractor(formData);

      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should include user_id when creating contractor', async () => {
      mockGetUser.mockResolvedValue({ id: 'user-123', email: 'test@test.com', name: 'Test', phone_number: null, timezone: 'UTC', default_currency: 'USD', two_factor_enabled: false, totp_secret: null, notification_preferences: null, google_id: null, supabase_auth_id: 'auth-123', created_at: new Date(), updated_at: new Date() });
      mockPrisma.contractor.create.mockResolvedValue({ id: 'contractor-1', user_id: 'user-123', name: 'Test', contact_info: null, default_hourly_rate: 50, currency: 'BRL', payment_frequency: 'monthly', payment_terms_days: 0, min_cancellation_notice_hours: 24, cancellation_penalty_rate: 0, notes: null, created_at: new Date(), updated_at: new Date() } as never);

      const formData = new FormData();
      formData.append('name', 'Test Contractor');
      formData.append('default_hourly_rate', '50');
      formData.append('currency', 'BRL');

      await createContractor(formData);

      expect(mockPrisma.contractor.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ user_id: 'user-123' }),
        })
      );
    });
  });

  describe('Business Logic Tests', () => {
    it('should create contractor with correct financial rules', async () => {
      mockGetUser.mockResolvedValue({ id: 'user-123', email: 'test@test.com', name: 'Test', phone_number: null, timezone: 'UTC', default_currency: 'USD', two_factor_enabled: false, totp_secret: null, notification_preferences: null, google_id: null, supabase_auth_id: 'auth-123', created_at: new Date(), updated_at: new Date() });
      mockPrisma.contractor.create.mockResolvedValue({ id: 'contractor-1', user_id: 'user-123', name: 'School Alpha', contact_info: null, default_hourly_rate: 100.50, currency: 'USD', payment_frequency: 'monthly', payment_terms_days: 30, min_cancellation_notice_hours: 24, cancellation_penalty_rate: 0, notes: null, created_at: new Date(), updated_at: new Date() } as never);

      const formData = new FormData();
      formData.append('name', 'School Alpha');
      formData.append('default_hourly_rate', '100.50');
      formData.append('currency', 'USD');
      formData.append('payment_frequency', 'monthly');
      formData.append('payment_terms_days', '30');

      await createContractor(formData);

      expect(mockPrisma.contractor.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'School Alpha',
            default_hourly_rate: 100.50,
            currency: 'USD',
            payment_frequency: 'monthly',
            payment_terms_days: 30,
          }),
        })
      );
    });
  });
});
