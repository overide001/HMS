import { Button, PasswordInput, SegmentedControl, TextInput } from '@mantine/core';
import { IconHeartbeat } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../Service/UserService';
import { errorNotification, successNotification } from '../Utility/NotificationUtil';
import { useState, useEffect } from 'react';

const HEADING = 'Create Account';
const SUBHEADING = 'Join Pulse and take control of your health';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [headingText, setHeadingText] = useState('');
  const [subText, setSubText]         = useState('');
  const [headingDone, setHeadingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setHeadingText(HEADING.slice(0, i + 1));
      i++;
      if (i === HEADING.length) {
        clearInterval(interval);
        setHeadingDone(true);
      }
    }, 90);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!headingDone) return;
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        setSubText(SUBHEADING.slice(0, i + 1));
        i++;
        if (i === SUBHEADING.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, 150);
    return () => clearTimeout(delay);
  }, [headingDone]);

  const form = useForm({
    initialValues: { name: '', role: 'PATIENT', email: '', password: '', confirmPassword: '' },
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        !value ? 'Password is required'
          : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value)
          ? 'Password must be 8-15 chars with uppercase, lowercase, number & special character'
          : null,
      confirmPassword: (value, values) => value === values.password ? null : "Passwords don't match",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    registerUser(values)
      .then((_data) => { successNotification('Registered Successfully.'); navigate('/login'); })
      .catch((error) => { errorNotification(error.response.data.errorMessage); })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@600;700&family=Poppins:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --p100: #fef2f2; --p200: #ffe1e1; --p300: #ffc9c9;
          --p400: #fea3a3; --p500: #fa5c5c; --p600: #f24141;
          --p700: #df2323; --p800: #bc1919; --p900: #9b1919;
          --n100: #ffffff;  --n200: #f7f7f7; --n300: #eeeeee;
          --n400: #e0e0e0;  --n500: #cfcfcf; --n600: #a8a8a8;
          --n700: #7a7a7a;  --n800: #555555; --n900: #1E1E1E;
        }

        .rp-root {
          height: 100vh; width: 100vw;
          background: var(--p100);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Poppins', sans-serif;
          overflow: hidden; position: relative;
        }

        .rp-bg-circle { position: fixed; border-radius: 50%; pointer-events: none; }
        .rp-bg-circle-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(254,163,163,0.25) 0%, transparent 70%);
          top: -200px; left: -200px;
          animation: bgFloat 14s ease-in-out infinite alternate;
        }
        .rp-bg-circle-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,201,201,0.2) 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation: bgFloat 18s ease-in-out infinite alternate-reverse;
        }
        @keyframes bgFloat {
          from { transform: translate(0,0); } to { transform: translate(40px,30px); }
        }

        .rp-card {
          position: relative; width: 420px;
          background: var(--n100);
          border-radius: 24px;
          padding: 32px 36px 28px;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.04),
            0 8px 24px rgba(0,0,0,0.07),
            0 24px 48px rgba(254,163,163,0.2);
          animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
          overflow: hidden;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .rp-card-stripe {
          position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: var(--p500);
          border-radius: 24px 24px 0 0;
        }

        .rp-logo {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 2px;
          animation: fadeDown 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        .rp-logo-icon { color: var(--p600); animation: heartbeat 1.8s ease-in-out infinite; }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); } 14% { transform: scale(1.15); }
          28% { transform: scale(1); }     42% { transform: scale(1.08); } 56% { transform: scale(1); }
        }
        .rp-logo-text {
          font-family: 'Merriweather', serif; font-size: 1.65rem; font-weight: 700;
          color: var(--n900); letter-spacing: -0.5px;
        }

        /* ── TYPEWRITER ── */
        .rp-heading {
          text-align: center; font-family: 'Merriweather', serif;
          font-size: 1.15rem; font-weight: 600; color: var(--n900);
          margin-bottom: 2px; min-height: 1.6rem;
          animation: fadeDown 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }
        .rp-subheading {
          text-align: center; font-size: 0.76rem; color: var(--n600);
          margin-bottom: 18px; min-height: 1.1rem;
          animation: fadeDown 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }

        .rp-cursor {
          display: inline-block;
          width: 2px; height: 1em;
          background: var(--p500);
          margin-left: 2px;
          vertical-align: text-bottom;
          border-radius: 1px;
          animation: blink 0.75s step-end infinite;
        }
        .rp-cursor--sub {
          width: 1.5px; height: 0.85em;
          background: var(--n600);
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }

        .rp-role-wrap { margin-bottom: 14px; animation: fadeDown 0.6s 0.26s cubic-bezier(0.22,1,0.36,1) both; }
        .rp-role-label {
          font-size: 0.68rem; font-weight: 600; color: var(--n600);
          letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; display: block;
        }
        .rp-role-wrap .mantine-SegmentedControl-root {
          background: var(--n200) !important; border: 1.5px solid var(--n300) !important;
          border-radius: 10px !important; padding: 3px !important; width: 100% !important;
        }
        .rp-role-wrap .mantine-SegmentedControl-label {
          font-family: 'Poppins', sans-serif !important; font-size: 0.8rem !important;
          font-weight: 500 !important; color: var(--n700) !important;
          transition: color 0.2s !important; padding: 4px 10px !important;
        }
        .rp-role-wrap .mantine-SegmentedControl-indicator {
          background: var(--p500) !important;
          border-radius: 8px !important; box-shadow: 0 2px 8px rgba(250,92,92,0.25) !important;
        }
        .rp-role-wrap .mantine-SegmentedControl-control[data-active] .mantine-SegmentedControl-label {
          color: var(--n100) !important; font-weight: 600 !important;
        }

        .rp-field { margin-bottom: 10px; animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .rp-field:nth-child(1) { animation-delay: 0.30s; }
        .rp-field:nth-child(2) { animation-delay: 0.36s; }
        .rp-field:nth-child(3) { animation-delay: 0.42s; }
        .rp-field:nth-child(4) { animation-delay: 0.48s; }

        .rp-label {
          font-size: 0.67rem; font-weight: 600; color: var(--n600);
          letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 5px; display: block;
        }

        .rp-field .mantine-Input-input,
        .rp-field .mantine-PasswordInput-innerInput {
          background: var(--n200) !important; border: 1.5px solid var(--n300) !important;
          border-radius: 10px !important; height: 42px !important;
          padding: 0 14px !important; font-family: 'Poppins', sans-serif !important;
          font-size: 0.875rem !important; color: var(--n900) !important;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s !important;
        }
        .rp-field:focus-within .mantine-Input-input,
        .rp-field:focus-within .mantine-PasswordInput-innerInput {
          border-color: var(--p500) !important;
          background: var(--n100) !important;
          box-shadow: 0 0 0 3px rgba(250,92,92,0.15) !important;
        }
        .rp-field .mantine-Input-input::placeholder { color: var(--n500) !important; font-weight: 300 !important; }
        .rp-field .mantine-InputWrapper-error {
          font-size: 0.68rem !important; color: var(--p600) !important;
          margin-top: 3px !important; line-height: 1.35 !important;
        }
        .rp-field .mantine-PasswordInput-visibilityToggle { color: var(--p500) !important; }

        .rp-btn-wrap { margin-top: 6px; animation: fadeUp 0.6s 0.54s cubic-bezier(0.22,1,0.36,1) both; }
        .rp-btn {
          width: 100%; height: 44px !important; border-radius: 10px !important;
          background: var(--p500) !important;
          font-family: 'Poppins', sans-serif !important; font-size: 0.875rem !important;
          font-weight: 600 !important; letter-spacing: 0.4px !important;
          box-shadow: 0 4px 14px rgba(250,92,92,0.25) !important;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease !important;
        }
        .rp-btn:hover {
          background: var(--p600) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(250,92,92,0.3) !important;
        }
        .rp-btn:active { transform: translateY(1px) !important; }

        .rp-footer {
          text-align: center; margin-top: 14px; font-size: 0.8rem; color: var(--n600);
          animation: fadeUp 0.6s 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .rp-footer a { color: var(--p600); font-weight: 600; text-decoration: none; position: relative; }
        .rp-footer a::after {
          content: ''; position: absolute; left: 0; bottom: -1px;
          width: 0; height: 1.5px; background: var(--p500); transition: width 0.25s ease;
        }
        .rp-footer a:hover::after { width: 100%; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .rp-card { width: 92vw; padding: 28px 22px 22px; }
        }
      `}</style>

      <div className="rp-root">
        <div className="rp-bg-circle rp-bg-circle-1" />
        <div className="rp-bg-circle rp-bg-circle-2" />

        <div className="rp-card">
          <div className="rp-card-stripe" />

          <div className="rp-logo">
            <IconHeartbeat size={30} stroke={2.5} className="rp-logo-icon" />
            <span className="rp-logo-text">Pulse</span>
          </div>

          <h2 className="rp-heading">
            {headingText}
            {!headingDone && <span className="rp-cursor" />}
          </h2>

          <p className="rp-subheading">
            {subText}
            {headingDone && subText.length < SUBHEADING.length && (
              <span className="rp-cursor rp-cursor--sub" />
            )}
          </p>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <div className="rp-role-wrap">
              <label className="rp-role-label">I am a</label>
              <SegmentedControl
                {...form.getInputProps('role')}
                fullWidth size="xs"
                data={[
                  { label: 'Patient', value: 'PATIENT' },
                  { label: 'Doctor', value: 'DOCTOR' },
                  { label: 'Admin', value: 'ADMIN' },
                ]}
              />
            </div>

            <div className="rp-field">
              <label className="rp-label">Full Name</label>
              <TextInput {...form.getInputProps('name')} variant="unstyled" size="md" placeholder="John Doe" />
            </div>
            <div className="rp-field">
              <label className="rp-label">Email</label>
              <TextInput {...form.getInputProps('email')} variant="unstyled" size="md" placeholder="you@example.com" />
            </div>
            <div className="rp-field">
              <label className="rp-label">Password</label>
              <PasswordInput {...form.getInputProps('password')} variant="unstyled" size="md" placeholder="••••••••" />
            </div>
            <div className="rp-field">
              <label className="rp-label">Confirm Password</label>
              <PasswordInput {...form.getInputProps('confirmPassword')} variant="unstyled" size="md" placeholder="••••••••" />
            </div>

            <div className="rp-btn-wrap">
              <Button loading={loading} type="submit" fullWidth className="rp-btn">
                {loading ? '' : 'Create Account'}
              </Button>
            </div>
          </form>

          <p className="rp-footer">
            Have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;