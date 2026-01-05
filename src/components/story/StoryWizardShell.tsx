'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/wizard/WizardProvider';
import { X, Save, Wand2, ChevronRight, ChevronLeft } from 'lucide-react';
import StoryInputStep from './steps/StoryInputStep';
import StoryGenerationStep from './steps/StoryGenerationStep';
import StoryboardStep from './steps/StoryboardStep';
import { PromptState } from '@/types/wizard';
import Modal from '@/components/ui/Modal'; // Reuse existing modal

export default function StoryWizardShell() {
    const router = useRouter();
    const { saveStory } = useWizard();

    // Local Wizard State
    const [step, setStep] = useState(0); // 0: Input, 1: Generating, 2: Review
    const [storyText, setStoryText] = useState('');
    const [generatedScenes, setGeneratedScenes] = useState<PromptState[]>([]);

    // Save Modal
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [storyName, setStoryName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleGenerate = () => {
        if (!storyText.trim()) return;
        setStep(1); // Go to generation
    };

    const handleGenerationComplete = (scenes: PromptState[]) => {
        setGeneratedScenes(scenes);
        setStep(2); // Go to review
    };

    const handleSave = async () => {
        if (!storyName.trim()) return;
        setIsSaving(true);
        await saveStory(storyName, storyText.substring(0, 100) + '...', generatedScenes);
        setIsSaving(false);
        setIsSaveModalOpen(false);
        router.push('/story');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/story"
                        className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg">New Story</h1>
                        <p className="text-xs text-muted-foreground">
                            {step === 0 && 'Step 1: Write Story'}
                            {step === 1 && 'Step 2: Analysis'}
                            {step === 2 && 'Step 3: Review Storyboard'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {step === 2 && (
                        <button
                            onClick={() => setIsSaveModalOpen(true)}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
                        >
                            <Save className="w-4 h-4" />
                            Save Story
                        </button>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10">
                {step === 0 && (
                    <StoryInputStep
                        storyText={storyText}
                        setStoryText={setStoryText}
                    />
                )}
                {step === 1 && (
                    <StoryGenerationStep
                        storyText={storyText}
                        onComplete={handleGenerationComplete}
                    />
                )}
                {step === 2 && (
                    <StoryboardStep
                        scenes={generatedScenes}
                        updateScene={(idx, updates) => {
                            const newScenes = [...generatedScenes];
                            newScenes[idx] = { ...newScenes[idx], ...updates };
                            setGeneratedScenes(newScenes);
                        }}
                    />
                )}
            </main>

            {/* Footer Navigation (Step 0) */}
            {step === 0 && (
                <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border p-4 md:p-6">
                    <div className="max-w-5xl mx-auto flex justify-end">
                        <button
                            onClick={handleGenerate}
                            disabled={!storyText.trim()}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            <Wand2 className="w-4 h-4" />
                            Generate Storyboard
                        </button>
                    </div>
                </footer>
            )}

            {/* Save Modal */}
            <Modal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title="Save Your Story"
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Give your story a name to save to your library.
                    </p>
                    <input
                        type="text"
                        value={storyName}
                        onChange={(e) => setStoryName(e.target.value)}
                        placeholder="e.g., The Last Horizon"
                        className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                        autoFocus
                    />
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={() => setIsSaveModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!storyName.trim() || isSaving}
                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Story'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
