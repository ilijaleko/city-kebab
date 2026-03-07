export const KEBAB_TYPES = [
  "lepinja",
  "tortilja",
  "vegetarijanski",
  "tortilja_mix_salata",
] as const;

export const KEBAB_SIZES = ["mali", "veliki"] as const;

export const SAUCE_OPTIONS = [
  "ljuti",
  "ljuti_manje",
  "blagi",
  "blagi_manje",
  "mix",
  "mix_manje",
] as const;

export const KEBAB_ADDS = [
  "luk",
  "rajcica",
  "zelena_salata",
  "kupus",
  "kukuruz",
  "krastavci",
] as const;

export const ADDONS_EMOJIS: Record<string, string> = {
  luk: "\uD83E\uDDC5",
  rajcica: "\uD83C\uDF45",
  zelena_salata: "\uD83E\uDD6C",
  kupus: "\uD83E\uDD66",
  kukuruz: "\uD83C\uDF3D",
  krastavci: "\uD83E\uDD52",
};

export type KebabType = (typeof KEBAB_TYPES)[number];

export function shouldShowSize(type: string): boolean {
  return type === "lepinja";
}

export function shouldShowCheese(type: string): boolean {
  return !!type && (type === "lepinja" || type === "tortilja");
}
