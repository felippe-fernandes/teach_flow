import { describe, it, expect, jest } from '@jest/globals';
import { getUser } from '../auth';
import { prisma } from '@/lib/prisma';
import { createClass, updateClass } from '../classes';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      findFirst: jest.fn(),
    },
    contractor: {
      findFirst: jest.fn(),
    },
    class: {
      create: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../auth', () => ({
  getUser: jest.fn(),
}));

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Classes Actions Security', () => {
  it('should verify student and contractor ownership before creating class', async () => {
    mockGetUser.mockResolvedValue({ id: 'user-123', email: 'test@test.com', name: 'Test', phone_number: null, timezone: 'UTC', default_currency: 'USD', two_factor_enabled: false, totp_secret: null, notification_preferences: null, google_id: null, supabase_auth_id: 'auth-123', created_at: new Date(), updated_at: new Date() });
    mockPrisma.student.findFirst.mockResolvedValue(null);
    mockPrisma.contractor.findFirst.mockResolvedValue(null);

    const formData = new FormData();
    formData.append('student_id', 'student-999');
    formData.append('contractor_id', 'contractor-999');

    const result = await createClass(formData);

    expect(result).toEqual({ error: 'Student or Contractor not found' });
    expect(mockPrisma.student.findFirst).toHaveBeenCalledWith({
      where: { id: 'student-999', user_id: 'user-123' },
    });
  });

  it('should auto-create payment when class is completed', async () => {
    mockGetUser.mockResolvedValue({ id: 'user-123', email: 'test@test.com', name: 'Test', phone_number: null, timezone: 'UTC', default_currency: 'USD', two_factor_enabled: false, totp_secret: null, notification_preferences: null, google_id: null, supabase_auth_id: 'auth-123', created_at: new Date(), updated_at: new Date() });
    mockPrisma.class.update.mockResolvedValue({
      id: 'class-1',
      contractor_id: 'contractor-1',
      student_id: 'student-1',
    } as never);
    mockPrisma.contractor.findFirst.mockResolvedValue({
      id: 'contractor-1',
      user_id: 'user-123',
      default_hourly_rate: 50,
      currency: 'BRL',
      payment_terms_days: 30,
    } as never);

    const formData = new FormData();
    formData.append('status', 'completed');

    await updateClass('class-1', formData);

    expect(mockPrisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user_id: 'user-123',
          class_id: 'class-1',
          amount: 50,
          status: 'pending',
        }),
      })
    );
  });
});
