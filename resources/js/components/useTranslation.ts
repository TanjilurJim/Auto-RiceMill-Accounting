import { useLanguage } from './LanguageContext';
import { translations } from './translations';

export function useTranslation() {
    const { language } = useLanguage();
    return (key: string, params?: Record<string, any>) => {
        let text = translations[language][key] || key;
        if (params) {
            Object.keys(params).forEach((k) => {
                text = text.replace(`{${k}}`, params[k]);
            });
        }
        return text;
    };
}
