export type PriceMap = Record<string, number>;

/**
 * Calculate the total price for a kebab order.
 * Price keys: "lepinja_mali", "lepinja_veliki", "tortilja",
 *             "vegetarijanski", "tortilja_mix_salata", "cheese", "extra_meso"
 */
export function calculateOrderPrice(
  prices: PriceMap,
  config: {
    kebabType: string;
    kebabSize: string | null;
    hasCheese: boolean | null;
  },
): number | null {
  if (!config.kebabType) return null;

  const baseKey = config.kebabSize
    ? `${config.kebabType}_${config.kebabSize}`
    : config.kebabType;

  const basePrice = prices[baseKey];
  if (basePrice == null) return null;

  let total = basePrice;

  if (config.hasCheese && prices.cheese != null) {
    total += prices.cheese;
  }

  return total;
}
