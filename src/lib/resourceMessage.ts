import type { Resource } from "@/types/resource";
import type { UsageGuide } from "@/types/usageGuide";

const SEPARATOR = "\n\n---\n\n";

export function buildResourceMessage(resource: Resource): string {
  const blocks: string[] = [];

  if (resource.title_en) {
    const en = [`*EN* - *${resource.title_en}*`];
    if (resource.description_en) en.push(resource.description_en);
    blocks.push(en.join("\n"));
  }

  const it = [`*IT* - *${resource.title_it}*`];
  if (resource.description_it) it.push(resource.description_it);
  blocks.push(it.join("\n"));

  blocks.push(resource.type === "link" ? resource.url! : resource.file_url!);

  return blocks.join(SEPARATOR);
}

export function toWaShareLink(resource: Resource): string {
  return `https://wa.me/?text=${encodeURIComponent(buildResourceMessage(resource))}`;
}

export function buildUsageGuideMessage(guide: UsageGuide): string {
  return [`*${guide.title}*`, guide.url].join(SEPARATOR);
}

export function buildTripMapMessage(label: string, url: string): string {
  return [`*${label}*`, url].join(SEPARATOR);
}
