'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWizard } from '@/components/wizard/WizardProvider';
import { ArrowLeft, BookOpen, Plus, Trash2, Calendar, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StoryBuilderPage() {
    const { stories, deleteStory } = useWizard();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this story?')) {
            deleteStory(id);
        }
    };

    const handleCreateNew = () => {
        router.push('/story/create');
    };

    // Safely filter stories (default to empty array if undefined)
    const filteredStories = (stories || []).filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Story Library</h1>
                        <p className="text-muted-foreground mt-2">Manage your multi-scene video stories.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search stories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 p-3 pl-4 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Story
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {(!stories || stories.length === 0) ? (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/30">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No stories yet</h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            Start building your first multi-scene story description.
                        </p>
                        <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Story
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStories.map((story) => (
                            <div
                                key={story.id}
                                className="group relative bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent-foreground group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, story.id)}
                                        className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Story"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                    {story.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                                    {story.description || 'No description provided.'}
                                </p>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
                                        {story.scenes?.length || 0} Scenes
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(story.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <span className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Open <Edit className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
