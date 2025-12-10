import otpGenerator from "otp-generator";

export const generateOTP = () =>
  otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });

export const OTP_STORE = new Map<string, { otp: string; exp: number }>(); // ttl 2 min
