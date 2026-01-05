import React from 'react';
import { PenTool } from 'lucide-react';

interface StoryInputStepProps {
    storyText: string;
    setStoryText: (text: string) => void;
}

export default function StoryInputStep({ storyText, setStoryText }: StoryInputStepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

            <div className="max-w-3xl mx-auto">
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
        </div>
    );
}
