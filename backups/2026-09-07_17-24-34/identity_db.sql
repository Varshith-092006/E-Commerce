--
-- PostgreSQL database dump
--

\restrict ZY7ag3xnyQ6nLk7EWis2sYnCIYUcKBfcSQH8j1ZLFNkhbrcUGqJGq6jN3r9BHtr

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

ALTER TABLE IF EXISTS ONLY public.verification_tokens DROP CONSTRAINT IF EXISTS verification_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sellers DROP CONSTRAINT IF EXISTS sellers_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
DROP INDEX IF EXISTS public.verification_tokens_user_id_idx;
DROP INDEX IF EXISTS public.verification_tokens_token_hash_idx;
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.sellers_user_id_key;
DROP INDEX IF EXISTS public.sellers_store_slug_key;
DROP INDEX IF EXISTS public.refresh_tokens_user_id_idx;
DROP INDEX IF EXISTS public.refresh_tokens_token_hash_key;
DROP INDEX IF EXISTS public.refresh_tokens_token_hash_idx;
DROP INDEX IF EXISTS public.audit_logs_trace_id_idx;
DROP INDEX IF EXISTS public.audit_logs_service_created_at_idx;
DROP INDEX IF EXISTS public.audit_logs_request_id_idx;
DROP INDEX IF EXISTS public.audit_logs_event_type_created_at_idx;
DROP INDEX IF EXISTS public.audit_logs_created_at_idx;
DROP INDEX IF EXISTS public.audit_logs_actor_id_created_at_idx;
DROP INDEX IF EXISTS public.addresses_user_id_idx;
ALTER TABLE IF EXISTS ONLY public.verification_tokens DROP CONSTRAINT IF EXISTS verification_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.sellers DROP CONSTRAINT IF EXISTS sellers_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS addresses_pkey;
DROP TABLE IF EXISTS public.verification_tokens;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.sellers;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.addresses;
DROP TYPE IF EXISTS public."TokenType";
DROP TYPE IF EXISTS public."SellerStatus";
DROP TYPE IF EXISTS public."Role";
--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'CUSTOMER',
    'SELLER',
    'ADMIN',
    'COURIER',
    'LOGISTICS'
);


--
-- Name: SellerStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SellerStatus" AS ENUM (
    'PENDING',
    'ACTIVE',
    'SUSPENDED',
    'REJECTED'
);


--
-- Name: TokenType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TokenType" AS ENUM (
    'EMAIL_VERIFY',
    'PASSWORD_RESET'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    full_name character varying(150) NOT NULL,
    phone character varying(20) NOT NULL,
    street_address text NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    postal_code character varying(20) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    actor_id uuid,
    actor_role character varying(20) NOT NULL,
    actor_email character varying(255),
    service character varying(50) NOT NULL,
    event_type character varying(100) NOT NULL,
    resource_type character varying(50),
    resource_id character varying(100),
    trace_id character varying(100),
    request_id character varying(100),
    metadata jsonb,
    ip_address character varying(45),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    is_revoked boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: sellers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sellers (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    business_name character varying(255) NOT NULL,
    store_slug character varying(255) NOT NULL,
    gstin character varying(50),
    pan character varying(50),
    business_address text,
    status public."SellerStatus" DEFAULT 'PENDING'::public."SellerStatus" NOT NULL,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    role public."Role" DEFAULT 'CUSTOMER'::public."Role" NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_hash character varying(255) NOT NULL,
    type public."TokenType" NOT NULL,
    attempt_count integer DEFAULT 0 NOT NULL,
    resend_count integer DEFAULT 0 NOT NULL,
    last_sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.addresses (id, user_id, full_name, phone, street_address, city, state, postal_code, country, is_default, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, actor_id, actor_role, actor_email, service, event_type, resource_type, resource_id, trace_id, request_id, metadata, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refresh_tokens (id, user_id, token_hash, expires_at, is_revoked, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sellers (id, user_id, business_name, store_slug, gstin, pan, business_address, status, rejection_reason, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, phone, password_hash, first_name, last_name, role, is_verified, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verification_tokens (id, user_id, token_hash, type, attempt_count, resend_count, last_sent_at, expires_at, used_at, created_at) FROM stdin;
\.


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: sellers sellers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification_tokens verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: addresses_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX addresses_user_id_idx ON public.addresses USING btree (user_id);


--
-- Name: audit_logs_actor_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_actor_id_created_at_idx ON public.audit_logs USING btree (actor_id, created_at DESC);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at DESC);


--
-- Name: audit_logs_event_type_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_event_type_created_at_idx ON public.audit_logs USING btree (event_type, created_at DESC);


--
-- Name: audit_logs_request_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_request_id_idx ON public.audit_logs USING btree (request_id);


--
-- Name: audit_logs_service_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_service_created_at_idx ON public.audit_logs USING btree (service, created_at DESC);


--
-- Name: audit_logs_trace_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_trace_id_idx ON public.audit_logs USING btree (trace_id);


--
-- Name: refresh_tokens_token_hash_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX refresh_tokens_token_hash_idx ON public.refresh_tokens USING btree (token_hash);


--
-- Name: refresh_tokens_token_hash_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX refresh_tokens_token_hash_key ON public.refresh_tokens USING btree (token_hash);


--
-- Name: refresh_tokens_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX refresh_tokens_user_id_idx ON public.refresh_tokens USING btree (user_id);


--
-- Name: sellers_store_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sellers_store_slug_key ON public.sellers USING btree (store_slug);


--
-- Name: sellers_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sellers_user_id_key ON public.sellers USING btree (user_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: verification_tokens_token_hash_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX verification_tokens_token_hash_idx ON public.verification_tokens USING btree (token_hash);


--
-- Name: verification_tokens_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX verification_tokens_user_id_idx ON public.verification_tokens USING btree (user_id);


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sellers sellers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: verification_tokens verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ZY7ag3xnyQ6nLk7EWis2sYnCIYUcKBfcSQH8j1ZLFNkhbrcUGqJGq6jN3r9BHtr

