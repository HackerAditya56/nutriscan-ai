import React from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-black flex justify-center">
            <div className="w-full max-w-md bg-background dark:bg-black h-[100dvh] relative overflow-hidden shadow-2xl">
                {children}
            </div>
        </div>
    );
};
