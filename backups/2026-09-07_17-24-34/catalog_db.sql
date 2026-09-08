--
-- PostgreSQL database dump
--

\restrict buGmysFvbHCek9kdcHY7cM0LoikCKOVKZpGvza11SY6EMPiNPlbJOIIbah3nBMb

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

ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_wishlist_id_fkey;
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.coupon_redemptions DROP CONSTRAINT IF EXISTS coupon_redemptions_coupon_id_fkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
DROP INDEX IF EXISTS public.wishlists_user_id_key;
DROP INDEX IF EXISTS public.wishlists_user_id_idx;
DROP INDEX IF EXISTS public.wishlist_items_wishlist_id_product_id_key;
DROP INDEX IF EXISTS public.wishlist_items_wishlist_id_idx;
DROP INDEX IF EXISTS public.wishlist_items_product_id_idx;
DROP INDEX IF EXISTS public.reviews_user_id_idx;
DROP INDEX IF EXISTS public.reviews_rating_idx;
DROP INDEX IF EXISTS public.reviews_product_id_user_id_key;
DROP INDEX IF EXISTS public.reviews_product_id_idx;
DROP INDEX IF EXISTS public.products_status_idx;
DROP INDEX IF EXISTS public.products_slug_key;
DROP INDEX IF EXISTS public.products_sku_key;
DROP INDEX IF EXISTS public.products_seller_id_idx;
DROP INDEX IF EXISTS public.products_category_id_idx;
DROP INDEX IF EXISTS public.products_brand_idx;
DROP INDEX IF EXISTS public.product_images_product_id_idx;
DROP INDEX IF EXISTS public.processed_events_consumer_group_idx;
DROP INDEX IF EXISTS public.processed_events_consumer_group_event_id_key;
DROP INDEX IF EXISTS public.coupons_is_active_idx;
DROP INDEX IF EXISTS public.coupons_code_key;
DROP INDEX IF EXISTS public.coupons_code_idx;
DROP INDEX IF EXISTS public.coupon_redemptions_user_id_idx;
DROP INDEX IF EXISTS public.coupon_redemptions_coupon_id_order_id_key;
DROP INDEX IF EXISTS public.coupon_redemptions_coupon_id_idx;
DROP INDEX IF EXISTS public.categories_slug_key;
DROP INDEX IF EXISTS public.categories_parent_id_idx;
DROP INDEX IF EXISTS public.catalog_outbox_status_next_retry_at_created_at_idx;
ALTER TABLE IF EXISTS ONLY public.wishlists DROP CONSTRAINT IF EXISTS wishlists_pkey;
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_pkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS product_images_pkey;
ALTER TABLE IF EXISTS ONLY public.processed_events DROP CONSTRAINT IF EXISTS processed_events_pkey;
ALTER TABLE IF EXISTS ONLY public.coupons DROP CONSTRAINT IF EXISTS coupons_pkey;
ALTER TABLE IF EXISTS ONLY public.coupon_redemptions DROP CONSTRAINT IF EXISTS coupon_redemptions_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.catalog_outbox DROP CONSTRAINT IF EXISTS catalog_outbox_pkey;
DROP TABLE IF EXISTS public.wishlists;
DROP TABLE IF EXISTS public.wishlist_items;
DROP TABLE IF EXISTS public.reviews;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.product_images;
DROP TABLE IF EXISTS public.processed_events;
DROP TABLE IF EXISTS public.coupons;
DROP TABLE IF EXISTS public.coupon_redemptions;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.catalog_outbox;
DROP TYPE IF EXISTS public."ProductStatus";
DROP TYPE IF EXISTS public."OutboxStatus";
DROP TYPE IF EXISTS public."DiscountType";
--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENTAGE',
    'FIXED_AMOUNT'
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
-- Name: ProductStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProductStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: catalog_outbox; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_outbox (
    id uuid NOT NULL,
    event_type character varying(100) NOT NULL,
    aggregate_type character varying(50) DEFAULT 'ProductReview'::character varying NOT NULL,
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
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    slug character varying(150) NOT NULL,
    description text,
    parent_id uuid,
    image_url character varying(500),
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: coupon_redemptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupon_redemptions (
    id uuid NOT NULL,
    coupon_id uuid NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid,
    discount_amount numeric(12,2) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons (
    id uuid NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    discount_type public."DiscountType" NOT NULL,
    discount_value numeric(12,2) NOT NULL,
    max_discount_cap numeric(12,2),
    min_order_amount numeric(12,2) DEFAULT 0.00 NOT NULL,
    usage_limit integer,
    current_usage integer DEFAULT 0 NOT NULL,
    per_user_limit integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    valid_from timestamp with time zone NOT NULL,
    valid_until timestamp with time zone NOT NULL,
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
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id uuid NOT NULL,
    product_id uuid NOT NULL,
    url character varying(500) NOT NULL,
    public_id character varying(255) NOT NULL,
    alt_text character varying(255),
    display_order integer DEFAULT 0 NOT NULL,
    is_thumbnail boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid NOT NULL,
    seller_id uuid NOT NULL,
    category_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text NOT NULL,
    brand character varying(150) NOT NULL,
    sku character varying(100) NOT NULL,
    price numeric(12,2) NOT NULL,
    compare_at_price numeric(12,2),
    status public."ProductStatus" DEFAULT 'DRAFT'::public."ProductStatus" NOT NULL,
    is_available boolean DEFAULT true NOT NULL,
    attributes jsonb DEFAULT '{}'::jsonb NOT NULL,
    average_rating numeric(3,2) DEFAULT 0.00 NOT NULL,
    total_reviews integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id uuid NOT NULL,
    product_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating integer NOT NULL,
    title character varying(255),
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlist_items (
    id uuid NOT NULL,
    wishlist_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlists (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Data for Name: catalog_outbox; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_outbox (id, event_type, aggregate_type, aggregate_id, payload, status, retry_count, max_retries, next_retry_at, locked_at, locked_by, last_error, created_at, processed_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, description, parent_id, image_url, is_active, display_order, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	Electronics	electronics	Electronic devices	\N	\N	t	0	2026-09-06 14:11:40.851325+00	2026-09-06 14:11:40.851325+00
\.


--
-- Data for Name: coupon_redemptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupon_redemptions (id, coupon_id, user_id, order_id, discount_amount, created_at) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupons (id, code, description, discount_type, discount_value, max_discount_cap, min_order_amount, usage_limit, current_usage, per_user_limit, is_active, valid_from, valid_until, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: processed_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.processed_events (id, event_id, consumer_group, event_type, processed_at) FROM stdin;
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, url, public_id, alt_text, display_order, is_thumbnail, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, seller_id, category_id, title, slug, description, brand, sku, price, compare_at_price, status, is_available, attributes, average_rating, total_reviews, created_at, updated_at) FROM stdin;
22222222-2222-2222-2222-222222222222	33333333-3333-3333-3333-333333333333	11111111-1111-1111-1111-111111111111	Pro Headphones	pro-headphones	High fidelity audio headphones	SoundMaster	HEADPHONE-001	99.99	\N	PUBLISHED	t	{}	5.00	1	2026-09-06 14:13:46.841858+00	2026-09-06 14:13:46.841858+00
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, product_id, user_id, rating, title, comment, created_at, updated_at) FROM stdin;
44444444-4444-4444-4444-444444444444	22222222-2222-2222-2222-222222222222	55555555-5555-5555-5555-555555555555	5	\N	Amazing sound quality!	2026-09-06 14:13:47.032477+00	2026-09-06 14:13:47.032477+00
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlist_items (id, wishlist_id, product_id, created_at) FROM stdin;
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlists (id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: catalog_outbox catalog_outbox_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_outbox
    ADD CONSTRAINT catalog_outbox_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: coupon_redemptions coupon_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: processed_events processed_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processed_events
    ADD CONSTRAINT processed_events_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: catalog_outbox_status_next_retry_at_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalog_outbox_status_next_retry_at_created_at_idx ON public.catalog_outbox USING btree (status, next_retry_at, created_at);


--
-- Name: categories_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_parent_id_idx ON public.categories USING btree (parent_id);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: coupon_redemptions_coupon_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coupon_redemptions_coupon_id_idx ON public.coupon_redemptions USING btree (coupon_id);


--
-- Name: coupon_redemptions_coupon_id_order_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX coupon_redemptions_coupon_id_order_id_key ON public.coupon_redemptions USING btree (coupon_id, order_id);


--
-- Name: coupon_redemptions_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coupon_redemptions_user_id_idx ON public.coupon_redemptions USING btree (user_id);


--
-- Name: coupons_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coupons_code_idx ON public.coupons USING btree (code);


--
-- Name: coupons_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX coupons_code_key ON public.coupons USING btree (code);


--
-- Name: coupons_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coupons_is_active_idx ON public.coupons USING btree (is_active);


--
-- Name: processed_events_consumer_group_event_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX processed_events_consumer_group_event_id_key ON public.processed_events USING btree (consumer_group, event_id);


--
-- Name: processed_events_consumer_group_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX processed_events_consumer_group_idx ON public.processed_events USING btree (consumer_group);


--
-- Name: product_images_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX product_images_product_id_idx ON public.product_images USING btree (product_id);


--
-- Name: products_brand_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_brand_idx ON public.products USING btree (brand);


--
-- Name: products_category_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_category_id_idx ON public.products USING btree (category_id);


--
-- Name: products_seller_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_seller_id_idx ON public.products USING btree (seller_id);


--
-- Name: products_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku);


--
-- Name: products_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);


--
-- Name: products_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_status_idx ON public.products USING btree (status);


--
-- Name: reviews_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reviews_product_id_idx ON public.reviews USING btree (product_id);


--
-- Name: reviews_product_id_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX reviews_product_id_user_id_key ON public.reviews USING btree (product_id, user_id);


--
-- Name: reviews_rating_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reviews_rating_idx ON public.reviews USING btree (rating);


--
-- Name: reviews_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX reviews_user_id_idx ON public.reviews USING btree (user_id);


--
-- Name: wishlist_items_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wishlist_items_product_id_idx ON public.wishlist_items USING btree (product_id);


--
-- Name: wishlist_items_wishlist_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wishlist_items_wishlist_id_idx ON public.wishlist_items USING btree (wishlist_id);


--
-- Name: wishlist_items_wishlist_id_product_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX wishlist_items_wishlist_id_product_id_key ON public.wishlist_items USING btree (wishlist_id, product_id);


--
-- Name: wishlists_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wishlists_user_id_idx ON public.wishlists USING btree (user_id);


--
-- Name: wishlists_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX wishlists_user_id_key ON public.wishlists USING btree (user_id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: coupon_redemptions coupon_redemptions_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: wishlist_items wishlist_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: wishlist_items wishlist_items_wishlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_wishlist_id_fkey FOREIGN KEY (wishlist_id) REFERENCES public.wishlists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict buGmysFvbHCek9kdcHY7cM0LoikCKOVKZpGvza11SY6EMPiNPlbJOIIbah3nBMb

