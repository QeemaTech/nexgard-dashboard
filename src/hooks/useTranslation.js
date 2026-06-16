import { useLocale } from "../context/LocaleContext";

export default function useTranslation() {
  const { t, locale, dir, isRtl, setLocale, toggleLocale, locales, isLocaleAnimating, phase } =
    useLocale();
  return { t, locale, dir, isRtl, setLocale, toggleLocale, locales, isLocaleAnimating, phase };
}
