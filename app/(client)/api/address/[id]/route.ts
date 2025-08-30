import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, email, address, city, state, zip, isDefault } = body || {};
    const patch = backendClient.patch(params.id).set({
      name,
      email,
      address,
      city,
      state,
      zip,
      default: !!isDefault,
    });
    const result = await patch.commit();
    return NextResponse.json({ ok: true, address: result });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}


