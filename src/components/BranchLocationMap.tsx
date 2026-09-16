"use client";

import { useMemo, useState } from "react";
import { ConsentControlledMap } from "@/components/ConsentControlledMap";

export type BranchLocation = {
  country: string;
  city: string;
  address: string;
  addressLines?: [string, string];
  phone: string;
  email: string;
  lat: number;
  lng: number;
};

type BranchLocationMapProps = {
  locations: BranchLocation[];
  locale?: "en" | "ja" | "zh";
  companyName?:string;
};

function mapEmbedUrl(location: BranchLocation) {
  const query = encodeURIComponent(`${location.lat},${location.lng}`);
  return `https://www.google.com/maps?q=${query}&z=12&output=embed`;
}

function mapDirectUrl(location: BranchLocation) {
  const query = encodeURIComponent(`${location.lat},${location.lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function BranchLocationMap({ locations, locale="en", companyName }: BranchLocationMapProps) {
  const [activeCountry, setActiveCountry] = useState(locations[0]?.country ?? "");
  const activeLocation =
    locations.find((location) => location.country === activeCountry) ?? locations[0];

  const mapUrl = useMemo(
    () => (activeLocation ? mapEmbedUrl(activeLocation) : ""),
    [activeLocation],
  );

  if (!activeLocation) {
    return null;
  }

  return (
    <div className="section-shell">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="mx-auto max-w-5xl font-serif text-[clamp(2.75rem,4.4vw,4.6rem)] leading-[1.04] text-charcoal">
          {locale === "zh" ? `${companyName??"CAMARI"} · 全球网络` : "Camari’s Global Network"}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          {locale === "zh" ? "联系就近的区域团队，了解材料供应、产品资料和展厅预约。" : "Reach the regional team closest to your project for material availability, catalogs, and showroom appointments."}
        </p>
      </div>

      <div className="mt-14 overflow-hidden border border-charcoal/10 bg-linen shadow-material md:mt-20">
        <div className="grid border-b border-charcoal/10 bg-paper/80 md:grid-cols-4">
          {locations.map((location) => {
            const isActive = location.country === activeLocation.country;

            return (
              <button
                className={[
                  "group flex min-h-24 flex-col items-start justify-center border-charcoal/10 px-5 py-4 text-left transition-colors md:border-r",
                  isActive ? "bg-charcoal text-paper" : "bg-transparent text-charcoal hover:bg-stone",
                ].join(" ")}
                key={location.country}
                onClick={() => setActiveCountry(location.country)}
                type="button"
              >
                <span className={isActive ? "label-caps text-gold" : "label-caps text-muted"}>
                  {location.city}
                </span>
                <span className="mt-2 font-sans text-xl font-semibold uppercase leading-none tracking-normal">
                  {location.country}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative h-[420px] bg-stone md:h-[560px]">
          <ConsentControlledMap
            className="absolute inset-0 h-full w-full"
            directUrl={mapDirectUrl(activeLocation)}
            src={mapUrl}
            title={`${activeLocation.country} branch location`}
          />
          <div className="pointer-events-none absolute inset-0 bg-charcoal/10" />
          <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] bg-paper px-5 py-4 shadow-material md:left-8 md:top-8 md:max-w-sm">
            <p className="label-caps text-gold">{activeLocation.city}</p>
            <p className="mt-2 font-sans text-2xl font-semibold uppercase leading-none tracking-normal text-charcoal">
              {activeLocation.country}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted md:text-base">
              {activeLocation.address}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-charcoal/10 pt-12 md:mt-20 md:pt-16">
        <p className="label-caps text-gold">Camari in the world</p>
        <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
          {locations.map((location) => (
            <address className="min-w-0 not-italic text-charcoal" key={location.country}>
              <h2 className="font-sans text-xl font-semibold uppercase leading-none tracking-normal">
                {location.country}
              </h2>
              <div className="mt-5 grid grid-rows-[minmax(3.25rem,auto)_auto_auto] gap-2 text-xs leading-[1.625rem] text-muted sm:text-sm xl:text-xs 2xl:text-sm">
                <p>
                  ADD: {location.addressLines ? (
                    <>{location.addressLines[0]}<br />{location.addressLines[1]}</>
                  ) : location.address}
                </p>
                <p className="whitespace-nowrap">TEL: {location.phone}</p>
                <p className="whitespace-nowrap">E-MAIL: {location.email}</p>
              </div>
            </address>
          ))}
        </div>
      </div>
    </div>
  );
}
