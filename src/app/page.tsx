'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Film, BookOpen, Users } from 'lucide-react';
import { useWizard } from '@/components/wizard/WizardProvider';

export default function Home() {
  const { t } = useWizard();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
        Veo 3 <span className="text-muted-foreground">Prompt Builder</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
        Craft high-quality cinematic video prompts with a guided wizard.
        Perfect for local storytellers, creators, and prompt engineers.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/builder"
          className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
        >
          Start Building
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/story"
          className="group flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-semibold text-lg hover:bg-accent/80 transition-all hover:scale-105 active:scale-95"
        >
          <BookOpen className="w-5 h-5" />
          Story Builder
        </Link>

        <Link
          href="/character"
          className="group flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-lg hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
        >
          <Users className="w-5 h-5" />
          Character
        </Link>

        <Link
          href="/library"
          className="group flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-lg hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
        >
          <Film className="w-5 h-5" />
          Library
        </Link>
      </div>
    </div>
  );
}
