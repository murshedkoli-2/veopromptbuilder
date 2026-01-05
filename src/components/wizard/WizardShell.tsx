import React, { useState } from 'react';
import { useWizard } from './WizardProvider';
import { STEPS } from '@/constants/options';
import PreviewPanel from './PreviewPanel';
import { validateStep } from '@/lib/prompt-utils';
import { AlertCircle, Sun, Moon, User, LogOut, LogIn, Languages, Save, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';

export default function WizardShell({ children }: { children: React.ReactNode }) {
    const { currentStep, setStep, isReady, state, theme, toggleTheme, language, toggleLanguage, t, savePreset, resetState } = useWizard();
    const { data: session } = useSession();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Save Modal State
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [promptName, setPromptName] = useState('');
    const [promptDescription, setPromptDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isReady) return null;

    const currentStepId = STEPS[currentStep].id;
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    const handleNext = () => {
        const validation = validateStep(currentStepId, state);
        if (!validation.valid) {
            setError(validation.error || 'Please fill in required fields.');
            return;
        }
        setError(null);

        if (currentStep === STEPS.length - 1) {
            // Open Save Modal on Finish
            setPromptName('');
            setPromptDescription('');
            setIsSaveModalOpen(true);
        } else {
            setStep(Math.min(STEPS.length - 1, currentStep + 1));
        }
    };

    const handleSaveConfirm = async () => {
        if (!promptName.trim()) {
            setError('Please enter a name for your prompt.');
            return;
        }
        setIsSaving(true);
        try {
            await savePreset(promptName, promptDescription);
            setIsSaveModalOpen(false);
            // Optional: Reset wizard state or keep it? 
            // Usually nice to reset so they can start fresh, or navigate away.
            resetState();
            router.push('/library');
        } catch (error) {
            console.error(error);
            setError('Failed to save prompt.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        setError(null);
        setStep(Math.max(0, currentStep - 1));
    };

    const handleSkip = () => {
        setError(null);
        setStep(Math.min(STEPS.length - 1, currentStep + 1));
    };

    return (
        <div className="flex flex-col min-h-screen bg-background md:flex-row">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header / Progress */}
                <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 md:p-6">
                    <div className="max-w-3xl mx-auto w-full">
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/"
                                    className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95"
                                    title="Exit Builder"
                                >
                                    <X className="w-5 h-5" />
                                </Link>

                                <div>
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t('step')} {currentStep + 1} {t('of')} {STEPS.length}
                                    </span>
                                    <h1 className="text-xl font-semibold text-foreground">
                                        {t(STEPS[currentStep].id as any)}
                                    </h1>
                                </div>

                                <button
                                    onClick={toggleLanguage}
                                    className="p-2 rounded-xl bg-secondary/50 border border-border text-foreground hover:bg-secondary transition-all active:scale-95 flex items-center gap-2 px-3"
                                    title={`Switch to ${language === 'en' ? 'Bangla' : 'English'}`}
                                >
                                    <Languages className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">{language === 'en' ? 'EN' : 'BN'}</span>
                                </button>

                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-xl bg-secondary/50 border border-border text-foreground hover:bg-secondary transition-all active:scale-95"
                                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                                >
                                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                </button>

                                <div className="ml-2 flex items-center gap-2">
                                    {session ? (
                                        <div className="flex items-center gap-3">
                                            <div className="hidden sm:block text-right">
                                                <p className="text-xs font-semibold text-foreground truncate max-w-[100px]">{session.user?.name}</p>
                                                <button
                                                    onClick={() => signOut()}
                                                    className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-0.5"
                                                >
                                                    <LogOut className="w-2.5 h-2.5" />
                                                    {t('signOut')}
                                                </button>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                                <User className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            {t('signIn')}
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </header>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-sm text-muted-foreground">
                            {t((STEPS[currentStep].id + 'Desc') as any)}
                        </p>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {children}
                    </div>
                </div>

                {/* Footer Navigation */}
                <footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-md border-t border-border p-4 md:p-6">
                    <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="px-6 py-2.5 rounded-xl font-medium transition-all border border-border hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                        >
                            {t('back')}
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSkip}
                                className="px-6 py-2.5 rounded-xl font-medium transition-all bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95"
                            >
                                {t('skip')}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isSaving}
                                className="px-10 py-2.5 rounded-xl font-medium transition-all bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-primary/10 flex items-center gap-2"
                            >
                                {currentStep === STEPS.length - 1 ? (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {t('finish')}
                                    </>
                                ) : t('next')}
                            </button>
                        </div>
                    </div>
                </footer>
            </main>

            {/* Preview Panel (Desktop Side, Mobile Modal later) */}
            <aside className="hidden lg:block w-96 border-l border-border bg-card/50 overflow-y-auto sticky top-0 h-screen">
                <PreviewPanel />
            </aside>

            {/* Save Prompt Modal */}
            <Modal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title="Save Your Prompt"
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Give your prompt a name to save it to your library.
                    </p>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Prompt Name <span className="text-destructive">*</span></label>
                        <input
                            type="text"
                            value={promptName}
                            onChange={(e) => setPromptName(e.target.value)}
                            placeholder="e.g., Cyberpunk City Rain"
                            className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <textarea
                            value={promptDescription}
                            onChange={(e) => setPromptDescription(e.target.value)}
                            placeholder="Add some notes about this prompt..."
                            className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-24"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setIsSaveModalOpen(false)}
                            className="px-4 py-2 rounded-xl font-medium hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveConfirm}
                            disabled={!promptName.trim() || isSaving}
                            className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {isSaving ? 'Saving...' : 'Save & View Library'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
