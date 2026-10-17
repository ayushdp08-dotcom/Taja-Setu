import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Store,
  Coffee,
  UtensilsCrossed,
  Croissant,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { BusinessType } from '../types';
import { BUSINESS_CONFIGS } from '../data/mockData';

interface AuthPageProps {
  onSuccess: () => void;
  onBackToWelcome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToWelcome }) => {
  const { businessType, loginWithPhone, verifyOtp } = useInventory();
  const config = BUSINESS_CONFIGS[businessType] || BUSINESS_CONFIGS.grocery;

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [demoCodeHint, setDemoCodeHint] = useState<string>('123456');

  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate 10-digit number
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91 ${cleanDigits.slice(-10)}`;
      const res = await loginWithPhone(fullPhone, businessType);
      if (res.success) {
        setDemoCodeHint(res.testCode || '123456');
        setSuccessNote(`OTP sent to ${fullPhone}`);
        setStep('otp');
        setCountdown(30);
        setCanResend(false);
        // Focus first digit box
        setTimeout(() => {
          digitRefs.current[0]?.focus();
        }, 150);
      } else {
        setError(res.message || 'Failed to send OTP.');
      }
    } catch {
      setError('An error occurred while sending the OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Pasted full 6-digit code
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const nextDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          nextDigits[i] = pasted[i] || '';
        }
        setOtpDigits(nextDigits);
        if (pasted.length === 6) {
          digitRefs.current[5]?.focus();
        }
        return;
      }
    }

    const single = value.slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = single;
    setOtpDigits(nextDigits);

    // Move focus forward if entered
    if (single && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    const code = otpDigits.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(code);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Invalid OTP code. Please enter 123456.');
      }
    } catch {
      setError('Verification failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const businessIcons: Record<BusinessType, any> = {
    grocery: Store,
    cafe: Coffee,
    restaurant: UtensilsCrossed,
    bakery: Croissant,
  };
  const BusinessIcon = businessIcons[businessType] || Store;

  return (
    <div className="min-h-screen bg-zinc-50/60 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Link */}
        <button
          onClick={onBackToWelcome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Switch Business Type</span>
        </button>

        {/* Business Branding Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200/90 shadow-xs flex items-center justify-center text-emerald-600 mx-auto mb-3">
            <BusinessIcon className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
            {config.name} Portal
          </h2>
          <p className="mt-1 text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            {config.tagline}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-zinc-200/90 sm:rounded-2xl sm:px-10">
          {/* Demo Notice Banner */}
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Phone Auth Ready:</span> Demo verification is pre-configured. Use any 10-digit number; test code is{' '}
              <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-sm border border-emerald-300">
                123456
              </span>
              .
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' ? (
            /* STEP 1: Phone input */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative rounded-xl border border-zinc-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 overflow-hidden flex items-center">
                  <div className="bg-zinc-50 px-3 py-2.5 border-r border-zinc-200 text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs px-3 py-2.5 outline-hidden font-mono tracking-wider text-zinc-900"
                  />
                  <Phone className="w-4 h-4 text-zinc-400 mr-3" />
                </div>
                <p className="mt-1 text-[11px] text-zinc-400">
                  We'll send a 6-digit one-time code to authenticate your {config.name}.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: 6-digit OTP verification */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-700">
                    Enter 6-Digit OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Change Number
                  </button>
                </div>

                <p className="text-[11px] text-zinc-500 mb-4">
                  Sent to <span className="font-semibold text-zinc-800">+91 {phoneNumber}</span>
                </p>

                {/* 6 Individual Digit Inputs */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        digitRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden bg-white shadow-2xs"
                    />
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpDigits(['1', '2', '3', '4', '5', '6']);
                    }}
                    className="text-[11px] text-zinc-400 hover:text-zinc-600 underline"
                  >
                    Auto-fill demo code (123456)
                  </button>

                  <div>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend OTP</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-400 font-medium">
                        Resend code in {countdown}s
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length < 6}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify & Enter Dashboard</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Bypass Button */}
          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <button
              type="button"
              onClick={() => {
                loginWithPhone('+91 9876543210', businessType);
                verifyOtp('123456');
                onSuccess();
              }}
              className="text-xs text-zinc-500 hover:text-emerald-700 font-medium transition-colors"
            >
              Skip login and launch demo session →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
