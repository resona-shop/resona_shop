"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AuthUser {
  fullName: string;
  email: string;
  initials: string;
  isAdmin: boolean;
}

function toInitials(name: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials || "U";
}

// The header sits in the shared shop layout. Resolving the session on the
// client (instead of reading cookies during render) is what lets storefront
// routes be prerendered. Auth changes always navigate, so resolving once on
// mount is enough.
export function useAuthState() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function resolve() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;

      const sessionUser = session?.user;
      if (!sessionUser) {
        setUser(null);
        setReady(true);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", sessionUser.id)
        .single();
      if (cancelled) return;

      const metadataName = sessionUser.user_metadata?.full_name;
      const fullName =
        (profile?.full_name as string | null) ||
        (typeof metadataName === "string" ? metadataName : "") ||
        "User";

      setUser({
        fullName,
        email: sessionUser.email || "",
        initials: toInitials(fullName),
        isAdmin: profile?.role === "admin",
      });
      setReady(true);
    }

    void resolve();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, ready };
}