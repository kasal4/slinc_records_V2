import { exportMyData } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET() {
  const payload = await exportMyData();
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": "attachment; filename=slinc-gdpr-export.json",
    },
  });
}
