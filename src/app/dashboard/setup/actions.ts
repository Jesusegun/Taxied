"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { businessSchema } from "@/lib/schemas";

export async function setupBusiness(
  prevState: { error: string | null; success: boolean },
  formData: FormData
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in", success: false };
  }

  // Guard: prevent duplicate business creation
  const { data: existingBusiness } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingBusiness) {
    return { error: "A business profile already exists for this account.", success: false };
  }

  const rawData = {
    name: formData.get("name"),
    state: formData.get("state"),
    tin: formData.get("tin") || null,
  };

  const parsed = businessSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const { error } = await supabase.from("businesses").insert({
    user_id: user.id,
    name: parsed.data.name,
    state: parsed.data.state,
    tin: parsed.data.tin,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard", "layout");
  return { error: null, success: true };
}
