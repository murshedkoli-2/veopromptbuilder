import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { PromptState, initialPromptState } from '@/types/wizard';

interface StoryGenerationStepProps {
    storyText: string;
    onComplete: (scenes: PromptState[]) => void;
}

export default function StoryGenerationStep({ storyText, onComplete }: StoryGenerationStepProps) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Analyzing story structure...');

    useEffect(() => {
        // Mock Generation Process
        const phases = [
            { p: 10, s: 'Analyzing story structure...' },
            { p: 30, s: 'Identifying characters...' },
            { p: 50, s: 'Splitting into scenes...' },
            { p: 70, s: 'Generating visual prompts...' },
            { p: 90, s: 'Polishing details...' },
            { p: 100, s: 'Done!' }
        ];

        let currentPhase = 0;

        const interval = setInterval(() => {
            if (currentPhase >= phases.length) {
                clearInterval(interval);
                generateScenes();
                return;
            }

            const phase = phases[currentPhase];
            setProgress(phase.p);
            setStatus(phase.s);
            currentPhase++;
        }, 800);

        return () => clearInterval(interval);
    }, []);

    const generateScenes = () => {
        // Simple heuristic parser
        // 1. Split by double newlines or periods followed by newlines
        const rawScenes = storyText.split(/\n\s*\n/).filter(s => s.trim().length > 0);

        const generatedScenes: PromptState[] = rawScenes.map(text => {
            const state = JSON.parse(JSON.stringify(initialPromptState)); // Deep copy
            const lower = text.toLowerCase();
            state.scene.envDescription = text.trim();

            // --- Time & Lighting ---
            if (lower.includes('night') || lower.includes('dark') || lower.includes('moon')) {
                state.scene.timeOfDay = 'Night';
                state.emotion.colorGrade = 'Cool High Contrast';
            } else if (lower.includes('sunrise') || lower.includes('dawn')) {
                state.scene.timeOfDay = 'Dawn';
                state.emotion.colorGrade = 'Warm Soft';
            } else if (lower.includes('sunset') || lower.includes('dusk') || lower.includes('golden')) {
                state.scene.timeOfDay = 'Golden Hour';
                state.emotion.colorGrade = 'Golden Warmth';
            } else {
                state.scene.timeOfDay = 'Day';
                state.emotion.colorGrade = 'Natural';
            }

            // --- Location ---
            if (lower.includes('interior') || lower.includes('inside') || lower.includes('room')) {
                state.scene.location = 'Interior';
            } else if (lower.includes('exterior') || lower.includes('outside') || lower.includes('street') || lower.includes('sky')) {
                state.scene.location = 'Exterior';
            } else {
                state.scene.location = 'Unknown';
            }

            // --- Camera Movement ---
            if (lower.includes('run') || lower.includes('chase') || lower.includes('fast')) {
                state.camera.movement = 'Tracking Shot';
                state.camera.lensStyle = 'Wide Angle';
            } else if (lower.includes('walk') || lower.includes('enter') || lower.includes('slow')) {
                state.camera.movement = 'Slow Dolly';
                state.camera.lensStyle = 'Standard';
            } else if (lower.includes('sky') || lower.includes('city') || lower.includes('large')) {
                state.camera.movement = 'Aerial Drone';
                state.camera.lensStyle = 'Wide Angle';
            } else if (lower.includes('look') || lower.includes('face') || lower.includes('eye')) {
                state.camera.movement = 'Static';
                state.camera.shotType = 'Close Up';
                state.camera.lensStyle = 'Portrait (85mm)';
            } else {
                state.camera.movement = 'Handheld';
                state.camera.shotType = 'Medium Shot';
            }

            // --- Emotion ---
            if (lower.includes('sad') || lower.includes('cry') || lower.includes('alone')) {
                state.emotion.mood = 'Melancholic';
                state.emotion.pacing = 'Slow';
            } else if (lower.includes('happy') || lower.includes('laugh') || lower.includes('joy')) {
                state.emotion.mood = 'Joyful';
                state.emotion.pacing = 'Upbeat';
            } else if (lower.includes('fear') || lower.includes('scared') || lower.includes('dark')) {
                state.emotion.mood = 'Tense';
                state.emotion.pacing = 'Fast';
            } else {
                state.emotion.mood = 'Neutral';
            }

            // Characters (Mock)
            state.characters.count = 1;
            state.characters.role = 'Main Character';
            state.technical.resolution = '4k';
            state.technical.realismLevel = 'Photorealistic';

            return state;
        });

        // Delay slightly for effect
        setTimeout(() => {
            onComplete(generatedScenes);
        }, 500);
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="relative mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                    <BrainCircuit className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-yellow-500 animate-bounce" />
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Generating Storyboard</h2>
            <p className="text-muted-foreground mb-8 text-center min-w-[200px]">{status}</p>

            <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
