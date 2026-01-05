import React, { useState } from 'react';
import { PromptState } from '@/types/wizard';
import { Video, Copy, Check } from 'lucide-react';

interface StoryboardStepProps {
    scenes: PromptState[];
    updateScene: (index: number, updates: Partial<PromptState>) => void;
}

export default function StoryboardStep({ scenes, updateScene }: StoryboardStepProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const constructVideoPrompt = (scene: PromptState) => {
        // Construct a Veo-optimized prompt
        // Format: [Shot Type] of [Subject/Action], [Environment], [Lighting], [Mood], [Camera Movement], [Technical]

        const parts = [
            `${scene.camera.shotType || 'Cinematic shot'} of ${scene.scene.envDescription}`,
            `${scene.scene.location}, ${scene.scene.timeOfDay}`,
            `${scene.emotion.colorGrade} lighting`,
            `${scene.emotion.mood} atmosphere`,
            `${scene.camera.movement} camera movement`,
            `${scene.technical.realismLevel}, ${scene.technical.resolution}`
        ];

        return parts.filter(p => !p.includes('undefined') && !p.includes('Unknown')).join(', ');
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 mb-4">
                <h2 className="text-2xl font-bold">Review Storyboard</h2>
                <p className="text-muted-foreground">
                    We've generated {scenes.length} scenes. Review the video prompts below.
                </p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
                {scenes.map((scene, index) => {
                    const videoPrompt = constructVideoPrompt(scene);

                    return (
                        <div key={index} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                                    {index + 1}
                                </div>
                                <h3 className="font-semibold text-lg flex-1">
                                    Scene {index + 1}
                                </h3>
                                <div className="flex gap-2">
                                    <span className="text-xs px-2 py-1 bg-secondary rounded text-muted-foreground">
                                        {scene.scene.timeOfDay || 'Day'}
                                    </span>
                                    <span className="text-xs px-2 py-1 bg-secondary rounded text-muted-foreground">
                                        {scene.camera.movement || 'Static'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Visual Prompt Section */}
                                <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Video className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">AI Video Prompt</span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(videoPrompt, index)}
                                            className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            {copiedIndex === index ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-sm leading-relaxed font-mono text-muted-foreground select-all">
                                        {videoPrompt}
                                    </p>
                                </div>

                                {/* Editor / Details (Collapsible or just visible) */}
                                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                    <div>
                                        <span className="font-semibold block text-foreground/80 mb-1">Environment</span>
                                        {scene.scene.envDescription}
                                    </div>
                                    <div>
                                        <span className="font-semibold block text-foreground/80 mb-1">Mood</span>
                                        {scene.emotion.mood}, {scene.emotion.colorGrade}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
