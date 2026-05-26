-- Add unique constraint: one signal per contributor per target
ALTER TABLE "trust_signal" ADD CONSTRAINT "trust_signal_contributor_id_target_id_key" UNIQUE ("contributor_id", "target_id");
