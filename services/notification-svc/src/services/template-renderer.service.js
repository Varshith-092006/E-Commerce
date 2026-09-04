export class TemplateRendererService {
  /**
   * Built-in default templates catalog for code-level resilience & seeding
   */
  static BUILTIN_TEMPLATES = {
    // 1. auth.welcome
    'auth.welcome': {
      EMAIL: {
        subject: 'Welcome to Antigravity Store, {{user.firstName}}!',
        body: '<p>Hello <strong>{{user.firstName}}</strong>,</p><p>Welcome to Antigravity Store! Your account has been successfully created. Start shopping the best products today.</p>',
      },
      SMS: {
        subject: null,
        body: 'Welcome to Antigravity Store, {{user.firstName}}! Your account is active. Shop now: https://store.local',
      },
      IN_APP: {
        subject: 'Welcome to Antigravity Store!',
        body: 'Your account is ready. Explore our latest electronics and exclusive deals.',
      },
    },

    // 2. order.placed
    'order.placed': {
      EMAIL: {
        subject: 'Order Confirmed: {{order.orderNumber}}',
        body: '<p>Thank you for your order, <strong>{{user.name}}</strong>!</p><p>Order <strong>{{order.orderNumber}}</strong> for <strong>₹{{order.totalAmount}}</strong> has been successfully placed and is being prepared.</p>',
      },
      SMS: {
        subject: null,
        body: 'Order {{order.orderNumber}} placed successfully! Total: Rs.{{order.totalAmount}}. Track your order at https://store.local/orders',
      },
      IN_APP: {
        subject: 'Order Placed: {{order.orderNumber}}',
        body: 'Your order {{order.orderNumber}} for ₹{{order.totalAmount}} has been placed successfully.',
      },
    },

    // 3. order.shipped
    'order.shipped': {
      EMAIL: {
        subject: 'Your Order {{order.orderNumber}} has been Shipped!',
        body: '<p>Hi <strong>{{user.name}}</strong>,</p><p>Your order <strong>{{order.orderNumber}}</strong> has been handed over to <strong>{{order.courierName}}</strong> (AWB: <strong>{{order.trackingNumber}}</strong>).</p>',
      },
      SMS: {
        subject: null,
        body: 'Your order {{order.orderNumber}} has been shipped via {{order.courierName}} (AWB: {{order.trackingNumber}}).',
      },
      IN_APP: {
        subject: 'Order Shipped: {{order.orderNumber}}',
        body: 'Your order has been dispatched via {{order.courierName}} with tracking number {{order.trackingNumber}}.',
      },
    },

    // 4. order.out_for_delivery
    'order.out_for_delivery': {
      EMAIL: {
        subject: 'Out for Delivery: {{order.orderNumber}}',
        body: '<p>Hi <strong>{{user.name}}</strong>,</p><p>Your package <strong>{{order.orderNumber}}</strong> is out for delivery today with agent <strong>{{order.deliveryAgentName}}</strong> (Phone: <strong>{{order.deliveryAgentPhone}}</strong>).</p>',
      },
      SMS: {
        subject: null,
        body: 'Order {{order.orderNumber}} is out for delivery today with agent {{order.deliveryAgentName}} ({{order.deliveryAgentPhone}}).',
      },
      IN_APP: {
        subject: 'Out for Delivery: {{order.orderNumber}}',
        body: 'Your order is out for delivery today. Delivery agent: {{order.deliveryAgentName}} ({{order.deliveryAgentPhone}}).',
      },
    },

    // 5. order.delivered
    'order.delivered': {
      EMAIL: {
        subject: 'Delivered: {{order.orderNumber}}',
        body: '<p>Hi <strong>{{user.name}}</strong>,</p><p>Your order <strong>{{order.orderNumber}}</strong> was successfully delivered to <strong>{{order.recipientName}}</strong>.</p><p>Thank you for shopping with us!</p>',
      },
      SMS: {
        subject: null,
        body: 'Order {{order.orderNumber}} has been delivered. Thank you for shopping with Antigravity Store!',
      },
      IN_APP: {
        subject: 'Order Delivered: {{order.orderNumber}}',
        body: 'Order {{order.orderNumber}} was successfully delivered to {{order.recipientName}}.',
      },
    },

    // 6. order.cancelled
    'order.cancelled': {
      EMAIL: {
        subject: 'Order Cancelled: {{order.orderNumber}}',
        body: '<p>Hi <strong>{{user.name}}</strong>,</p><p>Your order <strong>{{order.orderNumber}}</strong> has been cancelled. Reason: {{order.cancellationReason}}. Refund status: <strong>{{order.refundStatus}}</strong>.</p>',
      },
      SMS: {
        subject: null,
        body: 'Order {{order.orderNumber}} has been cancelled. Refund status: {{order.refundStatus}}.',
      },
      IN_APP: {
        subject: 'Order Cancelled: {{order.orderNumber}}',
        body: 'Order {{order.orderNumber}} was cancelled. Refund status: {{order.refundStatus}}.',
      },
    },

    // 7. payment.captured
    'payment.captured': {
      EMAIL: {
        subject: 'Payment Receipt: {{payment.orderNumber}}',
        body: '<p>Hi <strong>{{user.name}}</strong>,</p><p>We received your payment of <strong>₹{{payment.amount}}</strong> for order <strong>{{payment.orderNumber}}</strong> via <strong>{{payment.paymentMethod}}</strong>.</p>',
      },
      SMS: {
        subject: null,
        body: 'Payment of Rs.{{payment.amount}} received for order {{payment.orderNumber}} via {{payment.paymentMethod}}.',
      },
      IN_APP: {
        subject: 'Payment Successful',
        body: 'Payment of ₹{{payment.amount}} confirmed for order {{payment.orderNumber}}.',
      },
    },
  };

  /**
   * Safe property path resolution without eval() or prototype pollution
   */
  static resolveProperty(obj, path, fallback = '') {
    if (!obj || typeof obj !== 'object') {
      return fallback;
    }
    const parts = path.trim().split('.');
    let curr = obj;

    for (const part of parts) {
      if (
        curr === null ||
        curr === undefined ||
        typeof curr !== 'object' ||
        part === '__proto__' ||
        part === 'constructor' ||
        part === 'prototype'
      ) {
        return fallback;
      }
      curr = curr[part];
    }

    return curr !== null && curr !== undefined ? String(curr) : fallback;
  }

  /**
   * Escape HTML entities to prevent script injection in HTML emails
   */
  static escapeHtml(str) {
    if (typeof str !== 'string') {
      return String(str || '');
    }
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Interpolate {{path.to.variable}} tokens within a string
   */
  static interpolate(templateStr, data = {}, isHtml = false) {
    if (!templateStr || typeof templateStr !== 'string') {
      return '';
    }

    return templateStr.replace(/\{\{([\w.]+)\}\}/g, (_match, token) => {
      const rawVal = TemplateRendererService.resolveProperty(data, token, '');
      return isHtml ? TemplateRendererService.escapeHtml(rawVal) : rawVal;
    });
  }

  /**
   * Retrieve built-in default template for code and channel
   */
  static getBuiltinTemplate(code, channel) {
    const eventCatalog = TemplateRendererService.BUILTIN_TEMPLATES[code];
    if (!eventCatalog) {
      return null;
    }
    return eventCatalog[channel] || null;
  }

  /**
   * Render subject and body for a given template and data
   */
  static render({ templateSubject, templateBody, data, channel }) {
    const isHtml = channel === 'EMAIL';

    const renderedSubject = templateSubject
      ? TemplateRendererService.interpolate(templateSubject, data, false)
      : null;

    const renderedBody = templateBody
      ? TemplateRendererService.interpolate(templateBody, data, isHtml)
      : '';

    return {
      subject: renderedSubject,
      body: renderedBody,
    };
  }
}
