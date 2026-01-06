import React from 'react';
import { PenTool, Film, Music, Mic, Globe } from 'lucide-react';

interface StoryInputStepProps {
    storyText: string;
    setStoryText: (text: string) => void;
    videoStyle: string;
    setVideoStyle: (style: string) => void;
    audioStyle: string;
    setAudioStyle: (style: string) => void;
    voiceStyle: string;
    setVoiceStyle: (style: string) => void;
    dialogueLanguage: string;
    setDialogueLanguage: (lang: string) => void;
}

const VIDEO_STYLES = [
    'Cinematic', 'Anime', '3D Animation', 'Vintage Film', 'Cyberpunk', 'Fantasy', 'Documentary', 'Noir'
];

const AUDIO_STYLES = [
    'Immersive', 'Cinematic Score', 'Nature Sounds', 'Urban Ambience', 'Sci-Fi FX', 'Horror/Tense', 'Upbeat', 'Silence'
];

const VOICE_STYLES = [
    'Character Dialogue', 'Voiceover', 'No Speech'
];

const LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Mandarin', 'Hindi', 'Bangla'
];

export default function StoryInputStep({
    storyText, setStoryText,
    videoStyle, setVideoStyle,
    audioStyle, setAudioStyle,
    voiceStyle, setVoiceStyle,
    dialogueLanguage, setDialogueLanguage
}: StoryInputStepProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary mb-4">
                    <PenTool className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Write Your Story</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Paste your screenplay, short story, or just a rough idea.
                    We'll separate it into scenes and generate prompts for you.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Story Input */}
                <div className="relative">
                    <textarea
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        placeholder="Once upon a time in a cybernetic city..."
                        className="w-full h-64 p-6 rounded-2xl bg-secondary/30 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-lg leading-relaxed"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
                        <span>Try to use paragraphs to separate distinct scenes.</span>
                        <span>{storyText.length} characters</span>
                    </div>
                </div>

                {/* Style Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Video Style */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Film className="w-4 h-4" />
                            Video Style
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {VIDEO_STYLES.map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setVideoStyle(style)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${videoStyle === style
                                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Audio Style */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Music className="w-4 h-4" />
                            Audio Atmosphere
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {AUDIO_STYLES.map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setAudioStyle(style)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${audioStyle === style
                                        ? 'bg-blue-500 text-white shadow-md scale-105'
                                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Voice Style */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Mic className="w-4 h-4" />
                            Audio Source
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {VOICE_STYLES.map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setVoiceStyle(style)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${voiceStyle === style
                                        ? 'bg-purple-500 text-white shadow-md scale-105'
                                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            Dialogue Language
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setDialogueLanguage(lang)}
                                    disabled={voiceStyle === 'No Speech'}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${voiceStyle === 'No Speech'
                                        ? 'opacity-50 cursor-not-allowed bg-secondary/30 text-muted-foreground/50'
                                        : dialogueLanguage === lang
                                            ? 'bg-orange-500 text-white shadow-md scale-105'
                                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
