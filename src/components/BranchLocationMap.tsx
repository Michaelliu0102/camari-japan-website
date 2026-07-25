"use client";

import { useMemo, useState } from "react";

export type BranchLocation = {
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
};

type BranchLocationMapProps = {
  locations: BranchLocation[];
};

function mapEmbedUrl(location: BranchLocation) {
  const query = encodeURIComponent(`${location.lat},${location.lng}`);
  return `https://www.google.com/maps?q=${query}&z=12&output=embed`;
}

export function BranchLocationMap({ locations }: BranchLocationMapProps) {
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
          Camari&apos;s Global Network
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          Reach the regional team closest to your project for material
          availability, catalogs, and showroom appointments.
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
          <iframe
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            style={{ border: 0 }}
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
        <div className="mt-10 grid gap-x-12 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
          {locations.map((location) => (
            <address className="not-italic text-charcoal" key={location.country}>
              <h2 className="font-sans text-xl font-semibold uppercase leading-none tracking-normal md:text-2xl">
                {location.country}
              </h2>
              <div className="mt-5 grid grid-rows-[3.5rem_1.75rem_3.5rem] gap-2 text-base leading-7 text-muted 2xl:grid-rows-[4rem_2rem_4rem] 2xl:text-lg 2xl:leading-8">
                <p className="overflow-hidden">ADD: {location.address}</p>
                <p className="overflow-hidden">TEL: {location.phone}</p>
                <p className="overflow-hidden break-words">E-MAIL: {location.email}</p>
              </div>
            </address>
          ))}
        </div>
      </div>
    </div>
  );
}
