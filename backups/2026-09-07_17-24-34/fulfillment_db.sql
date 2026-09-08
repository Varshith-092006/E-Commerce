--
-- PostgreSQL database dump
--

\restrict QclZyEmKdravhgY3dNu9b9PcufMiiN8K1Wruh2LppSXMResq9kBCNdtnZRd52Qr

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

ALTER TABLE IF EXISTS ONLY public.tracking_updates DROP CONSTRAINT IF EXISTS tracking_updates_shipment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.shipments DROP CONSTRAINT IF EXISTS shipments_warehouse_id_fkey;
ALTER TABLE IF EXISTS ONLY public.shipment_items DROP CONSTRAINT IF EXISTS shipment_items_shipment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.return_tracking_updates DROP CONSTRAINT IF EXISTS return_tracking_updates_return_pickup_id_fkey;
ALTER TABLE IF EXISTS ONLY public.return_pickups DROP CONSTRAINT IF EXISTS return_pickups_warehouse_id_fkey;
ALTER TABLE IF EXISTS ONLY public.return_items DROP CONSTRAINT IF EXISTS return_items_return_pickup_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reservation_items DROP CONSTRAINT IF EXISTS reservation_items_reservation_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reservation_items DROP CONSTRAINT IF EXISTS reservation_items_inventory_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.inventory_items DROP CONSTRAINT IF EXISTS inventory_items_warehouse_id_fkey;
DROP INDEX IF EXISTS public.warehouses_postal_code_idx;
DROP INDEX IF EXISTS public.warehouses_is_active_idx;
DROP INDEX IF EXISTS public.warehouses_code_key;
DROP INDEX IF EXISTS public.warehouses_code_idx;
DROP INDEX IF EXISTS public.tracking_updates_shipment_id_recorded_at_idx;
DROP INDEX IF EXISTS public.shipments_warehouse_id_idx;
DROP INDEX IF EXISTS public.shipments_user_id_idx;
DROP INDEX IF EXISTS public.shipments_tracking_number_key;
DROP INDEX IF EXISTS public.shipments_tracking_number_idx;
DROP INDEX IF EXISTS public.shipments_status_idx;
DROP INDEX IF EXISTS public.shipments_shipment_number_key;
DROP INDEX IF EXISTS public.shipments_reservation_id_idx;
DROP INDEX IF EXISTS public.shipments_order_id_idx;
DROP INDEX IF EXISTS public.shipments_created_at_idx;
DROP INDEX IF EXISTS public.shipment_items_sku_idx;
DROP INDEX IF EXISTS public.shipment_items_shipment_id_idx;
DROP INDEX IF EXISTS public.shipment_items_seller_id_idx;
DROP INDEX IF EXISTS public.shipment_items_product_id_idx;
DROP INDEX IF EXISTS public.return_tracking_updates_return_pickup_id_recorded_at_idx;
DROP INDEX IF EXISTS public.return_pickups_warehouse_id_idx;
DROP INDEX IF EXISTS public.return_pickups_user_id_idx;
DROP INDEX IF EXISTS public.return_pickups_status_idx;
DROP INDEX IF EXISTS public.return_pickups_return_tracking_number_key;
DROP INDEX IF EXISTS public.return_pickups_return_tracking_number_idx;
DROP INDEX IF EXISTS public.return_pickups_return_number_key;
DROP INDEX IF EXISTS public.return_pickups_order_id_idx;
DROP INDEX IF EXISTS public.return_pickups_created_at_idx;
DROP INDEX IF EXISTS public.return_items_sku_idx;
DROP INDEX IF EXISTS public.return_items_seller_id_idx;
DROP INDEX IF EXISTS public.return_items_return_pickup_id_idx;
DROP INDEX IF EXISTS public.return_items_product_id_idx;
DROP INDEX IF EXISTS public.reservation_items_sku_idx;
DROP INDEX IF EXISTS public.reservation_items_reservation_id_inventory_item_id_key;
DROP INDEX IF EXISTS public.reservation_items_reservation_id_idx;
DROP INDEX IF EXISTS public.reservation_items_product_id_idx;
DROP INDEX IF EXISTS public.reservation_items_inventory_item_id_idx;
DROP INDEX IF EXISTS public.processed_events_consumer_group_idx;
DROP INDEX IF EXISTS public.processed_events_consumer_group_event_id_key;
DROP INDEX IF EXISTS public.inventory_reservations_user_id_idx;
DROP INDEX IF EXISTS public.inventory_reservations_status_expires_at_idx;
DROP INDEX IF EXISTS public.inventory_reservations_reservation_key_key;
DROP INDEX IF EXISTS public.inventory_reservations_order_id_idx;
DROP INDEX IF EXISTS public.inventory_reservations_created_at_idx;
DROP INDEX IF EXISTS public.inventory_items_warehouse_id_sku_key;
DROP INDEX IF EXISTS public.inventory_items_warehouse_id_idx;
DROP INDEX IF EXISTS public.inventory_items_sku_idx;
DROP INDEX IF EXISTS public.inventory_items_seller_id_idx;
DROP INDEX IF EXISTS public.inventory_items_product_id_idx;
DROP INDEX IF EXISTS public.inventory_items_is_active_idx;
DROP INDEX IF EXISTS public.fulfillment_outbox_status_next_retry_at_created_at_idx;
ALTER TABLE IF EXISTS ONLY public.warehouses DROP CONSTRAINT IF EXISTS warehouses_pkey;
ALTER TABLE IF EXISTS ONLY public.tracking_updates DROP CONSTRAINT IF EXISTS tracking_updates_pkey;
ALTER TABLE IF EXISTS ONLY public.shipments DROP CONSTRAINT IF EXISTS shipments_pkey;
ALTER TABLE IF EXISTS ONLY public.shipment_items DROP CONSTRAINT IF EXISTS shipment_items_pkey;
ALTER TABLE IF EXISTS ONLY public.return_tracking_updates DROP CONSTRAINT IF EXISTS return_tracking_updates_pkey;
ALTER TABLE IF EXISTS ONLY public.return_pickups DROP CONSTRAINT IF EXISTS return_pickups_pkey;
ALTER TABLE IF EXISTS ONLY public.return_items DROP CONSTRAINT IF EXISTS return_items_pkey;
ALTER TABLE IF EXISTS ONLY public.reservation_items DROP CONSTRAINT IF EXISTS reservation_items_pkey;
ALTER TABLE IF EXISTS ONLY public.processed_events DROP CONSTRAINT IF EXISTS processed_events_pkey;
ALTER TABLE IF EXISTS ONLY public.inventory_reservations DROP CONSTRAINT IF EXISTS inventory_reservations_pkey;
ALTER TABLE IF EXISTS ONLY public.inventory_items DROP CONSTRAINT IF EXISTS inventory_items_pkey;
ALTER TABLE IF EXISTS ONLY public.fulfillment_outbox DROP CONSTRAINT IF EXISTS fulfillment_outbox_pkey;
DROP TABLE IF EXISTS public.warehouses;
DROP TABLE IF EXISTS public.tracking_updates;
DROP TABLE IF EXISTS public.shipments;
DROP TABLE IF EXISTS public.shipment_items;
DROP TABLE IF EXISTS public.return_tracking_updates;
DROP TABLE IF EXISTS public.return_pickups;
DROP TABLE IF EXISTS public.return_items;
DROP TABLE IF EXISTS public.reservation_items;
DROP TABLE IF EXISTS public.processed_events;
DROP TABLE IF EXISTS public.inventory_reservations;
DROP TABLE IF EXISTS public.inventory_items;
DROP TABLE IF EXISTS public.fulfillment_outbox;
DROP TYPE IF EXISTS public."ShipmentStatus";
DROP TYPE IF EXISTS public."ReturnPickupStatus";
DROP TYPE IF EXISTS public."ReservationStatus";
DROP TYPE IF EXISTS public."OutboxStatus";
DROP TYPE IF EXISTS public."InspectionGrade";
DROP TYPE IF EXISTS public."CourierCode";
--
-- Name: CourierCode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CourierCode" AS ENUM (
    'DELHIVERY',
    'BLUEDART',
    'SHIPROCKET',
    'EKART',
    'INTERNAL_FLEET'
);


--
-- Name: InspectionGrade; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InspectionGrade" AS ENUM (
    'PASS',
    'DAMAGED',
    'DEFECTIVE',
    'WRONG_ITEM',
    'MISSING_ACCESSORIES'
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
-- Name: ReservationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ReservationStatus" AS ENUM (
    'HELD',
    'COMMITTED',
    'RELEASED',
    'EXPIRED'
);


--
-- Name: ReturnPickupStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ReturnPickupStatus" AS ENUM (
    'REQUESTED',
    'PICKUP_SCHEDULED',
    'OUT_FOR_PICKUP',
    'PICKED_UP',
    'IN_TRANSIT',
    'RECEIVED_AT_WAREHOUSE',
    'INSPECTED',
    'COMPLETED',
    'REJECTED',
    'CANCELLED'
);


--
-- Name: ShipmentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ShipmentStatus" AS ENUM (
    'ALLOCATED',
    'PACKED',
    'DISPATCHED',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'FAILED_DELIVERY',
    'RETURNED_TO_ORIGIN',
    'CANCELLED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: fulfillment_outbox; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fulfillment_outbox (
    id uuid NOT NULL,
    event_type character varying(100) NOT NULL,
    aggregate_type character varying(50) DEFAULT 'Inventory'::character varying NOT NULL,
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
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory_items (
    id uuid NOT NULL,
    product_id uuid NOT NULL,
    sku character varying(100) NOT NULL,
    seller_id uuid,
    warehouse_id uuid NOT NULL,
    quantity_on_hand integer DEFAULT 0 NOT NULL,
    quantity_reserved integer DEFAULT 0 NOT NULL,
    quantity_allocated integer DEFAULT 0 NOT NULL,
    safety_stock integer DEFAULT 0 NOT NULL,
    reorder_threshold integer DEFAULT 10 NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: inventory_reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory_reservations (
    id uuid NOT NULL,
    reservation_key character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid,
    status public."ReservationStatus" DEFAULT 'HELD'::public."ReservationStatus" NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    committed_at timestamp with time zone,
    released_at timestamp with time zone,
    expired_at timestamp with time zone,
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
-- Name: reservation_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservation_items (
    id uuid NOT NULL,
    reservation_id uuid NOT NULL,
    inventory_item_id uuid NOT NULL,
    product_id uuid NOT NULL,
    sku character varying(100) NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: return_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.return_items (
    id uuid NOT NULL,
    return_pickup_id uuid NOT NULL,
    product_id uuid NOT NULL,
    sku character varying(100) NOT NULL,
    seller_id uuid,
    quantity integer NOT NULL,
    reason character varying(255) NOT NULL,
    inspection_grade public."InspectionGrade",
    inspection_notes text,
    is_restocked boolean DEFAULT false NOT NULL,
    restocked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: return_pickups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.return_pickups (
    id uuid NOT NULL,
    return_number character varying(50) NOT NULL,
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    status public."ReturnPickupStatus" DEFAULT 'REQUESTED'::public."ReturnPickupStatus" NOT NULL,
    courier_code public."CourierCode" DEFAULT 'INTERNAL_FLEET'::public."CourierCode" NOT NULL,
    return_tracking_number character varying(100),
    pickup_address jsonb NOT NULL,
    scheduled_pickup_date timestamp with time zone,
    picked_up_at timestamp with time zone,
    received_at timestamp with time zone,
    completed_at timestamp with time zone,
    pop_signature character varying(500),
    pop_received_by character varying(100),
    cancellation_reason text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: return_tracking_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.return_tracking_updates (
    id uuid NOT NULL,
    return_pickup_id uuid NOT NULL,
    status public."ReturnPickupStatus" NOT NULL,
    location character varying(100),
    description character varying(255) NOT NULL,
    recorded_by uuid,
    recorded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: shipment_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipment_items (
    id uuid NOT NULL,
    shipment_id uuid NOT NULL,
    product_id uuid NOT NULL,
    sku character varying(100) NOT NULL,
    seller_id uuid,
    quantity integer NOT NULL,
    unit_price numeric(12,2),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: shipments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipments (
    id uuid NOT NULL,
    shipment_number character varying(50) NOT NULL,
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    reservation_id uuid,
    status public."ShipmentStatus" DEFAULT 'ALLOCATED'::public."ShipmentStatus" NOT NULL,
    courier_code public."CourierCode" DEFAULT 'INTERNAL_FLEET'::public."CourierCode" NOT NULL,
    tracking_number character varying(100),
    shipping_address jsonb NOT NULL,
    label_url character varying(500),
    manifest_id character varying(100),
    estimated_delivery timestamp with time zone,
    dispatched_at timestamp with time zone,
    delivered_at timestamp with time zone,
    delivery_notes text,
    pod_signature character varying(500),
    pod_received_by character varying(100),
    pod_received_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: tracking_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tracking_updates (
    id uuid NOT NULL,
    shipment_id uuid NOT NULL,
    status public."ShipmentStatus" NOT NULL,
    location character varying(100),
    description character varying(255) NOT NULL,
    recorded_by uuid,
    recorded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.warehouses (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    address_line1 character varying(255) NOT NULL,
    address_line2 character varying(255),
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    postal_code character varying(20) NOT NULL,
    country character varying(50) DEFAULT 'IN'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Data for Name: fulfillment_outbox; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fulfillment_outbox (id, event_type, aggregate_type, aggregate_id, payload, status, retry_count, max_retries, next_retry_at, locked_at, locked_by, last_error, created_at, processed_at) FROM stdin;
\.


--
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_items (id, product_id, sku, seller_id, warehouse_id, quantity_on_hand, quantity_reserved, quantity_allocated, safety_stock, reorder_threshold, version, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inventory_reservations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_reservations (id, reservation_key, user_id, order_id, status, expires_at, committed_at, released_at, expired_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: processed_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.processed_events (id, event_id, consumer_group, event_type, processed_at) FROM stdin;
\.


--
-- Data for Name: reservation_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reservation_items (id, reservation_id, inventory_item_id, product_id, sku, quantity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: return_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.return_items (id, return_pickup_id, product_id, sku, seller_id, quantity, reason, inspection_grade, inspection_notes, is_restocked, restocked_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: return_pickups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.return_pickups (id, return_number, order_id, user_id, warehouse_id, status, courier_code, return_tracking_number, pickup_address, scheduled_pickup_date, picked_up_at, received_at, completed_at, pop_signature, pop_received_by, cancellation_reason, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: return_tracking_updates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.return_tracking_updates (id, return_pickup_id, status, location, description, recorded_by, recorded_at) FROM stdin;
\.


--
-- Data for Name: shipment_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipment_items (id, shipment_id, product_id, sku, seller_id, quantity, unit_price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: shipments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipments (id, shipment_number, order_id, user_id, warehouse_id, reservation_id, status, courier_code, tracking_number, shipping_address, label_url, manifest_id, estimated_delivery, dispatched_at, delivered_at, delivery_notes, pod_signature, pod_received_by, pod_received_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tracking_updates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tracking_updates (id, shipment_id, status, location, description, recorded_by, recorded_at) FROM stdin;
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.warehouses (id, code, name, address_line1, address_line2, city, state, postal_code, country, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Name: fulfillment_outbox fulfillment_outbox_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_outbox
    ADD CONSTRAINT fulfillment_outbox_pkey PRIMARY KEY (id);


--
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_reservations inventory_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_reservations
    ADD CONSTRAINT inventory_reservations_pkey PRIMARY KEY (id);


--
-- Name: processed_events processed_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processed_events
    ADD CONSTRAINT processed_events_pkey PRIMARY KEY (id);


--
-- Name: reservation_items reservation_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservation_items
    ADD CONSTRAINT reservation_items_pkey PRIMARY KEY (id);


--
-- Name: return_items return_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_pkey PRIMARY KEY (id);


--
-- Name: return_pickups return_pickups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_pickups
    ADD CONSTRAINT return_pickups_pkey PRIMARY KEY (id);


--
-- Name: return_tracking_updates return_tracking_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_tracking_updates
    ADD CONSTRAINT return_tracking_updates_pkey PRIMARY KEY (id);


--
-- Name: shipment_items shipment_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_items
    ADD CONSTRAINT shipment_items_pkey PRIMARY KEY (id);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- Name: tracking_updates tracking_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tracking_updates
    ADD CONSTRAINT tracking_updates_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_outbox_status_next_retry_at_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fulfillment_outbox_status_next_retry_at_created_at_idx ON public.fulfillment_outbox USING btree (status, next_retry_at, created_at);


--
-- Name: inventory_items_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inventory_items_is_active_idx ON public.inventory_items USING btree (is_active);


--
-- Name: inventory_items_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inventory_items_product_id_idx ON public.inventory_items USING btree (product_id);


--
-- Name: inventory_items_seller_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inventory_items_seller_id_idx ON public.inventory_items USING btree (seller_id);


--
-- Name: inventory_items_sku_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inventory_items_sku_idx ON public.inventory_items USING btree (sku);


--
-- Name: inventory_items_warehouse_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inventory_items_warehouse_id_idx ON public.inventory_items USING btree (warehouse_id);


--
-- Name: inventory_items_warehouse_id_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX inventory_items_warehouse_id_sku_key ON public.inventory_items USING btree (warehouse_id, sku);


--
-- Name: inventory_reservations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inventory_reservations_created_at_idx ON public.inventory_reservations USING btree (created_at);


--
-- Name: inventory_reservations_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inventory_reservations_order_id_idx ON public.inventory_reservations USING btree (order_id);


--
-- Name: inventory_reservations_reservation_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX inventory_reservations_reservation_key_key ON public.inventory_reservations USING btree (reservation_key);


--
-- Name: inventory_reservations_status_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inventory_reservations_status_expires_at_idx ON public.inventory_reservations USING btree (status, expires_at);


--
-- Name: inventory_reservations_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inventory_reservations_user_id_idx ON public.inventory_reservations USING btree (user_id);


--
-- Name: processed_events_consumer_group_event_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX processed_events_consumer_group_event_id_key ON public.processed_events USING btree (consumer_group, event_id);


--
-- Name: processed_events_consumer_group_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX processed_events_consumer_group_idx ON public.processed_events USING btree (consumer_group);


--
-- Name: reservation_items_inventory_item_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reservation_items_inventory_item_id_idx ON public.reservation_items USING btree (inventory_item_id);


--
-- Name: reservation_items_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reservation_items_product_id_idx ON public.reservation_items USING btree (product_id);


--
-- Name: reservation_items_reservation_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reservation_items_reservation_id_idx ON public.reservation_items USING btree (reservation_id);


--
-- Name: reservation_items_reservation_id_inventory_item_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX reservation_items_reservation_id_inventory_item_id_key ON public.reservation_items USING btree (reservation_id, inventory_item_id);


--
-- Name: reservation_items_sku_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reservation_items_sku_idx ON public.reservation_items USING btree (sku);


--
-- Name: return_items_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_items_product_id_idx ON public.return_items USING btree (product_id);


--
-- Name: return_items_return_pickup_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_items_return_pickup_id_idx ON public.return_items USING btree (return_pickup_id);


--
-- Name: return_items_seller_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_items_seller_id_idx ON public.return_items USING btree (seller_id);


--
-- Name: return_items_sku_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_items_sku_idx ON public.return_items USING btree (sku);


--
-- Name: return_pickups_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_pickups_created_at_idx ON public.return_pickups USING btree (created_at);


--
-- Name: return_pickups_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_pickups_order_id_idx ON public.return_pickups USING btree (order_id);


--
-- Name: return_pickups_return_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX return_pickups_return_number_key ON public.return_pickups USING btree (return_number);


--
-- Name: return_pickups_return_tracking_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_pickups_return_tracking_number_idx ON public.return_pickups USING btree (return_tracking_number);


--
-- Name: return_pickups_return_tracking_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX return_pickups_return_tracking_number_key ON public.return_pickups USING btree (return_tracking_number);


--
-- Name: return_pickups_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_pickups_status_idx ON public.return_pickups USING btree (status);


--
-- Name: return_pickups_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_pickups_user_id_idx ON public.return_pickups USING btree (user_id);


--
-- Name: return_pickups_warehouse_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_pickups_warehouse_id_idx ON public.return_pickups USING btree (warehouse_id);


--
-- Name: return_tracking_updates_return_pickup_id_recorded_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX return_tracking_updates_return_pickup_id_recorded_at_idx ON public.return_tracking_updates USING btree (return_pickup_id, recorded_at);


--
-- Name: shipment_items_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipment_items_product_id_idx ON public.shipment_items USING btree (product_id);


--
-- Name: shipment_items_seller_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipment_items_seller_id_idx ON public.shipment_items USING btree (seller_id);


--
-- Name: shipment_items_shipment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipment_items_shipment_id_idx ON public.shipment_items USING btree (shipment_id);


--
-- Name: shipment_items_sku_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipment_items_sku_idx ON public.shipment_items USING btree (sku);


--
-- Name: shipments_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_created_at_idx ON public.shipments USING btree (created_at);


--
-- Name: shipments_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_order_id_idx ON public.shipments USING btree (order_id);


--
-- Name: shipments_reservation_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_reservation_id_idx ON public.shipments USING btree (reservation_id);


--
-- Name: shipments_shipment_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shipments_shipment_number_key ON public.shipments USING btree (shipment_number);


--
-- Name: shipments_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_status_idx ON public.shipments USING btree (status);


--
-- Name: shipments_tracking_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_tracking_number_idx ON public.shipments USING btree (tracking_number);


--
-- Name: shipments_tracking_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shipments_tracking_number_key ON public.shipments USING btree (tracking_number);


--
-- Name: shipments_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_user_id_idx ON public.shipments USING btree (user_id);


--
-- Name: shipments_warehouse_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX shipments_warehouse_id_idx ON public.shipments USING btree (warehouse_id);


--
-- Name: tracking_updates_shipment_id_recorded_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tracking_updates_shipment_id_recorded_at_idx ON public.tracking_updates USING btree (shipment_id, recorded_at);


--
-- Name: warehouses_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX warehouses_code_idx ON public.warehouses USING btree (code);


--
-- Name: warehouses_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX warehouses_code_key ON public.warehouses USING btree (code);


--
-- Name: warehouses_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX warehouses_is_active_idx ON public.warehouses USING btree (is_active);


--
-- Name: warehouses_postal_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX warehouses_postal_code_idx ON public.warehouses USING btree (postal_code);


--
-- Name: inventory_items inventory_items_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reservation_items reservation_items_inventory_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservation_items
    ADD CONSTRAINT reservation_items_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reservation_items reservation_items_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservation_items
    ADD CONSTRAINT reservation_items_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.inventory_reservations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: return_items return_items_return_pickup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_return_pickup_id_fkey FOREIGN KEY (return_pickup_id) REFERENCES public.return_pickups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: return_pickups return_pickups_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_pickups
    ADD CONSTRAINT return_pickups_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: return_tracking_updates return_tracking_updates_return_pickup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_tracking_updates
    ADD CONSTRAINT return_tracking_updates_return_pickup_id_fkey FOREIGN KEY (return_pickup_id) REFERENCES public.return_pickups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipment_items shipment_items_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_items
    ADD CONSTRAINT shipment_items_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipments shipments_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tracking_updates tracking_updates_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tracking_updates
    ADD CONSTRAINT tracking_updates_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict QclZyEmKdravhgY3dNu9b9PcufMiiN8K1Wruh2LppSXMResq9kBCNdtnZRd52Qr

