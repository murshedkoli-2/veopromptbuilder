'use client';

import React, { useEffect } from 'react';
import WizardShell from '@/components/wizard/WizardShell';
import SceneStep from '@/components/wizard/steps/SceneStep';
import CharacterStep from '@/components/wizard/steps/CharacterStep';
import CameraStep from '@/components/wizard/steps/CameraStep';
import EmotionStep from '@/components/wizard/steps/EmotionStep';
import DialogueStep from '@/components/wizard/steps/DialogueStep';
import TechnicalStep from '@/components/wizard/steps/TechnicalStep';
import { useWizard } from '@/components/wizard/WizardProvider';

export default function BuilderPage() {
    const { currentStep } = useWizard();

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
