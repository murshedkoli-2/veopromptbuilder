import React, { useState } from 'react';
import { PromptState } from '@/types/wizard';
import { Video, Copy, Check, Clock, Edit2, ChevronUp, Layers, Image as ImageIcon, Film, Code, FileText } from 'lucide-react';

interface StoryboardStepProps {
    scenes: PromptState[];
    updateScene: (index: number, updates: Partial<PromptState>) => void;
}

type PromptType = 'video' | 'image' | 'video-from-image';
type FormatType = 'text' | 'json';

export default function StoryboardStep({ scenes, updateScene }: StoryboardStepProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [allCopied, setAllCopied] = useState(false);

    // Global toggles for convenience
    const [activeTab, setActiveTab] = useState<PromptType>('video');
    const [activeFormat, setActiveFormat] = useState<FormatType>('text');

    const constructPrompt = (scene: PromptState, type: PromptType, format: FormatType) => {
        let content = '';

        if (type === 'video') {
            const parts = [
                `${scene.camera.shotType || 'Cinematic shot'} of ${scene.scene.envDescription}`,
                `${scene.scene.location}, ${scene.scene.timeOfDay}`,
                `${scene.emotion.colorGrade} lighting`,
                `${scene.emotion.mood} atmosphere`,
                `${scene.camera.movement} camera movement`,
                `${scene.technical.realismLevel}, ${scene.technical.resolution}`
            ];
            content = parts.filter(p => !p.includes('undefined') && !p.includes('Unknown') && p.trim() !== '').join(', ');
        }
        else if (type === 'image') {
            // optimized for Midjourney / Flux
            content = `/imagine prompt: ${scene.camera.shotType || 'Cinematic shot'} of ${scene.scene.envDescription}, ${scene.scene.location}, ${scene.scene.timeOfDay}, ${scene.emotion.colorGrade}, ${scene.emotion.mood}, highly detailed, photorealistic, 8k --ar 16:9 --v 6.0`;
        }
        else if (type === 'video-from-image') {
            // optimized for Runway/Pika (Motion focused)
            content = `Motion: ${scene.camera.movement}, ${scene.emotion.pacing} pace. Atmosphere: ${scene.emotion.mood}. Action: ${scene.scene.envDescription}`;
        }

        if (format === 'json') {
            return JSON.stringify({
                prompt: content,
                negative_prompt: "text, watermark, blur, deformed, low quality",
                parameters: {
                    aspect_ratio: "16:9",
                    resolution: scene.technical.resolution
                }
            }, null, 2);
        }

        return content;
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = () => {
        const allPrompts = scenes.map((s, i) => {
            const p = constructPrompt(s, activeTab, activeFormat);
            return activeFormat === 'json' ? p : `Scene ${i + 1} (${s.technical.duration || '4s'}): ${p}`;
        }).join(activeFormat === 'json' ? ',\n' : '\n\n');

        const finalContent = activeFormat === 'json' ? `[\n${allPrompts}\n]` : allPrompts;

        navigator.clipboard.writeText(finalContent);
        setAllCopied(true);
        setTimeout(() => setAllCopied(false), 2000);
    };

    const toggleEdit = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header / Global Controls */}
            <div className="flex flex-col gap-6 mb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold">Review Storyboard</h2>
                        <p className="text-muted-foreground text-sm">
                            {scenes.length} scenes generated • Total est. duration: {scenes.reduce((acc, s) => acc + (parseInt(s.technical.duration || '4') || 4), 0)}s
                        </p>
                    </div>
                    <button
                        onClick={handleCopyAll}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
                    >
                        {allCopied ? <Check className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                        {allCopied ? 'All Copied!' : `Copy All (${activeFormat.toUpperCase()})`}
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card border border-border p-2 rounded-xl">
                    <div className="flex bg-secondary/50 p-1 rounded-lg">
                        {[
                            { id: 'video', label: 'Veo Prompt', icon: Video },
                            { id: 'image', label: 'Image Gen', icon: ImageIcon },
                            { id: 'video-from-image', label: 'Img2Video', icon: Film },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as PromptType)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex bg-secondary/50 p-1 rounded-lg">
                        {[
                            { id: 'text', label: 'Text', icon: FileText },
                            { id: 'json', label: 'JSON', icon: Code },
                        ].map((fmt) => (
                            <button
                                key={fmt.id}
                                onClick={() => setActiveFormat(fmt.id as FormatType)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeFormat === fmt.id ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <fmt.icon className="w-4 h-4" />
                                <span>{fmt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
                {scenes.map((scene, index) => {
                    const promptContent = constructPrompt(scene, activeTab, activeFormat);
                    const isEditing = expandedIndex === index;

                    return (
                        <div key={index} className="bg-card border border-border rounded-xl shadow-sm hover:border-primary/50 transition-all duration-300">
                            {/* Card Header */}
                            <div className="flex items-center gap-3 p-5 border-b border-border/50 bg-secondary/5">
                                <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center font-bold text-lg text-primary shadow-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-base">Scene {index + 1}</h3>
                                        {scene.technical.duration && (
                                            <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                <Clock className="w-3 h-3" />
                                                {scene.technical.duration}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                        <span>{scene.scene.timeOfDay}</span>
                                        <span>•</span>
                                        <span>{scene.camera.movement}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleEdit(index)}
                                    className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground'}`}
                                    title="Edit Details"
                                >
                                    {isEditing ? <ChevronUp className="w-5 h-5" /> : <Edit2 className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Prompt Content */}
                            <div className="p-5 space-y-4">
                                <div className="bg-secondary/30 rounded-xl p-4 border border-border/50 group relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-primary">
                                            {activeTab === 'image' ? <ImageIcon className="w-4 h-4" /> : activeTab === 'video-from-image' ? <Film className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                {activeTab === 'video' ? 'Veo Prompt' : activeTab === 'image' ? 'Image Prompt' : 'Motion Prompt'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(promptContent, index)}
                                            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border shadow-sm hover:bg-secondary transition-all active:scale-95 font-medium"
                                        >
                                            {copiedIndex === index ? (
                                                <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</>
                                            ) : (
                                                <><Copy className="w-3.5 h-3.5" /> Copy</>
                                            )}
                                        </button>
                                    </div>
                                    <pre className="text-sm leading-relaxed font-mono text-muted-foreground select-all bg-background/50 p-3 rounded-lg border border-border/30 whitespace-pre-wrap overflow-x-auto">
                                        {promptContent}
                                    </pre>
                                </div>

                                {/* Inline Editor */}
                                {isEditing && (
                                    <div className="pt-4 mt-4 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                                            <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
                                            <textarea
                                                value={scene.scene.envDescription}
                                                onChange={(e) => updateScene(index, { scene: { ...scene.scene, envDescription: e.target.value } })}
                                                className="w-full p-3 text-sm rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase text-muted-foreground">Time of Day</label>
                                            <select
                                                value={scene.scene.timeOfDay}
                                                onChange={(e) => updateScene(index, { scene: { ...scene.scene, timeOfDay: e.target.value } })}
                                                className="w-full p-2.5 text-sm rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                {['Day', 'Night', 'Dawn', 'Sunset', 'Golden Hour', 'Midday', 'Overcast'].map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase text-muted-foreground">Camera Movement</label>
                                            <select
                                                value={scene.camera.movement}
                                                onChange={(e) => updateScene(index, { camera: { ...scene.camera, movement: e.target.value } })}
                                                className="w-full p-2.5 text-sm rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                {['Static', 'Tracking Shot', 'Slow Dolly', 'Handheld', 'Aerial Drone', 'Cinematic Pan', 'Zoom In'].map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase text-muted-foreground">Mood</label>
                                            <select
                                                value={scene.emotion.mood}
                                                onChange={(e) => updateScene(index, { emotion: { ...scene.emotion, mood: e.target.value } })}
                                                className="w-full p-2.5 text-sm rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                {['Neutral', 'Joyful', 'Melancholic', 'Tense', 'Romantic', 'Dramatic', 'Mysterious', 'Dark'].map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold uppercase text-muted-foreground">Shot Type</label>
                                            <select
                                                value={scene.camera.shotType}
                                                onChange={(e) => updateScene(index, { camera: { ...scene.camera, shotType: e.target.value } })}
                                                className="w-full p-2.5 text-sm rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                {['Wide Shot', 'Medium Shot', 'Close Up', 'Extreme Close Up', 'Extreme Wide', 'Cowboy Shot'].map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
