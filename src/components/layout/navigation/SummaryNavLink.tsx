"use client";

import {
  FORM_STORAGE_KEY,
  SELECTED_DEPARTURE_KEY,
  SELECTED_RETURN_DEPARTURE_KEY,
} from "@/constants/storage";
import Link from "next/link";
import { useEffect, useState } from "react";

type SummaryNavLinkProps = {
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
};

type StoredForm = {
  from?: string;
  to?: string;
  date?: string;
  returnDate?: string;
  tripType?: "roundtrip" | "oneway";
  passengers?: {
    adult?: number;
    child?: number;
    animal?: number;
  };
  vehicles?: {
    car?: number;
    camper?: number;
    motorcycle?: number;
    bicycle?: number;
  };
};

function buildSummaryHref(
  form: StoredForm,
  departureId: string | null,
  returnDepartureId: string | null
): string {
  const params = new URLSearchParams({
    from: form.from ?? "Bergen",
    to: form.to ?? "Stavanger",
    date: form.date ?? "",
    tripType: form.tripType ?? "roundtrip",
    adult: String(form.passengers?.adult ?? 1),
    child: String(form.passengers?.child ?? 0),
    animal: String(form.passengers?.animal ?? 0),
    car: String(form.vehicles?.car ?? 0),
    camper: String(form.vehicles?.camper ?? 0),
    motorcycle: String(form.vehicles?.motorcycle ?? 0),
    bicycle: String(form.vehicles?.bicycle ?? 0),
  });

  if ((form.tripType ?? "roundtrip") === "roundtrip") {
    params.set("returnDate", form.returnDate ?? "");
  }

  if (departureId) {
    params.set("departureId", departureId);
  }

  if (returnDepartureId) {
    params.set("returnDepartureId", returnDepartureId);
  }

  return `/summary?${params.toString()}`;
}

export default function SummaryNavLink({
  className,
  onClick,
  children,
}: SummaryNavLinkProps) {
  const [href, setHref] = useState("/summary");

  useEffect(() => {
    const raw = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as StoredForm;
      const departureId = sessionStorage.getItem(SELECTED_DEPARTURE_KEY);
      const returnDepartureId = sessionStorage.getItem(
        SELECTED_RETURN_DEPARTURE_KEY
      );
      setHref(
        buildSummaryHref(parsed, departureId, returnDepartureId)
      );
    } catch {
      setHref("/summary");
    }
  }, []);

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
