"use client";

import { GitHubStar } from "@/components/github-star";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkAndJoinGroup, createGroup } from "@/lib/actions/groups";
import { MENU_CATEGORIES } from "@/lib/menu";
import type { PriceMap } from "@/lib/prices";
import { STATUS_DOT, useShopStatus } from "@/lib/shop-status";
import {
  Clock,
  Flame,
  MapPin,
  Quote,
  Smartphone,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

const stepIcons = {
  users: Users,
  utensils: UtensilsCrossed,
  smartphone: Smartphone,
  flame: Flame,
} as const;

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-3 sm:py-4">
      <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-stone-300 dark:to-stone-700" />
      <span className="text-stone-300 dark:text-stone-600 text-xs sm:text-sm font-playfair">
        &#10022;
      </span>
      <span className="h-px w-6 sm:w-8 bg-stone-300 dark:bg-stone-700" />
      <span className="text-stone-300 dark:text-stone-600 text-xs sm:text-sm font-playfair">
        &#10022;
      </span>
      <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-stone-300 dark:to-stone-700" />
    </div>
  );
}

export function HomePage({ prices }: { prices: PriceMap }) {
  const t = useTranslations("home");
  const tKebab = useTranslations("kebab");
  const locale = useLocale();
  const [groupCode, setGroupCode] = useState("");
  const [groupError, setGroupError] = useState("");
  const [isCreating, startCreating] = useTransition();
  const [isJoining, startJoining] = useTransition();
  const status = useShopStatus();

  function handleCreate() {
    startCreating(async () => {
      await createGroup(locale);
    });
  }

  function handleJoin() {
    if (!groupCode.trim()) return;
    setGroupError("");

    startJoining(async () => {
      const result = await checkAndJoinGroup(groupCode, locale);
      if (result?.error === "not_found") {
        setGroupError(
          t("groupNotFound", { code: groupCode.toUpperCase().trim() }),
        );
      }
    });
  }

  const reviews = [1, 2, 3, 4] as const;
  const hasPrices = Object.keys(prices).length > 0;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="relative container mx-auto max-w-2xl px-4 sm:px-5">
        <div className="pt-3 sm:pt-4">
          <Header />
        </div>

        {/* Hero */}
        <div className="text-center pt-6 sm:pt-8 pb-3 sm:pb-4">
          <div className="relative inline-block mb-3 sm:mb-4 group">
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="text-5xl sm:text-6xl animate-float cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 disabled:opacity-60 disabled:cursor-wait"
              aria-label={t("createOrder")}
            >
              🥙
            </button>
            <span className="hidden sm:block pointer-events-none absolute top-1/2 -translate-y-1/2 left-full ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 bg-stone-900 dark:bg-stone-50 text-white dark:text-stone-900 text-sm font-medium px-4 py-2 rounded-xl whitespace-nowrap shadow-lg">
              {t("createOrder")}
            </span>
          </div>
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-stone-900 dark:text-stone-50 leading-none">
            City{" "}
            <span className="text-orange-600 dark:text-orange-400">Kebab</span>
          </h1>

          <div
            className={`mt-2 sm:mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm ${status === "open" ? "text-green-700 dark:text-green-400" : status === "closing" ? "text-yellow-700 dark:text-yellow-400" : "text-stone-500 dark:text-stone-500"}`}
          >
            <span className="relative flex h-2 w-2">
              {status !== "closed" && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${STATUS_DOT[status]}`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${STATUS_DOT[status]}`}
              />
            </span>
            {status === "open"
              ? t("openNow")
              : status === "closing"
                ? t("closingSoon")
                : t("closedNow")}
            {status !== "open" && (
              <span className="italic text-stone-400 dark:text-stone-500">
                — {t("closedMessage")}
              </span>
            )}
          </div>

          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-stone-400 dark:text-stone-500">
            <span className="hidden sm:block h-px w-6 bg-stone-300 dark:bg-stone-600" />
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase">
              {t("location")}
            </span>
            <span className="text-[10px] sm:text-xs">&#183;</span>
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase">
              {t("since")}
            </span>
            <span className="text-[10px] sm:text-xs">&#183;</span>
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase">
              {t("hours")}
            </span>
            <span className="hidden sm:block h-px w-6 bg-stone-300 dark:bg-stone-600" />
          </div>

          <p className="font-playfair text-xs sm:text-sm italic text-stone-500 dark:text-stone-400 mt-2 sm:mt-3 px-4 sm:px-0">
            {t("heroSubtitle")}
          </p>

          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 sm:gap-2.5">
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              size="sm"
              className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900 text-white cursor-pointer px-4 font-medium rounded-lg text-xs sm:text-sm shadow-sm"
            >
              {isCreating ? t("creating") : t("createOrder")}
            </Button>
            <span className="text-[10px] text-stone-400 dark:text-stone-500">
              {t("or")}
            </span>
            <Input
              placeholder={t("enterGroupId")}
              value={groupCode}
              onChange={(e) => {
                setGroupCode(e.target.value.toUpperCase());
                setGroupError("");
              }}
              maxLength={6}
              className="w-24 sm:w-28 text-center tracking-wider text-[10px] sm:text-xs rounded-lg h-8 sm:h-9 bg-white/70 dark:bg-stone-800/50 placeholder:tracking-normal"
            />
            <Button
              onClick={handleJoin}
              disabled={isJoining || !groupCode.trim()}
              variant="outline"
              size="sm"
              className="cursor-pointer rounded-lg text-xs sm:text-sm"
            >
              {isJoining ? t("joining") : t("joinGroup")}
            </Button>
          </div>
          {groupError && (
            <div className="mt-2 rounded-xl bg-red-50/80 dark:bg-red-950/30 p-2 text-xs text-red-600 dark:text-red-400 text-center">
              <p>{groupError}</p>
              <Button
                variant="link"
                onClick={handleCreate}
                className="text-orange-600 dark:text-orange-400 p-0 h-auto mt-1 cursor-pointer text-xs"
              >
                {t("createNewInstead")}
              </Button>
            </div>
          )}
        </div>

        <OrnamentalDivider />

        {/* Our Story */}
        <section className="py-6 sm:py-8 animate-fade-in">
          <div className="text-center mb-4 sm:mb-6">
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-orange-600/60 dark:text-orange-400/60 font-medium">
              {t("storyLabel")}
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50 mt-1">
              {t("storyTitle")}
            </h2>
          </div>
          <div className="vintage-paper bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-8">
            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed sm:text-base sm:leading-relaxed pl-4 sm:pl-5 border-l-3 border-orange-400 dark:border-orange-600">
              {t("storyText")}
            </p>
            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed sm:text-base sm:leading-relaxed mt-3 sm:mt-4">
              {t("storyText2")}
            </p>
          </div>
        </section>

        <OrnamentalDivider />

        {/* Price List / Menu */}
        {hasPrices && (
          <section className="py-6 sm:py-8">
            <div className="text-center mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-orange-600/60 dark:text-orange-400/60 font-medium">
                {t("menuSubtitle")}
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50 mt-1">
                {t("menuTitle")}
              </h2>
            </div>
            <div className="vintage-paper bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-8">
              <div className="space-y-5 sm:space-y-6">
                {MENU_CATEGORIES.map((category) => {
                  const visibleItems = category.items.filter(
                    (item) => prices[item.priceKey] != null,
                  );
                  if (visibleItems.length === 0) return null;
                  return (
                    <div key={category.labelKey}>
                      <h3 className="font-playfair text-sm sm:text-base font-bold text-stone-900 dark:text-stone-50 mb-2 sm:mb-3">
                        {tKebab(category.labelKey)}
                      </h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        {visibleItems.map((item) => (
                          <div
                            key={item.priceKey}
                            className="flex items-baseline gap-2"
                          >
                            <span className="text-sm text-stone-700 dark:text-stone-300">
                              {item.sizeKey
                                ? tKebab(item.sizeKey)
                                : tKebab(item.labelKey)}
                            </span>
                            <span className="flex-1 border-b border-dotted border-stone-300 dark:border-stone-700 translate-y-[-3px]" />
                            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                              {prices[item.priceKey]!.toFixed(2)} &euro;
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 mt-4 sm:mt-5 text-center italic">
                {t("menuNote")}
              </p>
            </div>
          </section>
        )}

        <OrnamentalDivider />

        {/* Reviews */}
        <section className="py-6 sm:py-8">
          <div className="text-center mb-4 sm:mb-6">
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-orange-600/60 dark:text-orange-400/60 font-medium">
              {t("reviewsSubtitle")}
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50 mt-1">
              {t("reviewsTitle")}
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {reviews.map((num, i) => (
              <div
                key={num}
                className="vintage-paper bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-6 animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-stone-200 dark:text-stone-700 mb-1.5 sm:mb-2" />
                <p className="font-playfair italic text-stone-800 dark:text-stone-300 text-sm leading-relaxed sm:text-base sm:leading-relaxed">
                  {t(`review${num}Text`)}
                </p>
                <div className="mt-3 sm:mt-4 flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-stone-800 dark:to-stone-700 flex items-center justify-center flex-shrink-0">
                    <span className="font-playfair text-xs sm:text-sm font-bold text-white dark:text-stone-200">
                      {t(`review${num}Author`).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-50">
                      {t(`review${num}Author`)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400">
                      {t(`review${num}Role`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <OrnamentalDivider />

        {/* Order card */}
        <section className="my-6 sm:my-8 vintage-paper bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-8 shadow-lg shadow-stone-200/50 dark:shadow-black/20">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50 text-center">
            {t("orderTitle")}
          </h2>

          <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 text-center mt-1 mb-4 sm:mb-6">
            {t("orderSubtitle")}
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900 text-white cursor-pointer h-11 sm:h-12 font-bold rounded-xl text-sm sm:text-base shadow-sm"
            >
              {isCreating ? t("creating") : t("createOrder")}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-stone-200 dark:border-stone-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white dark:bg-stone-900 px-3 text-stone-400 dark:text-stone-500">
                  {t("or")}
                </span>
              </div>
            </div>

            <Input
              placeholder={t("enterGroupId")}
              value={groupCode}
              onChange={(e) => {
                setGroupCode(e.target.value.toUpperCase());
                setGroupError("");
              }}
              maxLength={6}
              className="text-center tracking-widest text-base sm:text-lg rounded-xl h-11 sm:h-12 bg-white/70 dark:bg-stone-800/50"
            />
            <Button
              onClick={handleJoin}
              disabled={isJoining || !groupCode.trim()}
              variant="outline"
              className="w-full cursor-pointer rounded-xl h-10 sm:h-11"
            >
              {isJoining ? t("joining") : t("joinGroup")}
            </Button>

            {groupError && (
              <div className="rounded-xl bg-red-50/80 dark:bg-red-950/30 p-3 text-xs text-red-600 dark:text-red-400 text-center">
                <p>{groupError}</p>
                <Button
                  variant="link"
                  onClick={handleCreate}
                  className="text-orange-600 dark:text-orange-400 p-0 h-auto mt-1 cursor-pointer text-xs"
                >
                  {t("createNewInstead")}
                </Button>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-stone-200 dark:border-stone-800">
            <p className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 text-center uppercase tracking-widest mb-3">
              {t("howItWorks")}
            </p>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3 text-center">
              {([1, 2, 3, 4] as const).map((step) => {
                const iconName = t(`step${step}Icon`) as keyof typeof stepIcons;
                const Icon = stepIcons[iconName] || Flame;
                return (
                  <div key={step}>
                    <div className="mx-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-50 dark:bg-stone-800 flex items-center justify-center mb-1">
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-stone-700 dark:text-stone-300 leading-tight">
                      {t(`step${step}Title`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 dark:border-stone-800 py-6 sm:py-8 text-center text-xs text-stone-500 dark:text-stone-500">
          <div className="flex justify-center mb-2 sm:mb-3">
            <GitHubStar size="sm" showText />
          </div>
          <p>
            {t("madeBy")}{" "}
            <a
              href="https://ilijaleko.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 dark:text-orange-400 hover:underline"
            >
              Ilija
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

