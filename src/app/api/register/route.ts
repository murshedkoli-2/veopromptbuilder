import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateOtp, sendOtpEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Missing email or password' },
                { status: 400 }
            );
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json(
                    { message: 'User already exists' },
                    { status: 400 }
                );
            }
            // If user exists but not verified, we'll update the password and send a new OTP
            const hashedPassword = await bcrypt.hash(password, 12);
            const otp = generateOtp();
            existingUser.password = hashedPassword;
            existingUser.name = name;
            existingUser.verificationOtp = otp;
            existingUser.verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
            await existingUser.save();
            await sendOtpEmail(email, otp, 'verification');
            return NextResponse.json({ message: 'OTP sent to your email' }, { status: 200 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const otp = generateOtp();

        await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationOtp: otp,
            verificationOtpExpires: new Date(Date.now() + 10 * 60 * 1000),
        });

        await sendOtpEmail(email, otp, 'verification');

        return NextResponse.json(
            { message: 'OTP sent to your email' },
            { status: 201 }
        );
    } catch (err: any) {
        console.error('Registration Error:', err);
        return NextResponse.json(
            { message: err.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
