import { describe, it, expect, jest } from '@jest/globals';

jest.mock('@/lib/prisma');
jest.mock('../auth');

describe('Classes Actions Security', () => {
  it('should verify student and contractor ownership before creating class', async () => {
    const { getUser } = require('../auth');
    const { prisma } = require('@/lib/prisma');
    const { createClass } = require('../classes');

    getUser.mockResolvedValue({ id: 'user-123' });
    prisma.student.findFirst.mockResolvedValue(null);
    prisma.contractor.findFirst.mockResolvedValue(null);

    const formData = new FormData();
    formData.append('student_id', 'student-999');
    formData.append('contractor_id', 'contractor-999');

    const result = await createClass(formData);

    expect(result).toEqual({ error: 'Student or Contractor not found' });
    expect(prisma.student.findFirst).toHaveBeenCalledWith({
      where: { id: 'student-999', user_id: 'user-123' },
    });
  });

  it('should auto-create payment when class is completed', async () => {
    const { getUser } = require('../auth');
    const { prisma } = require('@/lib/prisma');
    const { updateClass } = require('../classes');

    getUser.mockResolvedValue({ id: 'user-123' });
    prisma.class.update.mockResolvedValue({
      id: 'class-1',
      contractor_id: 'contractor-1',
      student_id: 'student-1',
    });
    prisma.contractor.findFirst.mockResolvedValue({
      id: 'contractor-1',
      user_id: 'user-123',
      default_hourly_rate: 50,
      currency: 'BRL',
      payment_terms_days: 30,
    });

    const formData = new FormData();
    formData.append('status', 'completed');

    await updateClass('class-1', formData);

    expect(prisma.payment.create).toHaveBeenCalledWith(
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
