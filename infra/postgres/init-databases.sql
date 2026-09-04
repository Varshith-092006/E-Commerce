-- Phase 0: Database Initialization Script
-- Creates distinct databases for each service according to the Database-Per-Service architecture pattern

CREATE DATABASE identity_db;
CREATE DATABASE catalog_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE fulfillment_db;
CREATE DATABASE notification_db;

-- Grant all privileges to postgres user on all databases
GRANT ALL PRIVILEGES ON DATABASE identity_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE catalog_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE order_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE fulfillment_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO postgres;
