import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { email, otp, type } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (type === 'verification') {
            if (user.isVerified) {
                return NextResponse.json({ message: 'User already verified' }, { status: 400 });
            }

            if (user.verificationOtp !== otp || new Date() > user.verificationOtpExpires!) {
                return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
            }

            user.isVerified = true;
            user.verificationOtp = undefined;
            user.verificationOtpExpires = undefined;
            await user.save();

            return NextResponse.json({ message: 'Account verified successfully' }, { status: 200 });
        }

        if (type === 'reset') {
            if (user.resetPasswordOtp !== otp || new Date() > user.resetPasswordOtpExpires!) {
                return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
            }

            return NextResponse.json({ message: 'OTP verified' }, { status: 200 });
        }

        return NextResponse.json({ message: 'Invalid verification type' }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
