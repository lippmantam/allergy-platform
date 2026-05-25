-- CreateTable
CREATE TABLE "place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "cuisine_type" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "hours" TEXT,
    "allergen_aware" TEXT NOT NULL DEFAULT 'unknown',
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "added_by_contributor_id" TEXT NOT NULL,
    "last_verified" TIMESTAMP(3),
    "verification_method" TEXT,
    "verified_by_contributor_id" TEXT,
    "community_confirmations" INTEGER NOT NULL DEFAULT 0,
    "completeness_score" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_allergen" (
    "id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "allergen_code" TEXT NOT NULL,
    "accommodation_level" TEXT NOT NULL DEFAULT 'aware',
    "dedicated_kitchen" BOOLEAN NOT NULL DEFAULT false,
    "shared_fryer_risk" BOOLEAN NOT NULL DEFAULT false,
    "staff_training_level" TEXT NOT NULL DEFAULT 'none',
    "confidence_level" TEXT,
    "notes" TEXT,

    CONSTRAINT "place_allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contributor" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "allergen_profile" TEXT[],
    "contribution_count" INTEGER NOT NULL DEFAULT 0,
    "helpful_votes" INTEGER NOT NULL DEFAULT 0,
    "trust_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "verified_parent" BOOLEAN NOT NULL DEFAULT false,
    "member_since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "structured_report" (
    "id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "contributor_id" TEXT NOT NULL,
    "allergens_confirmed" TEXT[],
    "reaction_status" TEXT NOT NULL,
    "verification_method" TEXT NOT NULL,
    "visit_date" TIMESTAMP(3) NOT NULL,
    "party_type" TEXT NOT NULL,
    "severity_level" TEXT NOT NULL,
    "language_used" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "structured_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "narrative_review" (
    "id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "contributor_id" TEXT NOT NULL,
    "experience_text" TEXT NOT NULL,
    "safety_rating" INTEGER NOT NULL,
    "tips" TEXT,
    "photo_urls" TEXT[],
    "cuisine_context" TEXT,
    "would_return" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "narrative_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_signal" (
    "id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "contributor_id" TEXT NOT NULL,
    "signal_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trust_signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispute" (
    "id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "raised_by" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "place_allergen_place_id_allergen_code_key" ON "place_allergen"("place_id", "allergen_code");

-- AddForeignKey
ALTER TABLE "place" ADD CONSTRAINT "place_added_by_contributor_id_fkey" FOREIGN KEY ("added_by_contributor_id") REFERENCES "contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_allergen" ADD CONSTRAINT "place_allergen_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "structured_report" ADD CONSTRAINT "structured_report_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "structured_report" ADD CONSTRAINT "structured_report_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "narrative_review" ADD CONSTRAINT "narrative_review_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "narrative_review" ADD CONSTRAINT "narrative_review_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_signal" ADD CONSTRAINT "trust_signal_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispute" ADD CONSTRAINT "dispute_raised_by_fkey" FOREIGN KEY ("raised_by") REFERENCES "contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
