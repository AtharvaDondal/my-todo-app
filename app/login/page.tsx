"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Mail, Lock, Loader2, Key } from "lucide-react";
import { toast } from "sonner";
import {
  authMessageState,
  correctOtpState,
  otpSentState,
  otpValueState,
  otpVerifiedState,
  userState,
} from "../store/atoms";
import { generateOTP, OTP_CACHE } from "../utils/otpClient";

/* -------------- validation -------------- */
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});
const OtpSchema = Yup.object().shape({
  otp: Yup.string().length(6, "6 digits").required("Required"),
});

/* -------------- types -------------- */
interface LoginFormValues {
  email: string;
  password: string;
}
interface OtpFormValues {
  otp: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useRecoilState(authMessageState);
  const setUser = useSetRecoilState(userState);
  const [otpSent, setOtpSent] = useRecoilState(otpSentState);
  const [otpInput, setOtpInput] = useRecoilState(otpValueState);
  const [email, setEmail] = useRecoilState(authMessageState); // reuse atom for email temp
  const [correctOtp, setCorrectOtp] = useRecoilState(correctOtpState); // reuse for otp temp
  const setVerified = useSetRecoilState(otpVerifiedState);


  const handlePassword = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    setMessage("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();

      if (res.ok) {
        // store email & otp for step-2
        setEmail(values.email);
        const otp = generateOTP();
        OTP_CACHE.set(values.email, otp);
        setCorrectOtp(otp); // keep in atom (or localState)
        console.log("Stored OTP atom:", otp); 

        setOtpSent(true);
        console.log(`%c🔑  OTP  →  ${otp}`, "color:lime;font-size:18px");

        setMessage("📮 OTP printed in server console (2 min)");
        toast.success("Check console for OTP");
      } else {
        setMessage(`⚠️ ${data.message || "Login failed"}`);
      }
    } catch {
      setMessage("❌ Network error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- step 2: OTP ---- */
  const handleOtp = async (
    values: OtpFormValues,
    { setSubmitting }: FormikHelpers<OtpFormValues>
  ) => {
    const entered = values.otp.trim();
    const expected = correctOtp.trim(); // same string set in handlePassword

    console.log("OTP check:", {
      entered,
      expected,
      match: entered === expected,
    }); // debug

    if (entered !== expected) {
      setMessage("❌ Wrong OTP");
      toast.error("Wrong OTP");
      setSubmitting(false);
      return;
    }

    // success – accept login
    setMessage("✅ Verified – welcome!");
    toast.success("Verified – welcome!");
    setOtpSent(false);
    setOtpInput("");
      setVerified(true); // ✅ gate open

    router.push("/todos");
  };

  /* -------------- UI -------------- */
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {otpSent ? "Enter OTP" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 mt-2">
            {otpSent ? "Check your server console" : "Sign in to your account"}
          </p>
        </div>

        {otpSent ? (
          /* ---------- OTP FORM ---------- */
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={OtpSchema}
            onSubmit={handleOtp}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6-digit OTP
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="123456"
                    />
                  </div>
                  <ErrorMessage
                    name="otp"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      message.includes("✅")
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify & Continue"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpInput("");
                    setMessage("");
                  }}
                  className="w-full mt-2 text-sm text-indigo-600 hover:underline"
                >
                  ← Back to password
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          /* ---------- PASSWORD FORM ---------- */
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handlePassword}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="email"
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="your@email.com"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="password"
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      message.includes("📮")
                        ? "bg-blue-50 text-blue-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
