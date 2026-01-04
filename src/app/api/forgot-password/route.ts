import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateOtp, sendOtpEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({ email });

        // For security, don't reveal if user exists or not
        if (!user) {
            return NextResponse.json({ message: 'If an account exists, a reset code was sent.' }, { status: 200 });
        }

        const otp = generateOtp();
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendOtpEmail(email, otp, 'reset');

        return NextResponse.json({ message: 'If an account exists, a reset code was sent.' }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
