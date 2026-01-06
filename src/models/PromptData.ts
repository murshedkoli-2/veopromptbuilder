import mongoose, { Schema, model, models } from 'mongoose';

const PresetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    promptState: {
        type: Object,
        required: true,
    },
}, { timestamps: true });

export const PresetModel = models.Preset || model('Preset', PresetSchema);

const SnippetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['scene', 'character', 'style'],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    prompt: {
        type: String,
        required: false,
    },
}, { timestamps: true });

export const SnippetModel = models.Snippet || model('Snippet', SnippetSchema);

const HistorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    state: {
        type: Object,
        required: true,
    },
}, { timestamps: true });

export const HistoryModel = models.History || model('History', HistorySchema);
