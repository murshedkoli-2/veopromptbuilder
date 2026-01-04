'use client';

import React from 'react';
import { useWizard } from '../WizardProvider';
import { OPTIONS } from '@/constants/options';
import { StepCard, FormGroup, Select, Textarea } from '@/components/ui/FormControls';

export default function EmotionStep() {
    const { state, updateState, t } = useWizard();
    const { emotion } = state;

    const handleChange = (field: keyof typeof emotion, value: string) => {
        updateState('emotion', { [field]: value });
    };

    return (
        <StepCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label={t('mood')}>
                    <Select
                        options={OPTIONS.mood}
                        value={emotion.mood}
                        onChange={(val) => handleChange('mood', val)}
                    />
                </FormGroup>

                <FormGroup label={t('pacing')}>
                    <Select
                        options={OPTIONS.pacing}
                        value={emotion.pacing}
                        onChange={(val) => handleChange('pacing', val)}
                    />
                </FormGroup>

                <FormGroup label={t('colorGrade')}>
                    <Select
                        options={OPTIONS.colorGrade}
                        value={emotion.colorGrade}
                        onChange={(val) => handleChange('colorGrade', val)}
                    />
                </FormGroup>
            </div>

            <FormGroup label={t('emotionalNuance')}>
                <Textarea
                    value={emotion.nuance}
                    onChange={(val) => handleChange('nuance', val)}
                    placeholder={t('emotionalNuancePlaceholder')}
                />
            </FormGroup>
        </StepCard>
    );
}
