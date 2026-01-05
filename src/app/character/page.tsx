'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWizard } from '@/components/wizard/WizardProvider';
import { ArrowLeft, Users, Plus, Trash2, Calendar, User, Wand2, Copy, Check, Loader2, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import { SavedCharacter } from '@/types/wizard';

export default function CharacterLibraryPage() {
    const { savedCharacters, deleteCharacter } = useWizard();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    // Generator State - Enhanced
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [selectedChar, setSelectedChar] = useState<SavedCharacter | null>(null);
    const [scenario, setScenario] = useState('');
    const [dialogue, setDialogue] = useState('');
    const [mood, setMood] = useState('Neutral');
    const [tone, setTone] = useState('Dramatic');
    const [cameraMovement, setCameraMovement] = useState('Static');
    const [lighting, setLighting] = useState('Natural');
    const [shotType, setShotType] = useState('Medium Shot');
    const [dialogueLanguage, setDialogueLanguage] = useState('English');
    const [generatedResult, setGeneratedResult] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this character?')) {
            deleteCharacter(id);
        }
    };

    const handleCreateNew = () => {
        router.push('/character/create');
    };

    const handleOpenGenerator = (e: React.MouseEvent, char: SavedCharacter) => {
        e.stopPropagation();
        setSelectedChar(char);
        setIsGeneratorOpen(true);
        setScenario('');
        setDialogue('');
        setMood('Neutral');
        setTone('Dramatic');
        setCameraMovement('Static');
        setLighting('Natural');
        setShotType('Medium Shot');
        setDialogueLanguage('English');
        setGeneratedResult('');
    };

    const handleGenerate = () => {
        if (!selectedChar || !scenario.trim()) return;

        setIsGenerating(true);

        // Enhanced Generation Logic
        setTimeout(() => {
            const parts = [];

            // Character description
            parts.push(selectedChar.data.description || selectedChar.name);

            // Scenario
            parts.push(`\n\nScene: ${scenario}`);

            // Dialogue (if provided)
            if (dialogue.trim()) {
                parts.push(`\n\nDialogue (${dialogueLanguage}): "${dialogue}"`);
            }

            // Mood and Tone
            parts.push(`\n\nMood: ${mood}, Tone: ${tone}`);

            // Camera settings
            parts.push(`\nCamera: ${shotType}, ${cameraMovement}`);

            // Lighting
            parts.push(`\nLighting: ${lighting}`);

            // Technical specs
            parts.push(`\n\nCinematic, 8k resolution, photorealistic.`);

            const prompt = parts.join('');

            setGeneratedResult(prompt);
            setIsGenerating(false);
        }, 1200);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredChars = (savedCharacters || []).filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.data.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Character Library</h1>
                        <p className="text-muted-foreground mt-2">Manage your cast of characters.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search characters..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 p-3 pl-4 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Create Character
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {(!savedCharacters || savedCharacters.length === 0) ? (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/30">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No characters yet</h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            Design your first character to use in your stories.
                        </p>
                        <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create Character
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChars.map((char) => (
                            <div
                                key={char.id}
                                className="group relative bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent-foreground group-hover:scale-110 transition-transform">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/character/edit/${char.id}`);
                                            }}
                                            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
                                            title="Edit Character"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => handleOpenGenerator(e, char)}
                                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                                            title="Generate Scene"
                                        >
                                            <Wand2 className="w-4 h-4" />
                                        </button>
                                        {/* Delete button disabled
                                        <button
                                            onClick={(e) => handleDelete(e, char.id)}
                                            className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                            title="Delete Character"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        */}
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                    {char.name}
                                </h3>

                                <div className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[4.5em] flex-1">
                                    {char.data.description || 'No prompt description provided.'}
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(char.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Enhanced Generator Modal */}
            <Modal
                isOpen={isGeneratorOpen}
                onClose={() => setIsGeneratorOpen(false)}
                title={`Generate Scene with ${selectedChar?.name}`}
            >
                <div className="space-y-5">
                    {/* Scenario */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                            Scene Description <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            value={scenario}
                            onChange={(e) => setScenario(e.target.value)}
                            placeholder="e.g. Walking through a neon-lit cyberpunk city at night"
                            className="w-full p-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none text-sm"
                        />
                    </div>

                    {/* Dialogue */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                            Dialogue (Optional)
                        </label>
                        <textarea
                            value={dialogue}
                            onChange={(e) => setDialogue(e.target.value)}
                            placeholder='e.g. "This city never sleeps..."'
                            className="w-full p-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none h-16 resize-none text-sm"
                        />
                        {dialogue.trim() && (
                            <div className="pt-1">
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Language</label>
                                <select
                                    value={dialogueLanguage}
                                    onChange={(e) => setDialogueLanguage(e.target.value)}
                                    className="w-full p-2 rounded-lg bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                                >
                                    <option value="English">English</option>
                                    <option value="Bengali">Bengali</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                    <option value="Japanese">Japanese</option>
                                    <option value="Korean">Korean</option>
                                    <option value="Chinese">Chinese</option>
                                    <option value="Arabic">Arabic</option>
                                    <option value="Russian">Russian</option>
                                    <option value="Portuguese">Portuguese</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Mood and Tone Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Mood</label>
                            <select
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                className="w-full p-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                            >
                                <option value="Neutral">Neutral</option>
                                <option value="Joyful">Joyful</option>
                                <option value="Melancholic">Melancholic</option>
                                <option value="Tense">Tense</option>
                                <option value="Mysterious">Mysterious</option>
                                <option value="Romantic">Romantic</option>
                                <option value="Energetic">Energetic</option>
                                <option value="Somber">Somber</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Tone</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full p-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                            >
                                <option value="Dramatic">Dramatic</option>
                                <option value="Comedic">Comedic</option>
                                <option value="Suspenseful">Suspenseful</option>
                                <option value="Action-Packed">Action-Packed</option>
                                <option value="Intimate">Intimate</option>
                                <option value="Epic">Epic</option>
                                <option value="Horror">Horror</option>
                            </select>
                        </div>
                    </div>

                    {/* Shot Type and Camera Movement */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Shot Type</label>
                            <select
                                value={shotType}
                                onChange={(e) => setShotType(e.target.value)}
                                className="w-full p-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                            >
                                <option value="Wide Shot">Wide Shot</option>
                                <option value="Medium Shot">Medium Shot</option>
                                <option value="Close-Up">Close-Up</option>
                                <option value="Extreme Close-Up">Extreme Close-Up</option>
                                <option value="Over-the-Shoulder">Over-the-Shoulder</option>
                                <option value="POV">POV (Point of View)</option>
                                <option value="Bird's Eye">Bird's Eye</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Camera Movement</label>
                            <select
                                value={cameraMovement}
                                onChange={(e) => setCameraMovement(e.target.value)}
                                className="w-full p-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                            >
                                <option value="Static">Static</option>
                                <option value="Slow Pan">Slow Pan</option>
                                <option value="Tracking Shot">Tracking Shot</option>
                                <option value="Dolly In">Dolly In</option>
                                <option value="Dolly Out">Dolly Out</option>
                                <option value="Handheld">Handheld</option>
                                <option value="Aerial">Aerial</option>
                                <option value="Crane">Crane</option>
                                <option value="Steadicam">Steadicam</option>
                            </select>
                        </div>
                    </div>

                    {/* Lighting */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Lighting</label>
                        <select
                            value={lighting}
                            onChange={(e) => setLighting(e.target.value)}
                            className="w-full p-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                        >
                            <option value="Natural">Natural Daylight</option>
                            <option value="Cinematic">Cinematic</option>
                            <option value="Dark/Moody">Dark/Moody</option>
                            <option value="Golden Hour">Golden Hour</option>
                            <option value="Blue Hour">Blue Hour</option>
                            <option value="Neon/Cyberpunk">Neon/Cyberpunk</option>
                            <option value="Soft/Diffused">Soft/Diffused</option>
                            <option value="High Contrast">High Contrast</option>
                            <option value="Volumetric">Volumetric/God Rays</option>
                            <option value="Moonlight">Moonlight</option>
                        </select>
                    </div>

                    {!generatedResult ? (
                        <button
                            onClick={handleGenerate}
                            disabled={!scenario.trim() || isGenerating}
                            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating prompt...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4" />
                                    Generate Scene Prompt
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 relative group">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                                    Generated Video Prompt
                                </label>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                                    {generatedResult}
                                </p>
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-lg border border-border hover:border-primary/50 transition-colors"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    setGeneratedResult('');
                                    setScenario('');
                                    setDialogue('');
                                }}
                                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Generate Another
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
