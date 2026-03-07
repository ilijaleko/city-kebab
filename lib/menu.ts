export type MenuCategory = {
  labelKey: string;
  items: { labelKey: string; sizeKey?: string; priceKey: string }[];
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    labelKey: "types.lepinja",
    items: [
      { labelKey: "menu.mali", priceKey: "lepinja_mali" },
      { labelKey: "menu.veliki", priceKey: "lepinja_veliki" },
    ],
  },
  {
    labelKey: "types.tortilja",
    items: [{ labelKey: "types.tortilja", priceKey: "tortilja" }],
  },
  {
    labelKey: "menu.other",
    items: [
      { labelKey: "types.vegetarijanski", priceKey: "vegetarijanski" },
      {
        labelKey: "types.tortilja_mix_salata",
        priceKey: "tortilja_mix_salata",
      },
    ],
  },
  {
    labelKey: "menu.extras",
    items: [
      { labelKey: "cheese", priceKey: "cheese" },
      { labelKey: "menu.extraMeso", priceKey: "extra_meso" },
    ],
  },
];
