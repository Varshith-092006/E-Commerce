--
-- PostgreSQL database dump
--

\restrict S4tzoy8INsnnvzufR1uolJa4m2ywK1nUdiCa1cOKbndsKitMs7NXaBgXt66BfaX

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

ALTER TABLE IF EXISTS ONLY public.payment_refunds DROP CONSTRAINT IF EXISTS payment_refunds_payment_id_fkey;
DROP INDEX IF EXISTS public.payments_user_id_idx;
DROP INDEX IF EXISTS public.payments_status_idx;
DROP INDEX IF EXISTS public.payments_razorpay_payment_id_key;
DROP INDEX IF EXISTS public.payments_razorpay_order_id_key;
DROP INDEX IF EXISTS public.payments_razorpay_order_id_idx;
DROP INDEX IF EXISTS public.payments_order_id_idx;
DROP INDEX IF EXISTS public.payment_refunds_status_idx;
DROP INDEX IF EXISTS public.payment_refunds_razorpay_refund_id_key;
DROP INDEX IF EXISTS public.payment_refunds_payment_id_order_id_key;
DROP INDEX IF EXISTS public.payment_refunds_payment_id_idx;
DROP INDEX IF EXISTS public.payment_processed_events_consumer_group_idx;
DROP INDEX IF EXISTS public.payment_processed_events_consumer_group_event_id_key;
DROP INDEX IF EXISTS public.payment_outbox_status_next_retry_at_created_at_idx;
ALTER TABLE IF EXISTS ONLY public.payments DROP CONSTRAINT IF EXISTS payments_pkey;
ALTER TABLE IF EXISTS ONLY public.payment_refunds DROP CONSTRAINT IF EXISTS payment_refunds_pkey;
ALTER TABLE IF EXISTS ONLY public.payment_processed_events DROP CONSTRAINT IF EXISTS payment_processed_events_pkey;
ALTER TABLE IF EXISTS ONLY public.payment_outbox DROP CONSTRAINT IF EXISTS payment_outbox_pkey;
DROP TABLE IF EXISTS public.payments;
DROP TABLE IF EXISTS public.payment_refunds;
DROP TABLE IF EXISTS public.payment_processed_events;
DROP TABLE IF EXISTS public.payment_outbox;
DROP TYPE IF EXISTS public."RefundStatus";
DROP TYPE IF EXISTS public."PaymentStatus";
DROP TYPE IF EXISTS public."PaymentMethodType";
DROP TYPE IF EXISTS public."OutboxStatus";
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
-- Name: PaymentMethodType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentMethodType" AS ENUM (
    'RAZORPAY',
    'COD'
);


--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'INITIATED',
    'AUTHORIZED',
    'CAPTURED',
    'FAILED',
    'REFUNDED',
    'COD_PENDING',
    'COD_COLLECTED'
);


--
-- Name: RefundStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RefundStatus" AS ENUM (
    'REQUESTED',
    'PROCESSING',
    'PROCESSED',
    'FAILED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: payment_outbox; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_outbox (
    id uuid NOT NULL,
    event_type character varying(100) NOT NULL,
    aggregate_type character varying(50) DEFAULT 'Payment'::character varying NOT NULL,
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
-- Name: payment_processed_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_processed_events (
    id uuid NOT NULL,
    event_id character varying(255) NOT NULL,
    consumer_group character varying(100) NOT NULL,
    event_type character varying(100) NOT NULL,
    processed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: payment_refunds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_refunds (
    id uuid NOT NULL,
    payment_id uuid NOT NULL,
    order_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(10) DEFAULT 'INR'::character varying NOT NULL,
    razorpay_refund_id character varying(100),
    reason text,
    status public."RefundStatus" DEFAULT 'REQUESTED'::public."RefundStatus" NOT NULL,
    failure_reason text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid,
    payment_method public."PaymentMethodType" DEFAULT 'RAZORPAY'::public."PaymentMethodType" NOT NULL,
    status public."PaymentStatus" DEFAULT 'INITIATED'::public."PaymentStatus" NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency character varying(10) DEFAULT 'INR'::character varying NOT NULL,
    razorpay_order_id character varying(100),
    razorpay_payment_id character varying(100),
    razorpay_signature character varying(255),
    failure_reason text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Data for Name: payment_outbox; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_outbox (id, event_type, aggregate_type, aggregate_id, payload, status, retry_count, max_retries, next_retry_at, locked_at, locked_by, last_error, created_at, processed_at) FROM stdin;
\.


--
-- Data for Name: payment_processed_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_processed_events (id, event_id, consumer_group, event_type, processed_at) FROM stdin;
\.


--
-- Data for Name: payment_refunds; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_refunds (id, payment_id, order_id, amount, currency, razorpay_refund_id, reason, status, failure_reason, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, user_id, order_id, payment_method, status, amount, currency, razorpay_order_id, razorpay_payment_id, razorpay_signature, failure_reason, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Name: payment_outbox payment_outbox_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_outbox
    ADD CONSTRAINT payment_outbox_pkey PRIMARY KEY (id);


--
-- Name: payment_processed_events payment_processed_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_processed_events
    ADD CONSTRAINT payment_processed_events_pkey PRIMARY KEY (id);


--
-- Name: payment_refunds payment_refunds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_refunds
    ADD CONSTRAINT payment_refunds_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payment_outbox_status_next_retry_at_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payment_outbox_status_next_retry_at_created_at_idx ON public.payment_outbox USING btree (status, next_retry_at, created_at);


--
-- Name: payment_processed_events_consumer_group_event_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payment_processed_events_consumer_group_event_id_key ON public.payment_processed_events USING btree (consumer_group, event_id);


--
-- Name: payment_processed_events_consumer_group_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payment_processed_events_consumer_group_idx ON public.payment_processed_events USING btree (consumer_group);


--
-- Name: payment_refunds_payment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payment_refunds_payment_id_idx ON public.payment_refunds USING btree (payment_id);


--
-- Name: payment_refunds_payment_id_order_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payment_refunds_payment_id_order_id_key ON public.payment_refunds USING btree (payment_id, order_id);


--
-- Name: payment_refunds_razorpay_refund_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payment_refunds_razorpay_refund_id_key ON public.payment_refunds USING btree (razorpay_refund_id);


--
-- Name: payment_refunds_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payment_refunds_status_idx ON public.payment_refunds USING btree (status);


--
-- Name: payments_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_order_id_idx ON public.payments USING btree (order_id);


--
-- Name: payments_razorpay_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_razorpay_order_id_idx ON public.payments USING btree (razorpay_order_id);


--
-- Name: payments_razorpay_order_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payments_razorpay_order_id_key ON public.payments USING btree (razorpay_order_id);


--
-- Name: payments_razorpay_payment_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payments_razorpay_payment_id_key ON public.payments USING btree (razorpay_payment_id);


--
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- Name: payments_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_user_id_idx ON public.payments USING btree (user_id);


--
-- Name: payment_refunds payment_refunds_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_refunds
    ADD CONSTRAINT payment_refunds_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict S4tzoy8INsnnvzufR1uolJa4m2ywK1nUdiCa1cOKbndsKitMs7NXaBgXt66BfaX

