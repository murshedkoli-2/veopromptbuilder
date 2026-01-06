'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Film, BookOpen, Users, Sun, Moon, User, LogOut, LogIn, Languages } from 'lucide-react';
import { useWizard } from '@/components/wizard/WizardProvider';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { t, theme, toggleTheme, language, toggleLanguage } = useWizard();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with controls */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-xl bg-secondary/50 border border-border text-foreground hover:bg-secondary transition-all active:scale-95 flex items-center gap-2 px-3"
            title={`Switch to ${language === 'en' ? 'Bangla' : 'English'}`}
          >
            <Languages className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{language === 'en' ? 'EN' : 'BN'}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-secondary/50 border border-border text-foreground hover:bg-secondary transition-all active:scale-95"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="ml-2 flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[100px]">{session.user?.name}</p>
                  <button
                    onClick={() => signOut()}
                    className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-0.5"
                  >
                    <LogOut className="w-2.5 h-2.5" />
                    {t('signOut')}
                  </button>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          {t('homeTitle')} <span className="text-muted-foreground">{t('homeSubtitle')}</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-4 leading-relaxed">
          {t('homeTagline')}
        </p>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-12 leading-relaxed">
          {t('homeDescription')}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">


          <Link
            href="/story"
            className="group flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-semibold text-lg hover:bg-accent/80 transition-all hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-5 h-5" />
            {t('storyBuilder')}
          </Link>

          <Link
            href="/character"
            className="group flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-lg hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
          >
            <Users className="w-5 h-5" />
            {t('characterBuilder')}
          </Link>

          <Link
            href="/library"
            className="group flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-lg hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
          >
            <Film className="w-5 h-5" />
            {t('library')}
          </Link>
        </div>
      </div>
    </div>
  );
}
