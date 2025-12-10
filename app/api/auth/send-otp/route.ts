import { generateOTP } from "@/app/utils/otp";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export const OTP_STORE = new Map<
  string,
  { otp: string; exp: number; user: Record<string, unknown>; userId: string }
>();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // reuse your CURRENT login endpoint internally
    const chk = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    if (!chk.ok)
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 401 });

    const { user } = await chk.json();

    const otp = generateOTP();
    const otpSessionId = uuid();
    OTP_STORE.set(otpSessionId, {
      otp,
      exp: Date.now() + 120_000,
      user,
      userId: user.id,
    });

    console.log(`\n\n🔑  OTP for ${email}  →  ${otp}  (expires in 2 min)\n\n`);

    return NextResponse.json({ otpSessionId, msg: "OTP sent" });
  } catch {
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
