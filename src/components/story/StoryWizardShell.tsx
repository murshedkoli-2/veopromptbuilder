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

    // Style & Audio Preferences
    const [videoStyle, setVideoStyle] = useState('Cinematic');
    const [audioStyle, setAudioStyle] = useState('Immersive');
    const [voiceStyle, setVoiceStyle] = useState('Character Dialogue'); // 'Character Dialogue' | 'Voiceover' | 'No Speech'
    const [dialogueLanguage, setDialogueLanguage] = useState('English');

    const handleGenerate = () => {
        if (!storyText.trim()) return;
        setGeneratedScenes([]); // Clear previous scenes
        setStep(1); // Go to generation
    };

    const handleGenerationComplete = async (scenes: PromptState[]) => {
        setGeneratedScenes(scenes);
        setStep(2); // Go to review

        // Auto-Save Logic
        const timestamp = new Date().toLocaleString();
        const shortName = storyText.split(' ').slice(0, 3).join(' ') || 'Untitled Story';
        const autoName = `${shortName} (${timestamp})`;

        // We don't block the UI for this, just fire and forget (or could show a toast)
        await saveStory(autoName, storyText.substring(0, 100) + '...', scenes);
        // Optional: Notify user via UI if toast component exists
    };

    const handleSave = async () => {
        if (!storyName.trim()) return;
        setIsSaving(true);
        // Update the existing auto-saved story instead of creating new? 
        // For now, simpler to just allow saving a "named" copy or updating metadata if we had the ID.
        // Since `saveStory` creates a NEW entry currently in WizardProvider, this will create a duplicate.
        // That's acceptable for "Save As" behavior. 
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
                        videoStyle={videoStyle}
                        setVideoStyle={setVideoStyle}
                        audioStyle={audioStyle}
                        setAudioStyle={setAudioStyle}
                        voiceStyle={voiceStyle}
                        setVoiceStyle={setVoiceStyle}
                        dialogueLanguage={dialogueLanguage}
                        setDialogueLanguage={setDialogueLanguage}
                    />
                )}
                {step === 1 && (
                    <StoryGenerationStep
                        storyText={storyText}
                        videoStyle={videoStyle}
                        audioStyle={audioStyle}
                        voiceStyle={voiceStyle}
                        dialogueLanguage={dialogueLanguage}
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
