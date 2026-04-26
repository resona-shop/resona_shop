import { getUserAddresses } from "@/actions/orders";
import { AddAddressForm } from "./address-form";
import { AccountAddressesContent } from "@/components/auth/account-addresses";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Addresses",
};

export default async function AddressesPage() {
  const addresses = await getUserAddresses();

  return (
    <AccountAddressesContent
      addresses={addresses}
      addForm={<AddAddressForm />}
    />
  );
}
