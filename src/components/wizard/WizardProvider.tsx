'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
    PromptState,
    initialPromptState,
    Preset,
    SavedScene,
    SceneState,
    SavedCharacter,
    StyleState,
    SavedStyle,
    PromptHistoryItem,
    Story
} from '@/types/wizard';
import { useSession } from 'next-auth/react';
import { Language, translations } from '@/constants/translations';

interface WizardContextType {
    state: PromptState;
    updateState: <K extends keyof PromptState>(
        section: K,
        updates: Partial<PromptState[K]>
    ) => void;
    resetState: () => void;
    currentStep: number;
    setStep: (step: number) => void;
    isReady: boolean;
    presets: Preset[];
    savePreset: (name: string, description: string) => void;
    deletePreset: (id: string) => void;
    loadPreset: (preset: Preset) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;

    // New features
    savedScenes: SavedScene[];
    saveScene: (name: string, data?: SceneState) => void;
    deleteScene: (id: string) => void;
    loadScene: (scene: SavedScene) => void;

    savedCharacters: SavedCharacter[];
    saveCharacter: (name: string, prompt?: string) => void;
    updateCharacter: (id: string, name: string, data: any, prompt?: string) => void;
    deleteCharacter: (id: string) => void;
    loadCharacter: (character: SavedCharacter) => void;

    savedStyles: SavedStyle[];
    saveStyle: (name: string, data: StyleState) => void;
    deleteStyle: (id: string) => void;
    loadStyle: (style: SavedStyle) => void;

    // Stories (New)
    stories: Story[];
    saveStory: (name: string, description: string, scenes: PromptState[]) => void;
    deleteStory: (id: string) => void;
    loadStory: (story: Story) => void;

    history: PromptHistoryItem[];
    addToHistory: (prompt: string) => void;
    clearHistory: () => void;

    // Language
    language: Language;
    toggleLanguage: () => void;
    t: (key: keyof typeof translations.en) => string;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<PromptState>(initialPromptState);
    const [currentStep, setCurrentStep] = useState(0);
    const [presets, setPresets] = useState<Preset[]>([]);
    const [savedScenes, setSavedScenes] = useState<SavedScene[]>([]);
    const [savedCharacters, setSavedCharacters] = useState<SavedCharacter[]>([]);
    const [savedStyles, setSavedStyles] = useState<SavedStyle[]>([]);
    const [stories, setStories] = useState<Story[]>([]); // Stories State
    const [history, setHistory] = useState<PromptHistoryItem[]>([]);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [language, setLanguage] = useState<Language>('en');
    const [isReady, setIsReady] = useState(false);
    const { data: session, status } = useSession();

    // Fetch data from DB if logged in
    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/user/data')
                .then(res => res.json())
                .then(data => {
                    if (data.presets) setPresets(data.presets);
                    if (data.stories) setStories(data.stories); // Fetch stories
                    if (data.snippets) {
                        setSavedScenes(data.snippets.filter((s: any) => s.type === 'scene'));
                        setSavedCharacters(data.snippets.filter((s: any) => s.type === 'character'));
                        setSavedStyles(data.snippets.filter((s: any) => s.type === 'style'));
                    }
                    if (data.history) setHistory(data.history);
                })
                .catch(err => console.error('Failed to fetch user data:', err));
        }
    }, [status]);
    useEffect(() => {
        const saved = localStorage.getItem('veo_prompt_state');
        if (saved) {
            try { setState(JSON.parse(saved)); } catch (e) { console.error(e); }
        }
        const savedStep = localStorage.getItem('veo_current_step');
        if (savedStep) {
            setCurrentStep(parseInt(savedStep, 10));
        }
        const savedPresets = localStorage.getItem('veo_presets');
        if (savedPresets) {
            try { setPresets(JSON.parse(savedPresets)); } catch (e) { console.error(e); }
        }
        const savedStories = localStorage.getItem('veo_stories');
        if (savedStories) {
            try { setStories(JSON.parse(savedStories)); } catch (e) { console.error(e); }
        }
        const savedScenes = localStorage.getItem('veo_saved_scenes');
        if (savedScenes) {
            try { setSavedScenes(JSON.parse(savedScenes)); } catch (e) { console.error(e); }
        }
        const savedCharacters = localStorage.getItem('veo_saved_characters');
        if (savedCharacters) {
            try { setSavedCharacters(JSON.parse(savedCharacters)); } catch (e) { console.error(e); }
        }
        const savedHistory = localStorage.getItem('veo_history');
        if (savedHistory) {
            try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
        }
        const savedTheme = localStorage.getItem('veo_theme') as 'light' | 'dark';
        if (savedTheme) {
            setTheme(savedTheme);
        }
        const savedLang = localStorage.getItem('veo_lang') as Language;
        if (savedLang) {
            setLanguage(savedLang);
        }
        setIsReady(true);
    }, []);

    // Update document class when theme changes
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('veo_theme', theme);
    }, [theme]);

    // Save to localStorage on change
    useEffect(() => {
        if (isReady) {
            // Always save WIP state for session continuity
            localStorage.setItem('veo_prompt_state', JSON.stringify(state));
            localStorage.setItem('veo_current_step', currentStep.toString());

            if (status === 'authenticated') {
                localStorage.setItem('veo_presets', JSON.stringify(presets));
                localStorage.setItem('veo_stories', JSON.stringify(stories));
                localStorage.setItem('veo_saved_scenes', JSON.stringify(savedScenes));
                localStorage.setItem('veo_saved_characters', JSON.stringify(savedCharacters));
                localStorage.setItem('veo_saved_styles', JSON.stringify(savedStyles));
                localStorage.setItem('veo_history', JSON.stringify(history));
            } else {
                // For guests, we don't persist these items across refreshes (as per your request "but not save")
                // However, we keep them in state while they are using the app in this session.
                localStorage.removeItem('veo_presets');
                localStorage.removeItem('veo_stories');
                localStorage.removeItem('veo_saved_scenes');
                localStorage.removeItem('veo_saved_characters');
                localStorage.removeItem('veo_saved_styles');
                localStorage.removeItem('veo_history');
            }
        }
    }, [state, currentStep, presets, stories, savedScenes, savedCharacters, savedStyles, history, isReady, status]);

    const updateState = <K extends keyof PromptState>(
        section: K,
        updates: Partial<PromptState[K]>
    ) => {
        setState((prev) => ({
            ...prev,
            [section]: { ...prev[section], ...updates },
        }));
    };

    const resetState = () => {
        if (confirm('Are you sure you want to reset the entire wizard?')) {
            setState(initialPromptState);
            setCurrentStep(0);
        }
    };

    const savePreset = async (name: string, description: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newPreset: Preset = {
            id,
            name,
            description,
            createdAt: Date.now(),
            promptState: state,
        };

        if (status === 'authenticated') {
            try {
                const res = await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'preset',
                        action: 'save',
                        data: { name, description, promptState: state }
                    })
                });
                const saved = await res.json();
                newPreset.id = saved._id;
            } catch (err) {
                console.error('Failed to save preset to DB:', err);
            }
        }

        setPresets([newPreset, ...presets]);
    };

    const deletePreset = async (id: string) => {
        if (status === 'authenticated') {
            try {
                await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'preset',
                        action: 'delete',
                        data: { id }
                    })
                });
            } catch (err) {
                console.error('Failed to delete preset from DB:', err);
            }
        }
        setPresets(presets.filter(p => p.id !== id));
    };

    const loadPreset = (preset: Preset) => {
        setState(preset.promptState);
        setCurrentStep(0);
    };

    // Scene Snippets
    const saveScene = async (name: string, data?: SceneState) => {
        const id = Math.random().toString(36).substr(2, 9);
        const sceneData = data || state.scene;
        const newScene: SavedScene = {
            id,
            name,
            data: sceneData,
            createdAt: Date.now(),
        };

        if (status === 'authenticated') {
            try {
                const res = await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'snippet',
                        action: 'save',
                        data: { name, type: 'scene', data: sceneData }
                    })
                });
                const saved = await res.json();
                newScene.id = saved._id;
            } catch (err) {
                console.error('Failed to save scene to DB:', err);
            }
        }
        setSavedScenes([newScene, ...savedScenes]);
    };

    const deleteScene = async (id: string) => {
        if (status === 'authenticated') {
            try {
                await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'snippet',
                        action: 'delete',
                        data: { id }
                    })
                });
            } catch (err) {
                console.error('Failed to delete scene from DB:', err);
            }
        }
        setSavedScenes(savedScenes.filter(s => s.id !== id));
    };

    const loadScene = (scene: SavedScene) => {
        updateState('scene', scene.data);
    };

    // Character Snippets
    const saveCharacter = async (name: string, prompt?: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newChar: SavedCharacter = {
            id,
            name,
            data: state.characters,
            prompt, // Verify this is passed
            createdAt: Date.now(),
        };

        if (status === 'authenticated') {
            try {
                const res = await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'snippet',
                        action: 'save',
                        data: { name, type: 'character', data: state.characters, prompt }
                    })
                });
                const saved = await res.json();
                newChar.id = saved._id;
            } catch (err) {
                console.error('Failed to save character to DB:', err);
            }
        }
        setSavedCharacters([newChar, ...savedCharacters]);
    };

    const deleteCharacter = async (id: string) => {
        if (status === 'authenticated') {
            try {
                await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'snippet',
                        action: 'delete',
                        data: { id }
                    })
                });
            } catch (err) {
                console.error('Failed to delete character from DB:', err);
            }
        }
        setSavedCharacters(savedCharacters.filter(c => c.id !== id));
    };

    const loadCharacter = (character: SavedCharacter) => {
        updateState('characters', character.data);
    };

    // Style Snippets
    const saveStyle = async (name: string, data: StyleState) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newStyle: SavedStyle = {
            id,
            name,
            data,
            createdAt: Date.now(),
        };

        if (status === 'authenticated') {
            try {
                await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'snippet',
                        action: 'save',
                        data: { name, type: 'style', data }
                    })
                });
                // We're assuming the response matches (omitting id update for brevity but better to sync)
            } catch (err) {
                console.error('Failed to save style to DB:', err);
            }
        }
        setSavedStyles([newStyle, ...savedStyles]);
    };

    const deleteStyle = async (id: string) => {
        if (status === 'authenticated') {
            try {
                await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'snippet',
                        action: 'delete',
                        data: { id }
                    })
                });
            } catch (err) {
                console.error('Failed to delete style from DB:', err);
            }
        }
        setSavedStyles(savedStyles.filter(s => s.id !== id));
    };

    const loadStyle = (style: SavedStyle) => {
        // Logic handled in component mostly, but good to have interface
        console.log("Loaded style:", style);
    };

    const updateCharacter = async (id: string, name: string, data: any, prompt?: string) => {
        const updatedChar = savedCharacters.find(c => c.id === id);
        if (!updatedChar) return;

        updatedChar.name = name;
        updatedChar.data = data;
        if (prompt) updatedChar.prompt = prompt;

        if (status === 'authenticated') {
            try {
                await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'snippet',
                        action: 'update',
                        data: { id, name, type: 'character', data, prompt }
                    })
                });
            } catch (err) {
                console.error('Failed to update character in DB:', err);
            }
        }
        setSavedCharacters([...savedCharacters]);
    };

    // Stories
    const saveStory = async (name: string, description: string, scenes: PromptState[]) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newStory: Story = {
            id,
            name,
            description,
            scenes,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        if (status === 'authenticated') {
            try {
                const res = await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'story',
                        action: 'save',
                        data: { name, description, scenes }
                    })
                });
                const saved = await res.json();
                newStory.id = saved._id;
            } catch (err) {
                console.error('Failed to save story to DB:', err);
            }
        }
        setStories([newStory, ...stories]);
    };

    const deleteStory = async (id: string) => {
        if (status === 'authenticated') {
            try {
                await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'story',
                        action: 'delete',
                        data: { id }
                    })
                });
            } catch (err) {
                console.error('Failed to delete story from DB:', err);
            }
        }
        setStories(stories.filter(s => s.id !== id));
    };

    const loadStory = (story: Story) => {
        // Placeholder: Loading a story might be different than loading a single preset.
        // For now, maybe load the first scene? Or we just manage it in the story builder UI.
        console.log("Loaded story:", story);
    };

    // History
    const addToHistory = async (prompt: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newItem: PromptHistoryItem = {
            id,
            prompt,
            state: { ...state },
            createdAt: Date.now(),
        };

        if (status === 'authenticated') {
            try {
                const res = await fetch('/api/user/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'history',
                        action: 'add',
                        data: { prompt, state }
                    })
                });
                const saved = await res.json();
                newItem.id = saved._id;
            } catch (err) {
                console.error('Failed to add to history in DB:', err);
            }
        }

        // Keep only last 50 items
        setHistory((prev) => [newItem, ...prev].slice(0, 50));
    };

    const clearHistory = async () => {
        if (confirm('Are you sure you want to clear your prompt history?')) {
            if (status === 'authenticated') {
                try {
                    await fetch('/api/user/data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'history',
                            action: 'clear'
                        })
                    });
                } catch (err) {
                    console.error('Failed to clear history in DB:', err);
                }
            }
            setHistory([]);
        }
    };

    const setStep = (step: number) => {
        setCurrentStep(step);
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleLanguage = () => {
        setLanguage(prev => {
            const next = prev === 'en' ? 'bn' : 'en';
            localStorage.setItem('veo_lang', next);
            return next;
        });
    };

    const t = (key: keyof typeof translations.en) => {
        return translations[language][key] || translations.en[key] || key;
    };

    return (
        <WizardContext.Provider
            value={{
                state,
                updateState,
                resetState,
                currentStep,
                setStep,
                isReady,
                presets,
                savePreset,
                deletePreset,
                loadPreset,
                theme,
                toggleTheme,
                savedScenes,
                saveScene,
                deleteScene,
                loadScene,
                savedCharacters,
                saveCharacter,
                updateCharacter,
                deleteCharacter,
                loadCharacter,
                savedStyles,
                saveStyle,
                deleteStyle,
                loadStyle,
                history,
                addToHistory,
                clearHistory,
                language,
                toggleLanguage,
                t,
                stories,
                saveStory,
                deleteStory,
                loadStory
            }}
        >
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error('useWizard must be used within a WizardProvider');
    }
    return context;
}
