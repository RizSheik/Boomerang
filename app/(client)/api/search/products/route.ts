import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ results: [] });

  const query = `*[_type == 'product' && name match $q] | order(name asc)[0...10]{
    _id, name, slug, price, images
  }`;
  const params = { q: `${q}*` };

  const results = await client.fetch(query, params, { next: { revalidate: 0 } });
  return NextResponse.json({ results });
}


