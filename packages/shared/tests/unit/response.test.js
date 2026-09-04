import { successResponse, errorResponse } from '../../src/index.js';

describe('Response Envelopes (Master Prompt §5.4)', () => {
  it('successResponse returns standardized envelope', () => {
    const res = successResponse({
      data: { id: '123', name: 'Item' },
      requestId: 'req-abc-123',
    });

    expect(res).toEqual({
      success: true,
      data: { id: '123', name: 'Item' },
      meta: {
        requestId: 'req-abc-123',
      },
    });
  });

  it('successResponse includes extra meta like pagination', () => {
    const res = successResponse({
      data: [1, 2, 3],
      requestId: 'req-xyz',
      extraMeta: { page: 1, total: 3 },
    });

    expect(res.meta).toEqual({
      requestId: 'req-xyz',
      page: 1,
      total: 3,
    });
  });

  it('errorResponse returns standardized error envelope', () => {
    const res = errorResponse({
      code: 'VALIDATION_ERROR',
      message: 'Invalid payload',
      details: { email: 'Required' },
      requestId: 'req-err-456',
    });

    expect(res).toEqual({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid payload',
        details: { email: 'Required' },
      },
      meta: {
        requestId: 'req-err-456',
      },
    });
  });
});
