import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { renderToStream } from "@react-pdf/renderer";
import { RemittancePDF } from "@/components/pdf/RemittancePDF";
import { formatMonthYear } from "@/lib/formatters";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const runId = searchParams.get("runId");

  if (!runId) {
    return new NextResponse("Run ID required", { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Fetch Run and confirm ownership
  const { data: run, error: runError } = await supabase
    .from("payroll_runs")
    .select("*, businesses(name, tin, state, user_id)")
    .eq("id", runId)
    .single();

  if (runError || !run || run.businesses.user_id !== user.id) {
    return new NextResponse("Not Found / Unauthorized", { status: 404 });
  }

  const { data: items } = await supabase
    .from("payroll_line_items")
    .select("*")
    .eq("run_id", runId)
    .order("employee_name", { ascending: true });

  if (!items) {
    return new NextResponse("Error fetching line items", { status: 500 });
  }

  const periodStr = formatMonthYear(run.month, run.year);
  const pdfStream = await renderToStream(
    <RemittancePDF 
      businessName={run.businesses.name}
      tin={run.businesses.tin || ""}
      state={run.businesses.state}
      period={periodStr}
      lineItems={items}
      totalPaye={Number(run.total_paye)}
    />
  );

  return new NextResponse(pdfStream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="PAYE_Remittance_${periodStr.replace(" ", "_")}.pdf"`,
    },
  });
}
