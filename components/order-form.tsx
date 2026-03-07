"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addOrder } from "@/lib/actions/orders";
import { saveRecipe } from "@/lib/actions/recipes";
import {
  ADDONS_EMOJIS,
  KEBAB_ADDS,
  KEBAB_SIZES,
  KEBAB_TYPES,
  SAUCE_OPTIONS,
  shouldShowCheese,
  shouldShowSize,
} from "@/lib/kebab-config";
import { BookmarkPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Recipe = {
  id: string;
  name: string;
  userName: string | null;
  kebabType: string;
  kebabSize: string | null;
  sauce: string;
  hasCheese: boolean | null;
  adds: string[];
};

type OrderFormProps = {
  groupCode: string;
  userId?: string | null;
  recipes?: Recipe[];
};

export function OrderForm({ groupCode, userId, recipes = [] }: OrderFormProps) {
  const t = useTranslations("kebab");
  const tGroup = useTranslations("group");
  const tRecipe = useTranslations("recipe");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [isSavingRecipe, startRecipeTransition] = useTransition();

  const [name, setName] = useState("");
  const [kebabType, setKebabType] = useState("");
  const [kebabSize, setKebabSize] = useState("");
  const [sauce, setSauce] = useState("");
  const [hasCheese, setHasCheese] = useState<string>("");
  const [adds, setAdds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [recipeName, setRecipeName] = useState("");

  function getTypeTranslationKey(type: string): string {
    return type.replace(/ /g, "_");
  }

  function getSauceTranslationKey(s: string): string {
    return s
      .replace(/ /g, "_")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace("malo_manje", "manje");
  }

  function toggleAddon(addon: string) {
    setAdds((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon],
    );
  }

  function toggleAllAddons() {
    if (adds.length === KEBAB_ADDS.length) {
      setAdds([]);
    } else {
      setAdds([...KEBAB_ADDS]);
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t("validation.nameRequired");
    if (!kebabType) newErrors.kebabType = t("validation.typeRequired");
    if (shouldShowSize(kebabType) && !kebabSize)
      newErrors.kebabSize = t("validation.sizeRequired");
    if (!sauce) newErrors.sauce = t("validation.sauceRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setName("");
    setKebabType("");
    setKebabSize("");
    setSauce("");
    setHasCheese("");
    setAdds([]);
    setErrors({});
  }

  function handleSubmit() {
    if (!validate()) return;

    startTransition(async () => {
      try {
        await addOrder({
          groupCode,
          name: name.trim(),
          kebabType,
          kebabSize: shouldShowSize(kebabType) ? kebabSize : null,
          sauce,
          hasCheese: shouldShowCheese(kebabType) ? hasCheese === "yes" : null,
          adds,
        });
        toast.success(tGroup("orderAdded"));
        resetForm();
      } catch {
        toast.error("Failed to add order");
      }
    });
  }

  function handleSaveRecipe() {
    if (!recipeName.trim()) return;

    startRecipeTransition(async () => {
      try {
        await saveRecipe({
          name: recipeName.trim(),
          userName: name.trim() || null,
          kebabType,
          kebabSize: shouldShowSize(kebabType) ? kebabSize : null,
          sauce,
          hasCheese: shouldShowCheese(kebabType) ? hasCheese === "yes" : null,
          adds,
        });
        toast.success(tRecipe("saved"));
        setRecipeDialogOpen(false);
        setRecipeName("");
      } catch {
        toast.error("Failed to save recipe");
      }
    });
  }

  function loadRecipe(recipeId: string) {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    if (recipe.userName) setName(recipe.userName);
    setKebabType(recipe.kebabType);
    setKebabSize(recipe.kebabSize ?? "");
    setSauce(recipe.sauce);
    setHasCheese(
      recipe.hasCheese === true
        ? "yes"
        : recipe.hasCheese === false
          ? "no"
          : "",
    );
    setAdds(recipe.adds);
    setErrors({});
  }

  return (
    <div className="space-y-4">
      {/* Recipe Picker */}
      {recipes.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
            {tRecipe("chooseRecipe")}
          </label>
          <Select onValueChange={loadRecipe}>
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder={tRecipe("chooseRecipe")} />
            </SelectTrigger>
            <SelectContent>
              {recipes.map((recipe) => (
                <SelectItem key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {t("name")}
        </label>
        <Input
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          className="rounded-lg bg-white/70 dark:bg-stone-800/50"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Kebab Type */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {t("type")}
        </label>
        <Select
          value={kebabType}
          onValueChange={(val) => {
            setKebabType(val);
            if (!shouldShowSize(val)) setKebabSize("");
            if (!shouldShowCheese(val)) setHasCheese("");
          }}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder={t("typePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {KEBAB_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`types.${getTypeTranslationKey(type)}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.kebabType && (
          <p className="text-xs text-destructive">{errors.kebabType}</p>
        )}
      </div>

      {/* Kebab Size (conditional) */}
      {shouldShowSize(kebabType) && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
            {t("size")}
          </label>
          <Select value={kebabSize} onValueChange={setKebabSize}>
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder={t("sizePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {KEBAB_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {t(`sizes.${size}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.kebabSize && (
            <p className="text-xs text-destructive">{errors.kebabSize}</p>
          )}
        </div>
      )}

      {/* Sauce */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {t("sauce")}
        </label>
        <Select value={sauce} onValueChange={setSauce}>
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue placeholder={t("saucePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {SAUCE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`sauces.${getSauceTranslationKey(s)}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sauce && (
          <p className="text-xs text-destructive">{errors.sauce}</p>
        )}
      </div>

      {/* Cheese (conditional) */}
      {shouldShowCheese(kebabType) && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
            {t("cheese")}
          </label>
          <Select value={hasCheese} onValueChange={setHasCheese}>
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder={t("cheese")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">{t("cheeseYes")}</SelectItem>
              <SelectItem value="no">{t("cheeseNo")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Addons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
            {t("addons")}
          </label>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={toggleAllAddons}
            className="cursor-pointer text-xs text-stone-500 dark:text-stone-500"
          >
            {t("addonsAll")}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {KEBAB_ADDS.map((addon) => (
            <label
              key={addon}
              className="flex items-center gap-2 cursor-pointer rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-2.5 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <Checkbox
                checked={adds.includes(addon)}
                onCheckedChange={() => toggleAddon(addon)}
              />
              <span className="text-sm text-stone-600 dark:text-stone-300">
                {ADDONS_EMOJIS[addon]} {t(`adds.${addon.replace(/ /g, "_")}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900 text-white cursor-pointer rounded-xl h-11 font-bold shadow-sm"
      >
        {isPending ? tGroup("adding") : tGroup("addOrder")}
      </Button>

      {/* Save Recipe (signed-in users only) */}
      {userId && (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setRecipeDialogOpen(true)}
            disabled={!kebabType || !sauce}
            className="w-full cursor-pointer rounded-xl"
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            {tRecipe("save")}
          </Button>

          <Dialog open={recipeDialogOpen} onOpenChange={setRecipeDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-playfair">
                  {tRecipe("saveTitle")}
                </DialogTitle>
                <DialogDescription>{tRecipe("saveSubtitle")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    {tRecipe("recipeName")}
                  </label>
                  <Input
                    placeholder={tRecipe("recipeNamePlaceholder")}
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    maxLength={50}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setRecipeDialogOpen(false)}
                  className="cursor-pointer rounded-lg"
                >
                  {tCommon("cancel")}
                </Button>
                <Button
                  onClick={handleSaveRecipe}
                  disabled={isSavingRecipe || !recipeName.trim()}
                  className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900 text-white cursor-pointer rounded-lg shadow-sm"
                >
                  {isSavingRecipe ? tCommon("loading") : tCommon("save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

