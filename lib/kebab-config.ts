export const KEBAB_TYPES = [
  "pecivo",
  "tortilja",
  "vegetarijanski",
  "tortilja mix salata",
] as const;

export const KEBAB_SIZES = ["mali", "veliki"] as const;

export const SAUCE_OPTIONS = [
  "ljuti",
  "ljuti (malo manje)",
  "blagi",
  "blagi (malo manje)",
  "mix",
  "mix (malo manje)",
] as const;

export const KEBAB_ADDS = [
  "luk",
  "rajcica",
  "zelena salata",
  "kupus",
  "kukuruz",
  "krastavci",
] as const;

export const ADDONS_EMOJIS: Record<string, string> = {
  luk: "\uD83E\uDDC5",
  rajcica: "\uD83C\uDF45",
  "zelena salata": "\uD83E\uDD6C",
  kupus: "\uD83E\uDD66",
  kukuruz: "\uD83C\uDF3D",
  krastavci: "\uD83E\uDD52",
};

export type KebabType = (typeof KEBAB_TYPES)[number];

export function shouldShowSize(type: string): boolean {
  return !!type && type !== "tortilja mix salata" && type !== "vegetarijanski";
}

export function shouldShowCheese(type: string): boolean {
  return !!type && (type === "pecivo" || type === "tortilja");
}
