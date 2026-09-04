import { describe, it, expect } from '@jest/globals';
import { TemplateRendererService } from '../../src/services/template-renderer.service.js';

describe('TemplateRendererService Unit Tests', () => {
  describe('Property Resolution', () => {
    it('should resolve nested dot notation properties safely', () => {
      const data = {
        order: {
          orderNumber: 'ORD-12345',
          shippingAddress: {
            city: 'Bengaluru',
          },
        },
      };

      expect(
        TemplateRendererService.resolveProperty(data, 'order.orderNumber'),
      ).toBe('ORD-12345');
      expect(
        TemplateRendererService.resolveProperty(
          data,
          'order.shippingAddress.city',
        ),
      ).toBe('Bengaluru');
    });

    it('should return fallback if key is missing or undefined', () => {
      const data = { order: { id: '1' } };

      expect(
        TemplateRendererService.resolveProperty(
          data,
          'order.nonExistentKey',
          'N/A',
        ),
      ).toBe('N/A');
      expect(
        TemplateRendererService.resolveProperty(data, 'user.name', ''),
      ).toBe('');
    });

    it('should prevent prototype pollution properties', () => {
      const data = {};
      expect(
        TemplateRendererService.resolveProperty(data, '__proto__.polluted', ''),
      ).toBe('');
      expect(
        TemplateRendererService.resolveProperty(data, 'constructor.name', ''),
      ).toBe('');
    });
  });

  describe('HTML Escaping', () => {
    it('should escape HTML characters for email templates', () => {
      expect(
        TemplateRendererService.escapeHtml('<script>alert("xss")</script>'),
      ).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(TemplateRendererService.escapeHtml("Tom & Jerry's")).toBe(
        'Tom &amp; Jerry&#039;s',
      );
    });
  });

  describe('Interpolation', () => {
    it('should interpolate single and multiple tokens in a string', () => {
      const template =
        'Hello {{user.name}}, your order {{order.number}} is confirmed!';
      const data = { user: { name: 'Alice' }, order: { number: 'ORD-999' } };

      const result = TemplateRendererService.interpolate(template, data, false);
      expect(result).toBe('Hello Alice, your order ORD-999 is confirmed!');
    });

    it('should replace missing tokens with empty string without crashing', () => {
      const template = 'Hello {{user.name}}, tracking: {{order.tracking}}';
      const data = { user: { name: 'Alice' } };

      const result = TemplateRendererService.interpolate(template, data, false);
      expect(result).toBe('Hello Alice, tracking: ');
    });
  });

  describe('Built-in Templates Catalog', () => {
    it('should retrieve built-in templates for all 7 required events', () => {
      const requiredEvents = [
        'auth.welcome',
        'order.placed',
        'order.shipped',
        'order.out_for_delivery',
        'order.delivered',
        'order.cancelled',
        'payment.captured',
      ];

      for (const eventCode of requiredEvents) {
        const emailTmpl = TemplateRendererService.getBuiltinTemplate(
          eventCode,
          'EMAIL',
        );
        const smsTmpl = TemplateRendererService.getBuiltinTemplate(
          eventCode,
          'SMS',
        );
        const inAppTmpl = TemplateRendererService.getBuiltinTemplate(
          eventCode,
          'IN_APP',
        );

        expect(emailTmpl).toBeDefined();
        expect(emailTmpl.body).toContain('{{');
        expect(smsTmpl).toBeDefined();
        expect(inAppTmpl).toBeDefined();
      }
    });

    it('should render an order.placed email template with escaped data', () => {
      const tmpl = TemplateRendererService.getBuiltinTemplate(
        'order.placed',
        'EMAIL',
      );
      const data = {
        user: { name: 'John <Doe>' },
        order: { orderNumber: 'ORD-20260824-A1B2C3', totalAmount: '118.00' },
      };

      const { subject, body } = TemplateRendererService.render({
        templateSubject: tmpl.subject,
        templateBody: tmpl.body,
        data,
        channel: 'EMAIL',
      });

      expect(subject).toBe('Order Confirmed: ORD-20260824-A1B2C3');
      expect(body).toContain('John &lt;Doe&gt;');
      expect(body).toContain('ORD-20260824-A1B2C3');
      expect(body).toContain('118.00');
    });
  });
});
