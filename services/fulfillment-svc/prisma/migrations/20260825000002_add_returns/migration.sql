-- CreateEnum
CREATE TYPE "ReturnPickupStatus" AS ENUM ('REQUESTED', 'PICKUP_SCHEDULED', 'OUT_FOR_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'RECEIVED_AT_WAREHOUSE', 'INSPECTED', 'COMPLETED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InspectionGrade" AS ENUM ('PASS', 'DAMAGED', 'DEFECTIVE', 'WRONG_ITEM', 'MISSING_ACCESSORIES');

-- CreateTable
CREATE TABLE "return_pickups" (
    "id" UUID NOT NULL,
    "return_number" VARCHAR(50) NOT NULL,
    "order_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "status" "ReturnPickupStatus" NOT NULL DEFAULT 'REQUESTED',
    "courier_code" "CourierCode" NOT NULL DEFAULT 'INTERNAL_FLEET',
    "return_tracking_number" VARCHAR(100),
    "pickup_address" JSONB NOT NULL,
    "scheduled_pickup_date" TIMESTAMPTZ,
    "picked_up_at" TIMESTAMPTZ,
    "received_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "pop_signature" VARCHAR(500),
    "pop_received_by" VARCHAR(100),
    "cancellation_reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "return_pickups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_items" (
    "id" UUID NOT NULL,
    "return_pickup_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "seller_id" UUID,
    "quantity" INTEGER NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "inspection_grade" "InspectionGrade",
    "inspection_notes" TEXT,
    "is_restocked" BOOLEAN NOT NULL DEFAULT false,
    "restocked_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_tracking_updates" (
    "id" UUID NOT NULL,
    "return_pickup_id" UUID NOT NULL,
    "status" "ReturnPickupStatus" NOT NULL,
    "location" VARCHAR(100),
    "description" VARCHAR(255) NOT NULL,
    "recorded_by" UUID,
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "return_tracking_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "return_pickups_return_number_key" ON "return_pickups"("return_number");
CREATE UNIQUE INDEX "return_pickups_return_tracking_number_key" ON "return_pickups"("return_tracking_number");
CREATE INDEX "return_pickups_order_id_idx" ON "return_pickups"("order_id");
CREATE INDEX "return_pickups_user_id_idx" ON "return_pickups"("user_id");
CREATE INDEX "return_pickups_warehouse_id_idx" ON "return_pickups"("warehouse_id");
CREATE INDEX "return_pickups_status_idx" ON "return_pickups"("status");
CREATE INDEX "return_pickups_return_tracking_number_idx" ON "return_pickups"("return_tracking_number");
CREATE INDEX "return_pickups_created_at_idx" ON "return_pickups"("created_at");

-- CreateIndex
CREATE INDEX "return_items_return_pickup_id_idx" ON "return_items"("return_pickup_id");
CREATE INDEX "return_items_product_id_idx" ON "return_items"("product_id");
CREATE INDEX "return_items_sku_idx" ON "return_items"("sku");
CREATE INDEX "return_items_seller_id_idx" ON "return_items"("seller_id");

-- CreateIndex
CREATE INDEX "return_tracking_updates_return_pickup_id_recorded_at_idx" ON "return_tracking_updates"("return_pickup_id", "recorded_at");

-- AddForeignKey
ALTER TABLE "return_pickups" ADD CONSTRAINT "return_pickups_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_return_pickup_id_fkey" FOREIGN KEY ("return_pickup_id") REFERENCES "return_pickups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_tracking_updates" ADD CONSTRAINT "return_tracking_updates_return_pickup_id_fkey" FOREIGN KEY ("return_pickup_id") REFERENCES "return_pickups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
