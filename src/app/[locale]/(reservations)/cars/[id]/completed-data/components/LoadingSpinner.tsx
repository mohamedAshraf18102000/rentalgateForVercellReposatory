/**
 * Loading Spinner Component
 * Displays a loading overlay while checking first booking status
 */

'use client';

interface LoadingSpinnerProps {
    locale: string;
}

export function LoadingSpinner({ locale }: LoadingSpinnerProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-gray-600">
                    {locale === 'ar' ? 'جاري التحقق...' : 'Checking...'}
                </p>
            </div>
        </div>
    );
}



