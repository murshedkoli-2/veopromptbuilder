import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { PromptState, initialPromptState } from '@/types/wizard';

interface StoryGenerationStepProps {
    storyText: string;
    videoStyle?: string;
    audioStyle?: string;
    voiceStyle?: string;
    dialogueLanguage?: string;
    onComplete: (scenes: PromptState[]) => void;
}

export default function StoryGenerationStep({
    storyText,
    videoStyle = 'Cinematic',
    audioStyle = 'Immersive',
    voiceStyle = 'Character Dialogue',
    dialogueLanguage = 'English',
    onComplete
}: StoryGenerationStepProps) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Analyzing story structure...');

    useEffect(() => {
        const phases = [
            { p: 10, s: 'Analyzing story structure...' },
            { p: 30, s: `Applying ${videoStyle} visual style...` },
            { p: 50, s: 'Splitting into scenes...' },
            { p: 70, s: `Designing ${audioStyle} soundscape...` },
            { p: 85, s: `Optimizing for ${voiceStyle} (${dialogueLanguage})...` },
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
        // 1. Initial Split by Paragraphs
        const paragraphs = storyText.split(/\n\s*\n/).filter(s => s.trim().length > 0);

        // 2. Smart Segmentation for <8s limit (approx 20 words max)
        const rawScenes: string[] = [];
        const MAX_WORDS_PER_SCENE = 20;

        paragraphs.forEach(para => {
            const words = para.split(/\s+/).filter(w => w.length > 0);
            if (words.length <= MAX_WORDS_PER_SCENE) {
                rawScenes.push(para.trim());
            } else {
                // Split by sentences if too long
                const sentences = para.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [para];
                let currentChunk = "";

                sentences.forEach(sentence => {
                    const cleanSentence = sentence.trim();
                    if (!cleanSentence) return;

                    const currentLen = currentChunk.split(/\s+/).length;
                    const sentenceLen = cleanSentence.split(/\s+/).length;

                    if (currentLen + sentenceLen <= MAX_WORDS_PER_SCENE) {
                        currentChunk += (currentChunk ? " " : "") + cleanSentence;
                    } else {
                        if (currentChunk) rawScenes.push(currentChunk);
                        currentChunk = cleanSentence;
                    }
                });
                if (currentChunk) rawScenes.push(currentChunk);
            }
        });

        const generatedScenes: PromptState[] = rawScenes.map(text => {
            const state = JSON.parse(JSON.stringify(initialPromptState)); // Deep copy
            const lower = text.toLowerCase();
            const words = text.split(/\s+/).length;

            state.scene.envDescription = text.trim();

            // --- Apply User Preferences ---
            state.technical.realismLevel = videoStyle; // e.g. "Anime", "Cinematic"
            state.dialogue.ambience = `${audioStyle}, ${voiceStyle}`; // e.g. "Sci-Fi FX, Voiceover"
            state.dialogue.language = dialogueLanguage;

            // Adjust framing based on voice style
            if (voiceStyle === 'Character Dialogue') {
                // Prefer closer shots for Lip Sync visibility
                state.camera.notes = `Ensure characters face camera for dialogue. Language: ${dialogueLanguage}`;
                state.dialogue.style = `Spoken in ${dialogueLanguage}`;
            } else if (voiceStyle === 'Voiceover') {
                state.camera.notes = 'Focus on environment and action';
                state.dialogue.style = `Voiceover in ${dialogueLanguage}`;
            }

            // --- Duration Estimation (<8s for Veo 3) ---
            const durationSec = Math.max(4, Math.min(8, Math.ceil(words / 2.5)));
            state.technical.duration = `${durationSec}s`;

            // --- Time of Day ---
            if (/\b(night|midnight|dark|moon|stars)\b/.test(lower)) {
                state.scene.timeOfDay = 'Night';
                state.emotion.colorGrade = 'Cool High Contrast';
            } else if (/\b(sunrise|dawn|early morning)\b/.test(lower)) {
                state.scene.timeOfDay = 'Dawn';
                state.emotion.colorGrade = 'Warm Soft';
            } else if (/\b(sunset|dusk|twilight|evening)\b/.test(lower)) {
                state.scene.timeOfDay = 'Golden Hour';
                state.emotion.colorGrade = 'Golden Warmth';
            } else if (/\b(noon|midday|bright|sunny)\b/.test(lower)) {
                state.scene.timeOfDay = 'Midday';
                state.emotion.colorGrade = 'High Key';
            } else {
                state.scene.timeOfDay = 'Day';
                state.emotion.colorGrade = 'Natural';
            }

            // --- Location ---
            if (/\b(interior|inside|room|hall|kitchen|bedroom|office)\b/.test(lower)) {
                state.scene.location = 'Interior';
            } else if (/\b(exterior|outside|street|park|forest|city|mountain|sky)\b/.test(lower)) {
                state.scene.location = 'Exterior';
            } else {
                state.scene.location = 'Cinematic Environment';
            }

            // --- Camera Movement & Shot Type ---
            if (/\b(run|running|chase|fleeing|fast|sprint)\b/.test(lower)) {
                state.camera.movement = 'Tracking Shot';
                state.camera.shotType = 'Wide Shot';
                state.camera.lensStyle = '35mm Anamorphic';
            } else if (/\b(walk|walking|stroll|enter|slowly)\b/.test(lower)) {
                state.camera.movement = 'Slow Dolly';
                state.camera.shotType = 'Medium Shot';
            } else if (/\b(look|looking|stare|gaze|face|eyes)\b/.test(lower)) {
                state.camera.movement = 'Static';
                state.camera.shotType = 'Close Up';
                state.camera.lensStyle = '85mm Portrait';
            } else if (/\b(fight|battle|punch|hit|chaos)\b/.test(lower)) {
                state.camera.movement = 'Handheld';
                state.camera.shotType = 'Medium Close Up';
                state.camera.notes = 'High shutter speed';
            } else if (/\b(sky|city|landscape|world|over|above)\b/.test(lower)) {
                state.camera.movement = 'Aerial Drone';
                state.camera.shotType = 'Extreme Wide';
            } else {
                state.camera.movement = 'Cinematic Pan';
                state.camera.shotType = 'Medium Shot';
            }

            // Voice Style Override for Shot Type
            if (voiceStyle === 'Character Dialogue' && !['Close Up', 'Medium Close Up'].includes(state.camera.shotType)) {
                // Suggest closer shots if dialogue is key, but don't force override if it's an action scene (like 'run') unless necessary
                if (!/\b(run|chase|fight)\b/.test(lower)) {
                    state.camera.shotType = 'Medium Close Up';
                }
            }

            // --- Emotion & Mood ---
            if (/\b(sad|cry|tears|lonely|alone|grief|loss)\b/.test(lower)) {
                state.emotion.mood = 'Melancholic';
                state.emotion.pacing = 'Slow';
            } else if (/\b(happy|laugh|joy|smile|celebrate|fun)\b/.test(lower)) {
                state.emotion.mood = 'Joyful';
                state.emotion.pacing = 'Upbeat';
            } else if (/\b(fear|scared|terror|hiding|danger|darkness)\b/.test(lower)) {
                state.emotion.mood = 'Tense';
                state.emotion.pacing = 'Fast';
            } else if (/\b(love|kiss|hug|romantic|tender)\b/.test(lower)) {
                state.emotion.mood = 'Romantic';
                state.emotion.pacing = 'Gentle';
                state.emotion.colorGrade = 'Soft Dreamy';
            } else {
                state.emotion.mood = 'Dramatic';
                state.emotion.pacing = 'Medium';
            }

            // --- Character Estimation ---
            const properNouns = text.match(/[A-Z][a-z]+/g) || [];
            const commonWords = ['The', 'A', 'An', 'It', 'She', 'He', 'They', 'We', 'In', 'On', 'At', 'Then', 'But'];
            const likelyNames = [...new Set(properNouns.filter(w => !commonWords.includes(w)))];

            if (likelyNames.length > 0) {
                state.characters.count = likelyNames.length;
                state.characters.role = likelyNames.join(', ');
            } else {
                state.characters.count = 1;
                state.characters.role = 'Protagonist';
            }

            state.technical.resolution = '4k';

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
