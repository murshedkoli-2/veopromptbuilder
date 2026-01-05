'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/wizard/WizardProvider';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateCharacterPage() {
    const router = useRouter();
    const { updateState, saveCharacter } = useWizard();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            alert("Please give your character a name.");
            return;
        }

        setIsSaving(true);

        // Update state with minimal info
        updateState('characters', {
            description,
            // Keep others empty/default
            role: '',
            attire: '',
            ageGroup: '',
            emotions: '',
            props: '',
            count: 1
        });

        await saveCharacter(name);

        setIsSaving(false);
        router.push('/character');
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 flex justify-center">
            <div className="w-full max-w-2xl">
                <div className="mb-8">
                    <Link
                        href="/character"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Library
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Create Character</h1>
                    <p className="text-muted-foreground mt-2">Define your character for AI video generation.</p>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    {/* Name */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Character Name <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Cyberpunk Detective"
                            className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
                        />
                    </div>

                    {/* Character Prompt (Description) */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Character Prompt
                        </label>
                        <p className="text-xs text-muted-foreground">Describe appearance, clothing, age, and style.</p>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="e.g. A weathered detective in a neon-lit trench coat, mid-40s, scowling expression, holding a datapad. Cyberpunk aesthetic."
                            className="w-full p-4 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all h-64 resize-none leading-relaxed"
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handleSave}
                            disabled={!name.trim() || isSaving}
                            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {isSaving ? 'Saving...' : 'Save Character'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
