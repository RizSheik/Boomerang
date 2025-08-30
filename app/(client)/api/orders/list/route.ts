import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }

  try {
    const orders = await backendClient.fetch(
      `*[_type == 'order' && userId == $userId] | order(orderDate desc){
        ...,products[]{...,product->}
      }`,
      { userId: uid }
    );
    return NextResponse.json({ orders: orders ?? [] });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}


