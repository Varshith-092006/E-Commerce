import { execSync } from 'child_process';

const catalogSql = `
INSERT INTO categories (id, name, slug, description, is_active, display_order, created_at, updated_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'Electronics', 'electronics', 'Electronic devices', true, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, seller_id, category_id, title, slug, description, brand, sku, price, status, is_available, attributes, average_rating, total_reviews, created_at, updated_at)
VALUES ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Pro Headphones', 'pro-headphones', 'High fidelity audio headphones', 'SoundMaster', 'HEADPHONE-001', 99.99, 'PUBLISHED', true, '{}', 5.0, 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, product_id, user_id, rating, comment, created_at, updated_at)
VALUES ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 5, 'Amazing sound quality!', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
`;

const orderSql = `
INSERT INTO orders (id, order_number, user_id, status, payment_method, shipping_address, pricing_snapshot, total_amount, created_at, updated_at)
VALUES ('66666666-6666-6666-6666-666666666666', 'ORD-BENCH-001', '55555555-5555-5555-5555-555555555555', 'CONFIRMED', 'PREPAID', '{"city":"New York","country":"USA"}', '{"subtotal":99.99}', 99.99, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, product_id, seller_id, title, unit_price, quantity, subtotal, status, created_at, updated_at)
VALUES ('77777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Pro Headphones', 99.99, 1, 99.99, 'CONFIRMED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
`;

const notificationSql = `
INSERT INTO notifications (id, user_id, channel, category, template_code, template_version, recipient, subject, content, status, created_at, updated_at)
VALUES ('88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', 'EMAIL', 'ORDERS', 'ORDER_CONFIRMATION', 1, 'user@example.com', 'Order Confirmed', 'Your order #ORD-BENCH-001 has been confirmed.', 'SENT', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
`;

function runPsql(db, sql) {
  console.log(`Seeding ${db}...`);
  execSync(`docker exec -i ecommerce-postgres psql -U postgres -d ${db}`, {
    input: sql,
    stdio: ['pipe', 'inherit', 'inherit']
  });
}

runPsql('catalog_db', catalogSql);
runPsql('order_db', orderSql);
runPsql('notification_db', notificationSql);
console.log('Seeding completed successfully!');
