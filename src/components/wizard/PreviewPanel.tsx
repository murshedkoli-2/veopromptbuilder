'use client';

import React, { useState } from 'react';
import { useWizard } from './WizardProvider';
import { assemblePrompt, isStateEmpty } from '@/lib/prompt-utils';
import { History, LayoutGrid, Users, Trash2, RotateCcw, Bookmark, Check, Copy, Download, Play, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function PreviewPanel() {
    const {
        state, resetState, presets, savePreset, deletePreset, loadPreset,
        savedScenes, loadScene, deleteScene,
        savedCharacters, loadCharacter, deleteCharacter,
        history, addToHistory, clearHistory, t
    } = useWizard();
    const [copied, setCopied] = useState(false);
    const [showSavePreset, setShowSavePreset] = useState(false);
    const [presetName, setPresetName] = useState('');
    const [activeTab, setActiveTab] = useState<'presets' | 'scenes' | 'chars' | 'history'>('history');
    const { status } = useSession();
    const prompt = assemblePrompt(state);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            addToHistory(prompt);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleExportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "veo_prompt.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleSavePreset = () => {
        if (!presetName) return;
        savePreset(presetName, '');
        setPresetName('');
        setShowSavePreset(false);
    };

    return (
        <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{t('livePreview')}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSavePreset(!showSavePreset)}
                        className={cn(
                            "p-2 rounded-lg transition-colors border border-border",
                            showSavePreset ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                        title={t('savePreset')}
                        disabled={isStateEmpty(state)}
                    >
                        <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                        onClick={resetState}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg"
                        title={t('reset')}
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {showSavePreset && (
                <div className="mb-6 p-4 bg-secondary/50 rounded-xl border border-border animate-in slide-in-from-top-2 duration-300">
                    <h3 className="text-sm font-medium mb-3">{t('savePreset')}</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            placeholder={t('presetNamePlaceholder')}
                            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                            onClick={handleSavePreset}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
                        >
                            {t('next')}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col min-h-0 min-w-0">
                <div className="flex-1 flex flex-col min-h-0 bg-secondary/30 rounded-xl border border-border p-4 mb-6">
                    {prompt ? (
                        <div className="flex-1 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground custom-scrollbar">
                            {prompt}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center p-6 italic text-muted-foreground text-sm">
                            {t('emptyPreview')}
                        </div>
                    )}
                </div>

                <div className="flex border-b border-border mb-4">
                    {[
                        { id: 'history', icon: History, label: t('history') },
                        { id: 'presets', icon: Bookmark, label: t('presets') },
                        { id: 'scenes', icon: LayoutGrid, label: t('scenes') },
                        { id: 'chars', icon: Users, label: t('characters') }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-all border-b-2",
                                activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {status !== 'authenticated' && (
                    <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{t('guestMode')}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                            {t('guestWarning')} <Link href="/login" className="text-primary font-bold hover:underline">{t('signInToSave')}</Link>
                        </p>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {activeTab === 'history' && (
                        <div className="space-y-2">
                            {history.length > 0 ? history.map((item) => (
                                <div key={item.id} className="group p-3 bg-secondary/10 hover:bg-secondary/20 border border-border rounded-xl transition-all">
                                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2 font-mono">{item.prompt}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-muted-foreground">
                                            {new Date(item.createdAt).toLocaleTimeString()}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(item.prompt);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 1000);
                                                }}
                                                className="p-1 hover:text-primary transition-colors"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[11px] text-muted-foreground text-center py-4 italic">{t('noHistory')}</p>
                            )}
                            {history.length > 0 && (
                                <button onClick={clearHistory} className="w-full text-[10px] text-destructive hover:underline py-2">
                                    {t('reset')}
                                </button>
                            )}
                        </div>
                    )}

                    {activeTab === 'presets' && (
                        <div className="space-y-2">
                            {presets.length > 0 ? presets.map((preset) => (
                                <div key={preset.id} className="group flex items-center justify-between p-3 bg-secondary/20 hover:bg-secondary/40 border border-border rounded-xl transition-all">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{preset.name}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {new Date(preset.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => loadPreset(preset)} className="p-1.5 hover:text-primary transition-colors">
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                        <button onClick={() => deletePreset(preset.id)} className="p-1.5 hover:text-destructive transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[11px] text-muted-foreground text-center py-4 italic">{t('noPresets')}</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'scenes' && (
                        <div className="space-y-2">
                            {savedScenes.length > 0 ? savedScenes.map((s) => (
                                <div key={s.id} className="group flex items-center justify-between p-3 bg-secondary/20 hover:bg-secondary/40 border border-border rounded-xl transition-all">
                                    <span className="text-xs font-medium truncate pr-2">{s.name}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => loadScene(s)} className="p-1.5 hover:text-primary transition-colors">
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                        <button onClick={() => deleteScene(s.id)} className="p-1.5 hover:text-destructive transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[11px] text-muted-foreground text-center py-4 italic">{t('noScenes')}</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'chars' && (
                        <div className="space-y-2">
                            {savedCharacters.length > 0 ? savedCharacters.map((c) => (
                                <div key={c.id} className="group flex items-center justify-between p-3 bg-secondary/20 hover:bg-secondary/40 border border-border rounded-xl transition-all">
                                    <span className="text-xs font-medium truncate pr-2">{c.name}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => loadCharacter(c)} className="p-1.5 hover:text-primary transition-colors">
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                        </button>
                                        <button onClick={() => deleteCharacter(c.id)} className="p-1.5 hover:text-destructive transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[11px] text-muted-foreground text-center py-4 italic">{t('noChars')}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={handleCopy}
                    disabled={!prompt}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-medium transition-all shadow-lg active:scale-95",
                        copied
                            ? "bg-green-600/20 text-green-400 border border-green-600/30 shadow-green-900/10"
                            : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 shadow-primary/10"
                    )}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 shrink-0" />
                            {t('copied')}
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 shrink-0" />
                            {t('copyPrompt')}
                        </>
                    )}
                </button>

                <button
                    onClick={handleExportJSON}
                    disabled={!prompt}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-medium border border-border hover:bg-secondary transition-all disabled:opacity-50 active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    {t('exportJson')}
                </button>
            </div>
        </div>
    );
}
