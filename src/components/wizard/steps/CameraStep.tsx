'use client';

import React from 'react';
import { useWizard } from '../WizardProvider';
import { OPTIONS } from '@/constants/options';
import { StepCard, FormGroup, Select, Textarea } from '@/components/ui/FormControls';

export default function CameraStep() {
    const { state, updateState, t } = useWizard();
    const { camera } = state;

    const handleChange = (field: keyof typeof camera, value: string) => {
        updateState('camera', { [field]: value });
    };

    return (
        <StepCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label={t('shotType')}>
                    <Select
                        options={OPTIONS.shotType}
                        value={camera.shotType}
                        onChange={(val) => handleChange('shotType', val)}
                    />
                </FormGroup>

                <FormGroup label={t('cameraAngle')}>
                    <Select
                        options={OPTIONS.angle}
                        value={camera.angle}
                        onChange={(val) => handleChange('angle', val)}
                    />
                </FormGroup>

                <FormGroup label={t('cameraMovement')}>
                    <Select
                        options={OPTIONS.movement}
                        value={camera.movement}
                        onChange={(val) => handleChange('movement', val)}
                    />
                </FormGroup>

                <FormGroup label={t('lensStyle')}>
                    <Select
                        options={OPTIONS.lensStyle}
                        value={camera.lensStyle}
                        onChange={(val) => handleChange('lensStyle', val)}
                    />
                </FormGroup>

                <FormGroup label={t('aspectRatio')}>
                    <Select
                        options={OPTIONS.aspectRatio}
                        value={camera.aspectRatio}
                        onChange={(val) => handleChange('aspectRatio', val)}
                    />
                </FormGroup>
            </div>

            <FormGroup label={t('cinematicNotes')}>
                <Textarea
                    value={camera.notes}
                    onChange={(val) => handleChange('notes', val)}
                    placeholder={t('cinematicNotesPlaceholder')}
                />
            </FormGroup>
        </StepCard>
    );
}
