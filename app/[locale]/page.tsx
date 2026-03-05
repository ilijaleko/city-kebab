"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitHubStar } from "@/components/github-star";
import { createGroup, checkAndJoinGroup } from "@/lib/actions/groups";
import {
  Flame,
  Sparkles,
  Wheat,
  Heart,
  Users,
  UtensilsCrossed,
  Smartphone,
  Quote,
  MapPin,
  Clock,
} from "lucide-react";

type ShopStatus = "open" | "closing" | "closed";

function useShopStatus(): ShopStatus {
  const [status, setStatus] = useState<ShopStatus>("closed");

  useEffect(() => {
    function check() {
      const now = new Date();
      const day = now.getDay();
      const time = now.getHours() + now.getMinutes() / 60;

      if (day >= 1 && day <= 5) {
        if (time >= 9 && time < 20.5) setStatus("open");
        else if (time >= 20.5 && time < 21) setStatus("closing");
        else setStatus("closed");
      } else {
        setStatus("closed");
      }
    }
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, []);

  return status;
}

const STATUS_DOT: Record<ShopStatus, string> = {
  open: "bg-green-500",
  closing: "bg-yellow-500",
  closed: "bg-red-400/70 dark:bg-red-500/60",
};

const qualityIcons = {
  fire: Flame,
  sparkles: Sparkles,
  wheat: Wheat,
  heart: Heart,
} as const;

const stepIcons = {
  users: Users,
  utensils: UtensilsCrossed,
  smartphone: Smartphone,
  flame: Flame,
} as const;

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-3 sm:py-4">
      <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-amber-900/20 dark:to-amber-400/20" />
      <span className="text-amber-800/30 dark:text-amber-400/30 text-xs sm:text-sm font-playfair">&#10022;</span>
      <span className="h-px w-6 sm:w-8 bg-amber-900/20 dark:bg-amber-400/20" />
      <span className="text-amber-800/30 dark:text-amber-400/30 text-xs sm:text-sm font-playfair">&#10022;</span>
      <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-amber-900/20 dark:to-amber-400/20" />
    </div>
  );
}

export default function Home() {
  const t = useTranslations("home");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-stone-950 dark:to-stone-900">
      {/* Warm color blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-300/30 dark:bg-orange-900/20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-orange-200/25 dark:bg-orange-900/15 blur-3xl" />
        <div className="absolute top-2/3 -right-20 w-72 h-72 rounded-full bg-amber-300/20 dark:bg-amber-800/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-64 rounded-full bg-yellow-200/30 dark:bg-yellow-900/10 blur-3xl" />
      </div>

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
            <span className="hidden sm:block pointer-events-none absolute top-1/2 -translate-y-1/2 left-full ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 bg-stone-900 dark:bg-amber-50 text-white dark:text-stone-900 text-sm font-medium px-4 py-2 rounded-xl whitespace-nowrap shadow-lg">
              {t("createOrder")}
            </span>
          </div>
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-stone-900 dark:text-amber-50 leading-none">
            City{" "}
            <span className="text-orange-600 dark:text-orange-400">Kebab</span>
          </h1>

          <div className={`mt-2 sm:mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm ${status === "open" ? "text-green-700 dark:text-green-400" : status === "closing" ? "text-yellow-700 dark:text-yellow-400" : "text-stone-500 dark:text-amber-400/50"}`}>
            <span className="relative flex h-2 w-2">
              {status !== "closed" && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${STATUS_DOT[status]}`} />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${STATUS_DOT[status]}`} />
            </span>
            {status === "open"
              ? t("openNow")
              : status === "closing"
                ? t("closingSoon")
                : t("closedNow")}
            {status !== "open" && (
              <span className="italic text-stone-400 dark:text-amber-400/30">
                — {t("closedMessage")}
              </span>
            )}
          </div>

          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-amber-800/60 dark:text-amber-400/60">
            <span className="hidden sm:block h-px w-6 bg-amber-800/30 dark:bg-amber-400/30" />
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase">{t("location")}</span>
            <span className="text-[10px] sm:text-xs">&#183;</span>
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase">{t("since")}</span>
            <span className="text-[10px] sm:text-xs">&#183;</span>
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase">{t("hours")}</span>
            <span className="hidden sm:block h-px w-6 bg-amber-800/30 dark:bg-amber-400/30" />
          </div>

          <p className="font-playfair text-xs sm:text-sm italic text-amber-900/60 dark:text-amber-300/60 mt-2 sm:mt-3 px-4 sm:px-0">
            {t("heroSubtitle")}
          </p>
        </div>

        <OrnamentalDivider />

        {/* Tagline */}
        <div className="py-3 sm:py-4 text-center max-w-lg mx-auto animate-fade-up px-2 sm:px-0">
          <p className="font-playfair text-xl sm:text-2xl md:text-3xl italic text-stone-800 dark:text-amber-100 leading-relaxed">
            &ldquo;{t("taglineQuote")}&rdquo;
          </p>
        </div>

        <OrnamentalDivider />

        {/* Our Story */}
        <section className="py-6 sm:py-8 animate-fade-in">
          <div className="text-center mb-4 sm:mb-6">
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-orange-600/60 dark:text-orange-400/60 font-medium">
              {t("storyLabel")}
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-50 mt-1">
              {t("storyTitle")}
            </h2>
          </div>
          <div className="vintage-paper bg-white/50 dark:bg-stone-900/50 rounded-xl sm:rounded-2xl border border-orange-300/40 dark:border-amber-700/30 p-5 sm:p-8 backdrop-blur-sm">
            <p className="text-stone-700 dark:text-amber-100/80 text-sm leading-relaxed sm:text-base sm:leading-relaxed first-letter:text-3xl first-letter:font-playfair first-letter:font-bold first-letter:text-orange-600 dark:first-letter:text-orange-400 first-letter:mr-1 first-letter:float-left">
              {t("storyText")}
            </p>
            <p className="text-stone-700 dark:text-amber-100/80 text-sm leading-relaxed sm:text-base sm:leading-relaxed mt-3 sm:mt-4">
              {t("storyText2")}
            </p>
          </div>
        </section>

        {/* Quality highlights */}
        <section className="py-4 sm:py-6">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {(["Fresh", "Sauce", "Bread", "Love"] as const).map((key, i) => {
              const iconName = t(`quality${key}Icon`) as keyof typeof qualityIcons;
              const Icon = qualityIcons[iconName] || Heart;
              return (
                <div
                  key={key}
                  className="group bg-white/40 dark:bg-stone-900/40 rounded-xl border border-orange-300/30 dark:border-amber-700/25 p-3 sm:p-4 text-center hover:bg-white/60 dark:hover:bg-stone-900/60 hover:border-orange-400/50 dark:hover:border-amber-600/40 transition-all backdrop-blur-sm"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-800/40 dark:to-amber-800/40 mb-1.5 sm:mb-2">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-playfair font-bold text-xs sm:text-sm text-stone-900 dark:text-amber-50">
                    {t(`quality${key}`)}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-600 dark:text-amber-200/60 mt-0.5 sm:mt-1 leading-snug">
                    {t(`quality${key}Desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <OrnamentalDivider />

        {/* Reviews */}
        <section className="py-6 sm:py-8">
          <div className="text-center mb-4 sm:mb-6">
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-orange-600/60 dark:text-orange-400/60 font-medium">
              {t("reviewsSubtitle")}
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-50 mt-1">
              {t("reviewsTitle")}
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {reviews.map((num, i) => (
              <div
                key={num}
                className="vintage-paper bg-white/50 dark:bg-stone-900/40 rounded-xl border border-orange-300/30 dark:border-amber-700/25 p-4 sm:p-6 animate-fade-up backdrop-blur-sm"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600/25 dark:text-orange-400/25 mb-1.5 sm:mb-2" />
                <p className="font-playfair italic text-stone-800 dark:text-amber-100/80 text-sm leading-relaxed sm:text-base sm:leading-relaxed">
                  {t(`review${num}Text`)}
                </p>
                <div className="mt-3 sm:mt-4 flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-400 dark:from-orange-700/50 dark:to-amber-700/50 flex items-center justify-center flex-shrink-0">
                    <span className="font-playfair text-xs sm:text-sm font-bold text-white dark:text-amber-100">
                      {t(`review${num}Author`).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-stone-900 dark:text-amber-50">
                      {t(`review${num}Author`)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-stone-500 dark:text-amber-300/50">
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
        <section className="my-6 sm:my-8 vintage-paper bg-white/60 dark:bg-stone-900/60 rounded-xl sm:rounded-2xl border border-orange-300/40 dark:border-amber-700/30 p-5 sm:p-8 shadow-lg shadow-orange-900/5 dark:shadow-black/20 backdrop-blur-sm">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-50 text-center">
            {t("orderTitle")}
          </h2>

          <p className="text-[10px] sm:text-xs text-stone-500 dark:text-amber-300/50 text-center mt-1 mb-4 sm:mb-6">
            {t("orderSubtitle")}
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white cursor-pointer h-11 sm:h-12 font-bold rounded-xl text-sm sm:text-base shadow-md shadow-orange-900/20 dark:shadow-orange-900/30"
            >
              {isCreating ? t("creating") : t("createOrder")}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-orange-200 dark:border-amber-800/30" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white/60 dark:bg-stone-900/60 px-3 text-stone-400 dark:text-amber-400/40">
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
        </section>

        {/* How it works */}
        <section className="pb-8 sm:pb-10 text-sm text-stone-600 dark:text-amber-200/60">
          <h3 className="font-playfair text-lg sm:text-xl font-bold text-stone-900 dark:text-amber-50 mb-3 sm:mb-4 text-center">
            {t("howItWorks")}
          </h3>
          <ol className="space-y-2.5 sm:space-y-3 max-w-sm mx-auto">
            {([1, 2, 3, 4] as const).map((step) => {
              const iconName = t(`step${step}Icon`) as keyof typeof stepIcons;
              const Icon = stepIcons[iconName] || Flame;
              return (
                <li key={step} className="flex gap-2.5 sm:gap-3 items-start">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-800/40 dark:to-amber-800/40 flex items-center justify-center mt-0.5">
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xs sm:text-sm">
                    <span className="font-medium text-stone-800 dark:text-amber-100">
                      {t(`step${step}Title`)}
                    </span>
                    {" — "}
                    {t(`step${step}Desc`)}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Footer */}
        <footer className="border-t border-orange-300/30 dark:border-amber-700/20 py-6 sm:py-8 text-center text-xs text-stone-500 dark:text-amber-400/40">
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
