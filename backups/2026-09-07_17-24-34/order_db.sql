--
-- PostgreSQL database dump
--

\restrict H6ezD6znJzp97lTrjkbxFUR746cw1WcBDafb8VMV7kXP9CEWcRcG7woNEDC7mla

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.order_status_history DROP CONSTRAINT IF EXISTS order_status_history_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_cart_id_fkey;
DROP INDEX IF EXISTS public.processed_events_consumer_group_idx;
DROP INDEX IF EXISTS public.processed_events_consumer_group_event_id_key;
DROP INDEX IF EXISTS public.orders_user_id_idx;
DROP INDEX IF EXISTS public.orders_tracking_number_idx;
DROP INDEX IF EXISTS public.orders_status_idx;
DROP INDEX IF EXISTS public.orders_order_number_key;
DROP INDEX IF EXISTS public.orders_created_at_idx;
DROP INDEX IF EXISTS public.order_status_history_order_id_to_status_idx;
DROP INDEX IF EXISTS public.order_status_history_order_id_created_at_idx;
DROP INDEX IF EXISTS public.order_status_history_changed_by_created_at_idx;
DROP INDEX IF EXISTS public.order_outbox_status_next_retry_at_created_at_idx;
DROP INDEX IF EXISTS public.order_items_seller_id_idx;
DROP INDEX IF EXISTS public.order_items_product_id_idx;
DROP INDEX IF EXISTS public.order_items_order_id_idx;
DROP INDEX IF EXISTS public.idempotency_records_user_id_idx;
DROP INDEX IF EXISTS public.idempotency_records_user_id_idempotency_key_key;
DROP INDEX IF EXISTS public.idempotency_records_status_idx;
DROP INDEX IF EXISTS public.carts_user_id_key;
DROP INDEX IF EXISTS public.carts_user_id_idx;
DROP INDEX IF EXISTS public.cart_items_product_id_idx;
DROP INDEX IF EXISTS public.cart_items_cart_id_product_id_key;
DROP INDEX IF EXISTS public.cart_items_cart_id_idx;
ALTER TABLE IF EXISTS ONLY public.processed_events DROP CONSTRAINT IF EXISTS processed_events_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_status_history DROP CONSTRAINT IF EXISTS order_status_history_pkey;
ALTER TABLE IF EXISTS ONLY public.order_outbox DROP CONSTRAINT IF EXISTS order_outbox_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.idempotency_records DROP CONSTRAINT IF EXISTS idempotency_records_pkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_pkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_pkey;
DROP TABLE IF EXISTS public.processed_events;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.order_status_history;
DROP TABLE IF EXISTS public.order_outbox;
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.idempotency_records;
DROP TABLE IF EXISTS public.carts;
DROP TABLE IF EXISTS public.cart_items;
DROP TYPE IF EXISTS public."PaymentMethod";
DROP TYPE IF EXISTS public."OutboxStatus";
DROP TYPE IF EXISTS public."OrderStatus";
DROP TYPE IF EXISTS public."IdempotencyStatus";
--
-- Name: IdempotencyStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."IdempotencyStatus" AS ENUM (
    'IN_PROGRESS',
    'COMPLETED',
    'FAILED'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PLACED',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
);


--
-- Name: OutboxStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OutboxStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'PROCESSED',
    'PUBLISHED',
    'FAILED'
);


--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'PREPAID',
    'COD'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id uuid NOT NULL,
    cart_id uuid NOT NULL,
    product_id uuid NOT NULL,
    seller_id uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: idempotency_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.idempotency_records (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    idempotency_key character varying(255) NOT NULL,
    request_hash character varying(64) NOT NULL,
    status public."IdempotencyStatus" DEFAULT 'IN_PROGRESS'::public."IdempotencyStatus" NOT NULL,
    order_id uuid,
    response_payload jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at timestamp with time zone
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    seller_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    quantity integer NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    image_url character varying(500),
    status public."OrderStatus" DEFAULT 'PLACED'::public."OrderStatus" NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: order_outbox; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_outbox (
    id uuid NOT NULL,
    event_type character varying(100) NOT NULL,
    aggregate_type character varying(50) DEFAULT 'Order'::character varying NOT NULL,
    aggregate_id uuid NOT NULL,
    payload jsonb NOT NULL,
    status public."OutboxStatus" DEFAULT 'PENDING'::public."OutboxStatus" NOT NULL,
    retry_count integer DEFAULT 0 NOT NULL,
    max_retries integer DEFAULT 5 NOT NULL,
    next_retry_at timestamp with time zone,
    locked_at timestamp with time zone,
    locked_by character varying(100),
    last_error text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_at timestamp with time zone
);


--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_status_history (
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    from_status public."OrderStatus",
    to_status public."OrderStatus" NOT NULL,
    changed_by uuid NOT NULL,
    actor_role character varying(20) NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    order_number character varying(50) NOT NULL,
    user_id uuid NOT NULL,
    status public."OrderStatus" DEFAULT 'PLACED'::public."OrderStatus" NOT NULL,
    payment_method public."PaymentMethod" NOT NULL,
    payment_id uuid,
    shipping_address jsonb NOT NULL,
    pricing_snapshot jsonb NOT NULL,
    coupon_code character varying(50),
    discount_amount numeric(12,2) DEFAULT 0.00 NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    customer_notes text,
    cancellation_reason text,
    cancelled_at timestamp with time zone,
    cancelled_by uuid,
    courier_name character varying(100),
    tracking_number character varying(100),
    shipped_at timestamp with time zone,
    dispatched_by uuid,
    delivery_agent_name character varying(100),
    delivery_agent_phone character varying(30),
    delivered_at timestamp with time zone,
    pod_metadata jsonb,
    delivery_attempts integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: processed_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.processed_events (
    id uuid NOT NULL,
    event_id character varying(255) NOT NULL,
    consumer_group character varying(100) NOT NULL,
    event_type character varying(100) NOT NULL,
    processed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, cart_id, product_id, seller_id, quantity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: idempotency_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.idempotency_records (id, user_id, idempotency_key, request_hash, status, order_id, response_payload, created_at, completed_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, seller_id, title, unit_price, quantity, subtotal, image_url, status, created_at, updated_at) FROM stdin;
77777777-7777-7777-7777-777777777777	66666666-6666-6666-6666-666666666666	22222222-2222-2222-2222-222222222222	33333333-3333-3333-3333-333333333333	Pro Headphones	99.99	1	99.99	\N	CONFIRMED	2026-09-06 14:13:47.40747+00	2026-09-06 14:13:47.40747+00
\.


--
-- Data for Name: order_outbox; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_outbox (id, event_type, aggregate_type, aggregate_id, payload, status, retry_count, max_retries, next_retry_at, locked_at, locked_by, last_error, created_at, processed_at) FROM stdin;
efdbf081-e4d9-4631-be1a-f4c02f221a08	order.placed	Order	cf987a8a-f72c-4571-a088-87d16cdf2165	{"userId": "e1bab08d-c745-415e-b9a2-83925f30eec1", "orderId": "cf987a8a-f72c-4571-a088-87d16cdf2165", "orderNumber": "ORD-HEALTHY-1788702119621", "totalAmount": "115.00", "shippingAddress": {"email": "healthy@example.com", "phone": "+919876543210", "fullName": "Healthy Customer"}}	PROCESSED	0	5	\N	\N	\N	\N	2026-09-06 13:41:59.599+00	2026-09-06 13:42:01.159+00
f4a175b0-b41c-4542-9cd3-af0696464db9	order.placed	Order	d9f7f917-b428-4a9c-833f-e3350ac04ad0	{"userId": "2fe16c15-ebe4-43a3-bd19-3d8ba0a7abce", "orderId": "d9f7f917-b428-4a9c-833f-e3350ac04ad0", "orderNumber": "ORD-OUTAGE-1788702126900", "totalAmount": "275.00", "shippingAddress": {"email": "outage@example.com", "phone": "+919876543211", "fullName": "Outage Customer"}}	PROCESSED	0	5	2026-09-06 13:43:55.903736+00	\N	\N	\N	2026-09-06 13:42:06.9+00	2026-09-06 13:42:36.292+00
fd85176f-5bec-4ddf-b617-9b853813def1	order.placed	Order	9920036c-6861-47b8-97c0-5d835647803c	{"userId": "c8f476c3-463a-4ce7-9e72-684415bfce50", "orderId": "9920036c-6861-47b8-97c0-5d835647803c", "orderNumber": "ORD-HEALTHY-1788702320008", "totalAmount": "115.00", "shippingAddress": {"email": "healthy@example.com", "phone": "+919876543210", "fullName": "Healthy Customer"}}	PROCESSED	0	5	\N	\N	\N	\N	2026-09-06 13:45:20.003+00	2026-09-06 13:45:20.883+00
1f63cf6c-0e25-49ff-98e7-cf098517cd72	order.placed	Order	dc9ec4ac-bec4-46a9-902d-6a422745919c	{"userId": "a6b30d7e-c3ec-4678-bdbc-9178b06ed249", "orderId": "dc9ec4ac-bec4-46a9-902d-6a422745919c", "orderNumber": "ORD-OUTAGE-1788702327920", "totalAmount": "275.00", "shippingAddress": {"email": "outage@example.com", "phone": "+919876543211", "fullName": "Outage Customer"}}	PROCESSED	0	5	2026-09-06 13:47:04.072237+00	\N	\N	\N	2026-09-06 13:45:27.92+00	2026-09-06 13:45:50.072+00
6bceded3-86d7-4316-bed4-c5341f8d30bf	order.placed	Order	b46a1500-fa18-400c-805a-fd457e59323d	{"orderId": "b46a1500-fa18-400c-805a-fd457e59323d", "totalAmount": "120.00"}	PROCESSED	0	5	\N	\N	\N	\N	2026-09-07 16:21:10.334+00	2026-09-07 16:21:10.85+00
331d9331-a841-46f5-9507-4b9b7e804b8d	order.placed	Order	af49282e-8de4-47f7-89a7-7377a4679c45	{"orderId": "af49282e-8de4-47f7-89a7-7377a4679c45", "totalAmount": "350.00"}	PROCESSED	2	5	\N	\N	\N	Event "331d9331-a841-46f5-9507-4b9b7e804b8d" (order.placed) is missing required userId	2026-09-07 16:21:13.056+00	2026-09-07 16:21:46.64+00
1068df34-c83f-47a8-b942-a9db779c4a9b	order.placed	Order	d99bcf4a-1b90-4bb8-8539-5ed5f33e3c07	{"orderId": "d99bcf4a-1b90-4bb8-8539-5ed5f33e3c07"}	PROCESSED	0	5	\N	\N	\N	\N	2026-09-07 16:22:42.557+00	2026-09-07 16:22:43.239+00
\.


--
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_status_history (id, order_id, from_status, to_status, changed_by, actor_role, reason, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, order_number, user_id, status, payment_method, payment_id, shipping_address, pricing_snapshot, coupon_code, discount_amount, total_amount, customer_notes, cancellation_reason, cancelled_at, cancelled_by, courier_name, tracking_number, shipped_at, dispatched_by, delivery_agent_name, delivery_agent_phone, delivered_at, pod_metadata, delivery_attempts, created_at, updated_at) FROM stdin;
9920036c-6861-47b8-97c0-5d835647803c	ORD-HEALTHY-1788702320008	c8f476c3-463a-4ce7-9e72-684415bfce50	PLACED	PREPAID	\N	{"city": "Bengaluru"}	{"subtotal": 100}	\N	0.00	115.00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-09-06 13:45:20.003+00	2026-09-06 13:45:20.003+00
dc9ec4ac-bec4-46a9-902d-6a422745919c	ORD-OUTAGE-1788702327920	a6b30d7e-c3ec-4678-bdbc-9178b06ed249	PLACED	PREPAID	\N	{"city": "Mumbai"}	{"subtotal": 250}	\N	0.00	275.00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-09-06 13:45:27.92+00	2026-09-06 13:45:27.92+00
66666666-6666-6666-6666-666666666666	ORD-BENCH-001	55555555-5555-5555-5555-555555555555	CONFIRMED	PREPAID	\N	{"city": "New York", "country": "USA"}	{"subtotal": 99.99}	\N	0.00	99.99	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-09-06 14:13:47.395941+00	2026-09-06 14:13:47.395941+00
b46a1500-fa18-400c-805a-fd457e59323d	ORD-CHAOS-H-1788798070335	5008e677-7ba8-489e-a97d-efa6bd197ae9	PLACED	PREPAID	\N	{"city": "Bengaluru"}	{"subtotal": 100}	\N	0.00	120.00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-09-07 16:21:10.334+00	2026-09-07 16:21:10.334+00
af49282e-8de4-47f7-89a7-7377a4679c45	ORD-CHAOS-O-1788798073056	98e34cd4-5d75-43e5-b213-188f87e8ce00	PLACED	PREPAID	\N	{"city": "Delhi"}	{"subtotal": 300}	\N	0.00	350.00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-09-07 16:21:13.056+00	2026-09-07 16:21:13.056+00
\.


--
-- Data for Name: processed_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.processed_events (id, event_id, consumer_group, event_type, processed_at) FROM stdin;
\.


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: idempotency_records idempotency_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.idempotency_records
    ADD CONSTRAINT idempotency_records_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_outbox order_outbox_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_outbox
    ADD CONSTRAINT order_outbox_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: processed_events processed_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processed_events
    ADD CONSTRAINT processed_events_pkey PRIMARY KEY (id);


--
-- Name: cart_items_cart_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cart_items_cart_id_idx ON public.cart_items USING btree (cart_id);


--
-- Name: cart_items_cart_id_product_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX cart_items_cart_id_product_id_key ON public.cart_items USING btree (cart_id, product_id);


--
-- Name: cart_items_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cart_items_product_id_idx ON public.cart_items USING btree (product_id);


--
-- Name: carts_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX carts_user_id_idx ON public.carts USING btree (user_id);


--
-- Name: carts_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX carts_user_id_key ON public.carts USING btree (user_id);


--
-- Name: idempotency_records_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idempotency_records_status_idx ON public.idempotency_records USING btree (status);


--
-- Name: idempotency_records_user_id_idempotency_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idempotency_records_user_id_idempotency_key_key ON public.idempotency_records USING btree (user_id, idempotency_key);


--
-- Name: idempotency_records_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idempotency_records_user_id_idx ON public.idempotency_records USING btree (user_id);


--
-- Name: order_items_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_items_order_id_idx ON public.order_items USING btree (order_id);


--
-- Name: order_items_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_items_product_id_idx ON public.order_items USING btree (product_id);


--
-- Name: order_items_seller_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_items_seller_id_idx ON public.order_items USING btree (seller_id);


--
-- Name: order_outbox_status_next_retry_at_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_outbox_status_next_retry_at_created_at_idx ON public.order_outbox USING btree (status, next_retry_at, created_at);


--
-- Name: order_status_history_changed_by_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_status_history_changed_by_created_at_idx ON public.order_status_history USING btree (changed_by, created_at);


--
-- Name: order_status_history_order_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_status_history_order_id_created_at_idx ON public.order_status_history USING btree (order_id, created_at);


--
-- Name: order_status_history_order_id_to_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_status_history_order_id_to_status_idx ON public.order_status_history USING btree (order_id, to_status);


--
-- Name: orders_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_created_at_idx ON public.orders USING btree (created_at);


--
-- Name: orders_order_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number);


--
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


--
-- Name: orders_tracking_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_tracking_number_idx ON public.orders USING btree (tracking_number);


--
-- Name: orders_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_user_id_idx ON public.orders USING btree (user_id);


--
-- Name: processed_events_consumer_group_event_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX processed_events_consumer_group_event_id_key ON public.processed_events USING btree (consumer_group, event_id);


--
-- Name: processed_events_consumer_group_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX processed_events_consumer_group_idx ON public.processed_events USING btree (consumer_group);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_status_history order_status_history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict H6ezD6znJzp97lTrjkbxFUR746cw1WcBDafb8VMV7kXP9CEWcRcG7woNEDC7mla

