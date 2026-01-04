'use client';

import React from 'react';
import { useWizard } from '../WizardProvider';
import { OPTIONS } from '@/constants/options';
import { StepCard, FormGroup, Select, Textarea } from '@/components/ui/FormControls';

export default function DialogueStep() {
    const { state, updateState, t } = useWizard();
    const { dialogue } = state;

    const handleChange = (field: keyof typeof dialogue, value: string) => {
        updateState('dialogue', { [field]: value });
    };

    return (
        <StepCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label={t('language')}>
                    <Select
                        options={OPTIONS.language}
                        value={dialogue.language}
                        onChange={(val) => handleChange('language', val)}
                    />
                </FormGroup>

                <FormGroup label={t('deliveryStyle')}>
                    <Select
                        options={OPTIONS.deliveryStyle}
                        value={dialogue.style}
                        onChange={(val) => handleChange('style', val)}
                    />
                </FormGroup>
            </div>

            <FormGroup label={t('sampleLines')}>
                <Textarea
                    value={dialogue.lines}
                    onChange={(val) => handleChange('lines', val)}
                    placeholder={t('sampleLinesPlaceholder')}
                />
            </FormGroup>

            <FormGroup label={t('ambientSounds')}>
                <Textarea
                    value={dialogue.ambience}
                    onChange={(val) => handleChange('ambience', val)}
                    placeholder={t('ambientSoundsPlaceholder')}
                />
            </FormGroup>
        </StepCard>
    );
}
