import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({
    language: 'en',
    toggleLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

// Function to get initial language from localStorage or default to 'en'
const getInitialLanguage = (): 'en' | 'bn' => {
    if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage === 'en' || savedLanguage === 'bn') {
            return savedLanguage;
        }
    }
    return 'en'; // default language
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [language, setLanguage] = useState<'en' | 'bn'>(getInitialLanguage);

    const toggleLanguage = () => {
        setLanguage((prev) => {
            const newLanguage = prev === 'en' ? 'bn' : 'en';
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('language', newLanguage);
            }
            return newLanguage;
        });
    };

    // Effect to sync with localStorage on component mount
    useEffect(() => {
        const savedLanguage = getInitialLanguage();
        setLanguage(savedLanguage);
    }, []); // Empty dependency array is intentional - we only want this to run once on mount

    return <LanguageContext.Provider value={{ language, toggleLanguage }}>{children}</LanguageContext.Provider>;
};
