import { createContext, useContext, useState } from "react";

const LanguageContext = createContext({
    language: 'en',
    toggleLanguage: () => {}
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({children}) => {
    const [language, setLanguage] = useState<'en' | 'bn'>('en');
    const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'bn' : 'en');
    return (
        <LanguageContext.Provider value={{language, toggleLanguage}}>{children}</LanguageContext.Provider>
    )
}
