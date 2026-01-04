'use client';

import React, { useState } from 'react';
import WizardShell from '@/components/wizard/WizardShell';
import SceneStep from '@/components/wizard/steps/SceneStep';
import CharacterStep from '@/components/wizard/steps/CharacterStep';
import CameraStep from '@/components/wizard/steps/CameraStep';
import EmotionStep from '@/components/wizard/steps/EmotionStep';
import DialogueStep from '@/components/wizard/steps/DialogueStep';
import TechnicalStep from '@/components/wizard/steps/TechnicalStep';
import { useWizard } from '@/components/wizard/WizardProvider';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const { currentStep } = useWizard();
  const [started, setStarted] = useState(false);

  if (!started) {
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
        <button
          onClick={() => setStarted(true)}
          className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
        >
          Start Building
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <SceneStep />;
      case 1: return <CharacterStep />;
      case 2: return <CameraStep />;
      case 3: return <EmotionStep />;
      case 4: return <DialogueStep />;
      case 5: return <TechnicalStep />;
      default: return <SceneStep />;
    }
  };

  return (
    <WizardShell>
      {renderStep()}
    </WizardShell>
  );
}
