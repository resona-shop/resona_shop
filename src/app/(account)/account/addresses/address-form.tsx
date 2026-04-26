"use client";

import { useState } from "react";
import { addAddress } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { COUNTRIES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddAddressForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await addAddress(formData);
    setLoading(false);
    if (result.success) {
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" required className="bg-background" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" className="bg-background" />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="line1">Address Line 1</Label>
        <Input id="line1" name="line1" required className="bg-background" />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="line2">Address Line 2</Label>
        <Input id="line2" name="line2" className="bg-background" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" required className="bg-background" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State / Province</Label>
        <Input id="state" name="state" className="bg-background" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="postal_code">Postal Code</Label>
        <Input id="postal_code" name="postal_code" required className="bg-background" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <select
          id="country"
          name="country"
          defaultValue="SG"
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2 flex items-center gap-2">
        <Checkbox id="is_default" name="is_default" />
        <Label htmlFor="is_default" className="text-sm font-normal">
          Set as default address
        </Label>
      </div>
      <div className="sm:col-span-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-golden text-white hover:opacity-90"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Address
        </Button>
      </div>
    </form>
  );
}
