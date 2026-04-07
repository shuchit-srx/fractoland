import { setStoredReferralCode, trackReferralClick } from "@/lib/referralsApi";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Persists ?ref= code and records a click for agent referral analytics. */
export function ReferralCapture() {
  const location = useLocation();
  const lastRef = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref")?.trim();
    if (!ref) return;
    if (lastRef.current === ref) return;
    lastRef.current = ref;
    setStoredReferralCode(ref);
    trackReferralClick(ref).catch(() => {});
  }, [location.search]);

  return null;
}
