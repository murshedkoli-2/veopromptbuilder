import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { PresetModel, SnippetModel, HistoryModel } from '@/models/PromptData';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;

    const [presets, snippets, history] = await Promise.all([
        PresetModel.find({ userId }),
        SnippetModel.find({ userId }),
        HistoryModel.find({ userId }).sort({ createdAt: -1 }).limit(50),
    ]);

    return NextResponse.json({
        presets: presets.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            createdAt: p.createdAt,
            promptState: p.promptState,
        })),
        snippets: snippets.map(s => ({
            id: s._id,
            name: s.name,
            type: s.type,
            data: s.data,
            createdAt: s.createdAt,
        })),
        history: history.map(h => ({
            id: h._id,
            prompt: h.prompt,
            state: h.state,
            createdAt: h.createdAt,
        })),
    });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { type, action, data } = await req.json();
    await connectDB();

    try {
        if (type === 'preset') {
            if (action === 'save') {
                const preset = await PresetModel.create({ userId, ...data });
                return NextResponse.json(preset);
            }
            if (action === 'delete') {
                await PresetModel.deleteOne({ _id: data.id, userId });
                return NextResponse.json({ success: true });
            }
        }

        if (type === 'snippet') {
            if (action === 'save') {
                const snippet = await SnippetModel.create({ userId, ...data });
                return NextResponse.json(snippet);
            }
            if (action === 'update') {
                const snippet = await SnippetModel.findOneAndUpdate(
                    { _id: data.id, userId },
                    { name: data.name, data: data.data },
                    { new: true }
                );
                return NextResponse.json(snippet);
            }
            if (action === 'delete') {
                await SnippetModel.deleteOne({ _id: data.id, userId });
                return NextResponse.json({ success: true });
            }
        }

        if (type === 'history') {
            if (action === 'add') {
                const historyItem = await HistoryModel.create({ userId, ...data });
                return NextResponse.json(historyItem);
            }
            if (action === 'clear') {
                await HistoryModel.deleteMany({ userId });
                return NextResponse.json({ success: true });
            }
        }

        return NextResponse.json({ message: 'Invalid type or action' }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
