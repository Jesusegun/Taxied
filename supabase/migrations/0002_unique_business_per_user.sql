-- Prevent duplicate business creation per user
-- Ensures .single() queries never crash from multiple rows
CREATE UNIQUE INDEX IF NOT EXISTS businesses_user_id_unique ON public.businesses(user_id);
