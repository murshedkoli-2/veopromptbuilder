'use client';

import React from 'react';
import { useWizard } from '../WizardProvider';
import { OPTIONS } from '@/constants/options';
import { StepCard, FormGroup, Select, Textarea } from '@/components/ui/FormControls';
import { Bookmark, Trash2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SceneStep() {
    const { state, updateState, savedScenes, saveScene, deleteScene, loadScene, t } = useWizard();
    const { scene } = state;
    const [snippetName, setSnippetName] = React.useState('');
    const [showSave, setShowSave] = React.useState(false);

    const handleChange = (field: keyof typeof scene, value: string) => {
        updateState('scene', { [field]: value });
    };

    const handleSave = () => {
        if (!snippetName) return;
        saveScene(snippetName);
        setSnippetName('');
        setShowSave(false);
    };

    return (
        <StepCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup
                    label={t('location')}
                    helperText={t('locationHelper')}
                >
                    <Select
                        options={OPTIONS.location}
                        value={scene.location}
                        onChange={(val) => handleChange('location', val)}
                        placeholder={t('locationPlaceholder')}
                    />
                </FormGroup>

                <FormGroup
                    label={t('timeOfDay')}
                    helperText={t('timeOfDayHelper')}
                >
                    <Select
                        options={OPTIONS.timeOfDay}
                        value={scene.timeOfDay}
                        onChange={(val) => handleChange('timeOfDay', val)}
                        placeholder={t('timeOfDayPlaceholder')}
                    />
                </FormGroup>

                <FormGroup
                    label={t('weather')}
                    helperText={t('weatherHelper')}
                >
                    <Select
                        options={OPTIONS.weather}
                        value={scene.weather}
                        onChange={(val) => handleChange('weather', val)}
                        placeholder={t('weatherPlaceholder')}
                    />
                </FormGroup>
            </div>

            <FormGroup
                label={t('envDescription')}
                helperText={t('envDescriptionHelper')}
            >
                <Textarea
                    value={scene.envDescription}
                    onChange={(val) => handleChange('envDescription', val)}
                    placeholder={t('envDescriptionPlaceholder')}
                />
            </FormGroup>

            <FormGroup
                label={t('sensoryDetails')}
                helperText={t('sensoryDetailsHelper')}
            >
                <Textarea
                    value={scene.sensoryDetails}
                    onChange={(val) => handleChange('sensoryDetails', val)}
                    placeholder={t('sensoryDetailsPlaceholder')}
                />
            </FormGroup>

            <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">{t('sceneLibrary')}</h3>
                    <button
                        onClick={() => setShowSave(!showSave)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            showSave ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground border border-border"
                        )}
                    >
                        <Bookmark className="w-3.5 h-3.5" />
                        {showSave ? t('cancel') : t('saveCurrentScene')}
                    </button>
                </div>

                {showSave && (
                    <div className="mb-6 p-4 bg-secondary/30 rounded-xl border border-border animate-in slide-in-from-top-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={snippetName}
                                onChange={(e) => setSnippetName(e.target.value)}
                                placeholder={t('sceneSnippetPlaceholder')}
                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
                            >
                                {t('save')}
                            </button>
                        </div>
                    </div>
                )}

                {savedScenes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {savedScenes.map((s) => (
                            <div key={s.id} className="group flex items-center justify-between p-3 bg-secondary/20 hover:bg-secondary/40 border border-border rounded-xl transition-all">
                                <span className="text-xs font-medium truncate pr-2">{s.name}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => loadScene(s)}
                                        className="p-1.5 hover:text-primary transition-colors"
                                        title={t('useSnippet')}
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                    </button>
                                    <button
                                        onClick={() => deleteScene(s.id)}
                                        className="p-1.5 hover:text-destructive transition-colors"
                                        title={t('delete')}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground italic">{t('noScenes')}</p>
                )}
            </div>
        </StepCard>
    );
}
