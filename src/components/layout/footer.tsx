import { getContentOverrides } from "@/lib/site-settings";
import { FooterClient } from "./footer-client";

export async function Footer() {
  const content = await getContentOverrides();
  return <FooterClient content={content} />;
}
