import { getPriceMap } from "@/lib/queries/prices";
import { HomePage } from "./home-page-client";

export default async function Home() {
  const prices = await getPriceMap();

  return <HomePage prices={prices} />;
}
