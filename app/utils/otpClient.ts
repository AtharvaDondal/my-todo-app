export const generateOTP = () =>
  String(Math.floor(100000 + Math.random() * 900000)); // 6 digits

export const OTP_CACHE = new Map<string, string>(); // key = email, value = OTP
