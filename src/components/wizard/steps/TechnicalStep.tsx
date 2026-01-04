'use client';

import React from 'react';
import { useWizard } from '../WizardProvider';
import { OPTIONS } from '@/constants/options';
import { StepCard, FormGroup, Select, Textarea } from '@/components/ui/FormControls';

export default function TechnicalStep() {
    const { state, updateState, t } = useWizard();
    const { technical } = state;

    const handleChange = (field: keyof typeof technical, value: string) => {
        updateState('technical', { [field]: value });
    };

    return (
        <StepCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label={t('resolution')}>
                    <Select
                        options={OPTIONS.resolution}
                        value={technical.resolution}
                        onChange={(val) => handleChange('resolution', val)}
                    />
                </FormGroup>

                <FormGroup label={t('motionFidelity')}>
                    <Select
                        options={OPTIONS.motionFidelity}
                        value={technical.motionFidelity}
                        onChange={(val) => handleChange('motionFidelity', val)}
                    />
                </FormGroup>

                <FormGroup label={t('realismStylization')}>
                    <Select
                        options={OPTIONS.realismLevel}
                        value={technical.realismLevel}
                        onChange={(val) => handleChange('realismLevel', val)}
                    />
                </FormGroup>

                <FormGroup label={t('safetyRating')}>
                    <Select
                        options={OPTIONS.safetyRating}
                        value={technical.safetyRating}
                        onChange={(val) => handleChange('safetyRating', val)}
                    />
                </FormGroup>
            </div>

            <FormGroup label={t('constraints')}>
                <Textarea
                    value={technical.constraints}
                    onChange={(val) => handleChange('constraints', val)}
                    placeholder={t('constraintsPlaceholder')}
                />
            </FormGroup>
        </StepCard>
    );
}
