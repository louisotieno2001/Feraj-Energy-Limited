import { describe, expect, it } from 'vitest';
import {
  buildCheckoutMessage,
  calculatePaymentSummary,
  getStripeCheckoutUrl,
} from '@/services/payment.services';

describe('payment.services', () => {
  it('calculates payment summary with shipping threshold', () => {
    const summary = calculatePaymentSummary([
      { id: '1', name: 'Panel', price: 500, quantity: 2 },
      { id: '2', name: 'Inverter', price: 250, quantity: 1 },
    ]);

    expect(summary.subtotal).toBe(1250);
    expect(summary.tax).toBe(100);
    expect(summary.shipping).toBe(0);
    expect(summary.total).toBe(1350);
    expect(summary.itemCount).toBe(3);
  });

  it('builds a checkout message from the summary', () => {
    const message = buildCheckoutMessage({
      subtotal: 800,
      tax: 64,
      shipping: 49,
      total: 913,
      itemCount: 2,
    });

    expect(message).toContain('Proceeding to payment gateway');
    expect(message).toContain('2 items');
    expect(message).toContain('total $913.00');
  });

  it('returns null when stripe checkout url is not configured', () => {
    const url = getStripeCheckoutUrl({
      subtotal: 800,
      tax: 64,
      shipping: 49,
      total: 913,
      itemCount: 2,
    });

    expect(url).toBeNull();
  });
});
