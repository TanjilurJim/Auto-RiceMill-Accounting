import { useLanguage } from './LanguageContext';

export function useFontClass() {
    const { language } = useLanguage();
    return language === 'bn' ? 'font-bangla' : 'font-english';
}
