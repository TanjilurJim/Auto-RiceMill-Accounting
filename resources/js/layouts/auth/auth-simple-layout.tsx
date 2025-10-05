import AppLogoIcon from '@/components/app-logo-icon';
import { useFontClass } from '@/components/useFontClass';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const fontClass = useFontClass();

    return (
        <div className={`bg-[#F5EEE9] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 ${fontClass}`}>
            {/* <div className="w-full max-w-sm"> */}
            <div className="w-full">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">


                        <div className="space-y-2 text-center">
                            {/* <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p> */}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
