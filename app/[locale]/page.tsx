"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GitHubStar } from "@/components/github-star";
import { createGroup, checkAndJoinGroup } from "@/lib/actions/groups";

export default function Home() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [groupCode, setGroupCode] = useState("");
  const [groupError, setGroupError] = useState("");
  const [isCreating, startCreating] = useTransition();
  const [isJoining, startJoining] = useTransition();

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
          t("groupNotFound", { code: groupCode.toUpperCase().trim() })
        );
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-md px-4 py-6">
        <Header />

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-600">
              {t("title")}
            </CardTitle>
            <CardDescription>{t("subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create Order */}
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            >
              {isCreating ? t("creating") : t("createOrder")}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Join Group */}
            <div className="space-y-2">
              <Input
                placeholder={t("enterGroupId")}
                value={groupCode}
                onChange={(e) => {
                  setGroupCode(e.target.value.toUpperCase());
                  setGroupError("");
                }}
                maxLength={6}
                className="text-center tracking-widest font-mono text-lg"
              />
              <Button
                onClick={handleJoin}
                disabled={isJoining || !groupCode.trim()}
                variant="outline"
                className="w-full cursor-pointer"
              >
                {isJoining ? t("joining") : t("joinGroup")}
              </Button>
            </div>

            {/* Group Not Found Error */}
            {groupError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center">
                <p>{groupError}</p>
                <Button
                  variant="link"
                  onClick={handleCreate}
                  className="text-orange-500 p-0 h-auto mt-1 cursor-pointer"
                >
                  {t("createNewInstead")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How it Works */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-center">
            {t("howItWorks")}
          </h2>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className="flex gap-3 items-start bg-white/60 dark:bg-white/5 rounded-lg p-3"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                  {step}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {t(`step${step}Title`)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t(`step${step}Desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-muted-foreground pb-4">
          <div className="flex justify-center mb-3">
            <GitHubStar size="sm" showText />
          </div>
          <p>
            {t("madeBy")}{" "}
            <a
              href="https://ilijaleko.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Ilija
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
