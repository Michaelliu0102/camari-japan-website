import { House, Sailboat, Sofa } from "lucide-react";

const applicationGroups = [
  { label: "Contract", pattern: /\b(hospitality|public area|healthcare|retail)\b/i, Icon: House },
  { label: "Residential", pattern: /\bresidential\b/i, Icon: Sofa },
  { label: "Outdoor", pattern: /\boutdoor\b/i, Icon: Sailboat },
];

export function ArticleApplicationIcons({ fieldOfApplication }: { fieldOfApplication: string }) {
  const groups = applicationGroups.filter(({ pattern }) => pattern.test(fieldOfApplication));
  if (groups.length === 0) return null;

  return (
    <ul aria-label="Field of application" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-wrap justify-center gap-x-5 gap-y-3 bg-black/55 px-3 py-4 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/image:opacity-100 group-focus-within/image:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100">
      {groups.map(({ label, Icon }) => (
        <li className="flex flex-col items-center gap-1.5" key={label} title={label}>
          <Icon aria-hidden="true" size={22} strokeWidth={1.5} />
          <span className="font-sans text-[10px] tracking-[0.04em]">{label}</span>
        </li>
      ))}
    </ul>
  );
}
