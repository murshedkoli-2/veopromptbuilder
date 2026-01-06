'use client';

import React from 'react';
import { useWizard } from '../WizardProvider';
import { OPTIONS } from '@/constants/options';
import { StepCard, FormGroup, Select, Textarea, Input } from '@/components/ui/FormControls';
import { Bookmark, Trash2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CharacterStep() {
    const { state, updateState, savedCharacters, saveCharacter, deleteCharacter, loadCharacter, t } = useWizard();
    const { characters } = state;
    const [snippetName, setSnippetName] = React.useState('');
    const [showSave, setShowSave] = React.useState(false);

    const handleChange = (field: keyof typeof characters, value: string | number) => {
        updateState('characters', { [field]: value });
    };

    const handleSave = () => {
        if (!snippetName) return;

        // Generate a prompt string from attributes
        const parts = [];
        if (characters.ageGroup) parts.push(characters.ageGroup);
        if (characters.role) parts.push(characters.role);
        if (characters.attire) parts.push(`wearing ${characters.attire}`);
        if (characters.emotions) parts.push(`Mood: ${characters.emotions}`);
        if (characters.gestures) parts.push(`Action: ${characters.gestures}`);
        if (characters.culturalNotes) parts.push(`Note: ${characters.culturalNotes}`);

        const prompt = parts.join(', ');

        saveCharacter(snippetName, prompt);
        setSnippetName('');
        setShowSave(false);
    };

    return (
        <StepCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label={t('charCount')}>
                    <Input
                        type="number"
                        value={characters.count}
                        onChange={(val) => handleChange('count', parseInt(val || '0'))}
                        placeholder="0"
                    />
                </FormGroup>

                <FormGroup label={t('ageGroup')}>
                    <Select
                        options={OPTIONS.ageGroup}
                        value={characters.ageGroup}
                        onChange={(val) => handleChange('ageGroup', val)}
                    />
                </FormGroup>

                <FormGroup label={t('roleArchetype')}>
                    <Select
                        options={OPTIONS.role}
                        value={characters.role}
                        onChange={(val) => handleChange('role', val)}
                    />
                </FormGroup>

                <FormGroup label={t('attire')}>
                    <Select
                        options={OPTIONS.attire}
                        value={characters.attire}
                        onChange={(val) => handleChange('attire', val)}
                    />
                </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label={t('gesturesActions')}>
                    <Textarea
                        value={characters.gestures}
                        onChange={(val) => handleChange('gestures', val)}
                        placeholder={t('gesturesPlaceholder')}
                        maxLength={200}
                    />
                </FormGroup>

                <FormGroup label={t('emotions')}>
                    <Textarea
                        value={characters.emotions}
                        onChange={(val) => handleChange('emotions', val)}
                        placeholder={t('emotionsPlaceholder')}
                        maxLength={200}
                    />
                </FormGroup>
            </div>

            <FormGroup label={t('culturalNotes')}>
                <Textarea
                    value={characters.culturalNotes}
                    onChange={(val) => handleChange('culturalNotes', val)}
                    placeholder={t('culturalNotesPlaceholder')}
                />
            </FormGroup>

            <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">{t('charLibrary')}</h3>
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
                                placeholder={t('charSnippetPlaceholder')}
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

                {savedCharacters.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {savedCharacters.map((c) => (
                            <div key={c.id} className="group flex items-center justify-between p-3 bg-secondary/20 hover:bg-secondary/40 border border-border rounded-xl transition-all">
                                <span className="text-xs font-medium truncate pr-2">{c.name}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => loadCharacter(c)}
                                        className="p-1.5 hover:text-primary transition-colors"
                                        title={t('useSnippet')}
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                    </button>
                                    <button
                                        onClick={() => deleteCharacter(c.id)}
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
                    <p className="text-xs text-muted-foreground italic">{t('noChars')}</p>
                )}
            </div>
        </StepCard>
    );
}
