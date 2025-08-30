"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export type AddressPayload = {
  name: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
};

export default function AddressForm({
  initial,
  submitPath = "/api/address",
  method = "POST",
  title = "Add New Address",
}: {
  initial?: Partial<AddressPayload>;
  submitPath?: string;
  method?: "POST" | "PUT";
  title?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<AddressPayload>({
    name: initial?.name || "",
    email: initial?.email || "",
    address: initial?.address || "",
    city: initial?.city || "",
    state: initial?.state || "",
    zip: initial?.zip || "",
    isDefault: initial?.isDefault || false,
  });
  const [loading, setLoading] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(submitPath, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json) throw new Error(json?.error || "Save failed");
      router.push("/cart");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input name="name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input name="email" type="email" value={form.email} onChange={onChange} />
          </div>
          <div>
            <label className="text-sm font-medium">Street Address</label>
            <Input name="address" value={form.address} onChange={onChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">City</label>
              <Input name="city" value={form.city} onChange={onChange} required />
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <Input name="state" value={form.state} onChange={onChange} required maxLength={2} />
            </div>
            <div>
              <label className="text-sm font-medium">ZIP</label>
              <Input name="zip" value={form.zip} onChange={onChange} required />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isDefault" checked={!!form.isDefault} onChange={onChange} />
            <span className="text-sm">Set as default</span>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Address"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


