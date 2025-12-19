/**
 * Language Switcher Component
 *
 * Dropdown component for selecting application language with i18n
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, RTL_LANGUAGES } from "@/i18n.config";
import { Globe, Check } from "lucide-react";

interface LanguageSwitcherI18nProps {
  className?: string;
}

export default function LanguageSwitcherI18n({
  className = "",
}: LanguageSwitcherI18nProps) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);

      // Update document direction
      const isRTL = RTL_LANGUAGES.includes(languageCode);
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = languageCode;

      // Save to user preferences if logged in
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/i18n/preferences`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                preferred_language: languageCode,
              }),
            },
          );
        }
      } catch (err) {
        console.error("Failed to save language preference:", err);
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  const currentLang =
    LANGUAGES.find((lang) => lang.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={t("common.selectLanguage")}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLang.flag} {currentLang.nativeName}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 px-2 py-1">
                {t("common.selectLanguage")}
              </h3>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {LANGUAGES.map((language) => {
                const isActive = currentLanguage === language.code;

                return (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      isActive ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{language.flag}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {language.nativeName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {language.name}
                          {language.rtl && " (RTL)"}
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {LANGUAGES.length} languages available
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
