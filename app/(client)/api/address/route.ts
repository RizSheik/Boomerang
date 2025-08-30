import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, address, city, state, zip, isDefault } = body || {};
    if (!name || !address || !city || !state || !zip) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const doc = await backendClient.create({
      _type: "address",
      name,
      email,
      address,
      city,
      state,
      zip,
      default: !!isDefault,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, address: doc });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}


