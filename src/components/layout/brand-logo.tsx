import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/resona-logo.png"
      alt="Resona"
      width={1693}
      height={562}
      priority={priority}
      className={cn("h-8 w-auto object-contain", className)}
    />
  );
}
