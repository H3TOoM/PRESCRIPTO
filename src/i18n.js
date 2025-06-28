import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en.json";
import translationAR from "./locales/ar.json";

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("i18nextLng") || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n; 