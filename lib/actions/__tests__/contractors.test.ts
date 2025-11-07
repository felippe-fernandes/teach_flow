import { describe, it, expect, jest, beforeEach } from '@jest/globals';

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

describe('Contractors Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Security Tests', () => {
    it('should validate user_id when getting contractors', async () => {
      const { getUser } = require('../auth');
      const { prisma } = require('@/lib/prisma');
      const { getContractors } = require('../contractors');

      getUser.mockResolvedValue({ id: 'user-123', email: 'test@test.com' });
      prisma.contractor.findMany.mockResolvedValue([]);

      await getContractors();

      expect(prisma.contractor.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ user_id: 'user-123' }),
        })
      );
    });

    it('should prevent creating contractor without authentication', async () => {
      const { getUser } = require('../auth');
      const { createContractor } = require('../contractors');

      getUser.mockResolvedValue(null);

      const formData = new FormData();
      const result = await createContractor(formData);

      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should include user_id when creating contractor', async () => {
      const { getUser } = require('../auth');
      const { prisma } = require('@/lib/prisma');
      const { createContractor } = require('../contractors');

      getUser.mockResolvedValue({ id: 'user-123' });
      prisma.contractor.create.mockResolvedValue({ id: 'contractor-1' });

      const formData = new FormData();
      formData.append('name', 'Test Contractor');
      formData.append('default_hourly_rate', '50');
      formData.append('currency', 'BRL');

      await createContractor(formData);

      expect(prisma.contractor.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ user_id: 'user-123' }),
        })
      );
    });
  });

  describe('Business Logic Tests', () => {
    it('should create contractor with correct financial rules', async () => {
      const { getUser } = require('../auth');
      const { prisma } = require('@/lib/prisma');
      const { createContractor } = require('../contractors');

      getUser.mockResolvedValue({ id: 'user-123' });
      prisma.contractor.create.mockResolvedValue({ id: 'contractor-1' });

      const formData = new FormData();
      formData.append('name', 'School Alpha');
      formData.append('default_hourly_rate', '100.50');
      formData.append('currency', 'USD');
      formData.append('payment_frequency', 'monthly');
      formData.append('payment_terms_days', '30');

      await createContractor(formData);

      expect(prisma.contractor.create).toHaveBeenCalledWith(
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
