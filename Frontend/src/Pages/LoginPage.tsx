import { Button, PasswordInput, TextInput } from '@mantine/core';
import { IconHeartbeat } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../Service/UserService';
import { errorNotification, successNotification } from '../Utility/NotificationUtil';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setJwt } from '../Slices/JwtSlice';
import { setUser } from '../Slices/UserSlice';

const HEADING = 'Sign in';
const SUBHEADING = 'Welcome back — good to see you again';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [headingText, setHeadingText]     = useState('');
  const [subText, setSubText]             = useState('');
  const [headingDone, setHeadingDone]     = useState(false);

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
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (!value ? 'Password is required' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    loginUser(values)
      .then((_data) => {
        successNotification('Logged in Successfully.');
        dispatch(setJwt(_data));
        dispatch(setUser(jwtDecode(_data)));
      })
      .catch((error) => { errorNotification(error?.response?.data?.errorMessage); })
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

        .lp-root {
          min-height: 100vh; width: 100vw;
          background: var(--p100);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Poppins', sans-serif;
          overflow: hidden; position: relative;
        }

        .lp-bg-circle { position: fixed; border-radius: 50%; pointer-events: none; }
        .lp-bg-circle-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(250,92,92,0.15) 0%, transparent 70%);
          top: -200px; left: -200px;
          animation: bgFloat 14s ease-in-out infinite alternate;
        }
        .lp-bg-circle-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(250,92,92,0.1) 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation: bgFloat 18s ease-in-out infinite alternate-reverse;
        }
        @keyframes bgFloat {
          from { transform: translate(0,0); } to { transform: translate(40px,30px); }
        }

        .lp-card {
          position: relative; width: 420px;
          background: var(--n100);
          border-radius: 28px;
          padding: 48px 44px 40px;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.04),
            0 8px 24px rgba(0,0,0,0.08),
            0 32px 64px rgba(250,92,92,0.12);
          animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
          overflow: hidden;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .lp-card-stripe {
          position: absolute; top: 0; left: 0; right: 0; height: 5px;
          background: var(--p500);
          border-radius: 28px 28px 0 0;
        }

        .lp-logo {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-bottom: 28px;
          animation: fadeDown 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        .lp-logo-icon { color: var(--p600); animation: heartbeat 1.8s ease-in-out infinite; }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); } 14% { transform: scale(1.15); }
          28%      { transform: scale(1); } 42% { transform: scale(1.08); } 56% { transform: scale(1); }
        }
        .lp-logo-text {
          font-family: 'Merriweather', serif; font-size: 1.9rem; font-weight: 700;
          color: var(--n900); letter-spacing: -0.5px;
        }

        /* ── TYPEWRITER ── */
        .lp-heading {
          text-align: center; margin-bottom: 6px;
          font-family: 'Merriweather', serif; font-size: 1.5rem; font-weight: 600;
          color: var(--n900); min-height: 2rem;
          animation: fadeDown 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }
        .lp-subheading {
          text-align: center; font-size: 0.83rem; color: var(--n600);
          font-weight: 400; margin-bottom: 32px; min-height: 1.2rem;
          animation: fadeDown 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* blinking cursor */
        .lp-cursor {
          display: inline-block;
          width: 2px; height: 1em;
          background: var(--p500);
          margin-left: 2px;
          vertical-align: text-bottom;
          border-radius: 1px;
          animation: blink 0.75s step-end infinite;
        }
        .lp-cursor.lp-cursor--sub {
          width: 1.5px; height: 0.85em;
          background: var(--n600);
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }

        .lp-divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
          animation: fadeDown 0.6s 0.28s cubic-bezier(0.22,1,0.36,1) both;
        }
        .lp-divider-line { flex: 1; height: 1px; background: var(--n300); }
        .lp-divider-dot  { width: 6px; height: 6px; border-radius: 50%; background: var(--p300); }

        .lp-field { margin-bottom: 16px; animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .lp-field:nth-child(1) { animation-delay: 0.3s; }
        .lp-field:nth-child(2) { animation-delay: 0.38s; }

        .lp-label {
          font-size: 0.72rem; font-weight: 600; color: var(--n600);
          letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 7px; display: block;
        }

        .lp-field .mantine-Input-input,
        .lp-field .mantine-PasswordInput-innerInput {
          background: var(--n200) !important; border: 1.5px solid var(--n300) !important;
          border-radius: 12px !important; height: 50px !important; padding: 0 16px !important;
          font-family: 'Poppins', sans-serif !important; font-size: 0.9rem !important;
          color: var(--n900) !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
        }
        .lp-field:focus-within .mantine-Input-input,
        .lp-field:focus-within .mantine-PasswordInput-innerInput {
          border-color: var(--p500) !important; background: var(--n100) !important;
          box-shadow: 0 0 0 3px rgba(250,92,92,0.12) !important;
        }
        .lp-field .mantine-Input-input::placeholder { color: var(--n500) !important; font-weight: 300 !important; }
        .lp-field .mantine-InputWrapper-error {
          font-size: 0.75rem !important; color: var(--p700) !important; margin-top: 5px !important;
        }
        .lp-field .mantine-PasswordInput-visibilityToggle { color: var(--p500) !important; }

        .lp-btn-wrap { margin-top: 8px; animation: fadeUp 0.6s 0.46s cubic-bezier(0.22,1,0.36,1) both; }
        .lp-btn {
          width: 100%; height: 50px !important; border-radius: 12px !important;
          background: var(--p500) !important; font-family: 'Poppins', sans-serif !important;
          font-size: 0.9rem !important; font-weight: 600 !important; letter-spacing: 0.6px !important;
          box-shadow: 0 4px 18px rgba(250,92,92,0.25) !important;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease !important;
        }
        .lp-btn:hover {
          background: var(--p600) !important; transform: translateY(-2px) !important;
          box-shadow: 0 8px 28px rgba(250,92,92,0.35) !important;
        }
        .lp-btn:active { transform: translateY(1px) !important; }

        .lp-footer {
          text-align: center; margin-top: 22px; font-size: 0.82rem; color: var(--n600);
          animation: fadeUp 0.6s 0.54s cubic-bezier(0.22,1,0.36,1) both;
        }
        .lp-footer a { color: var(--p600); font-weight: 600; text-decoration: none; position: relative; }
        .lp-footer a::after {
          content: ''; position: absolute; left: 0; bottom: -1px;
          width: 0; height: 1.5px; background: var(--p500); transition: width 0.25s ease;
        }
        .lp-footer a:hover::after { width: 100%; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .lp-card { width: 92vw; padding: 40px 28px 32px; }
        }
      `}</style>

      <div className="lp-root">
        <div className="lp-bg-circle lp-bg-circle-1" />
        <div className="lp-bg-circle lp-bg-circle-2" />

        <div className="lp-card">
          <div className="lp-card-stripe" />

          <div className="lp-logo">
            <IconHeartbeat size={36} stroke={2.5} className="lp-logo-icon" />
            <span className="lp-logo-text">HAILMIND</span>
          </div>

          <h2 className="lp-heading">
            {headingText}
            {!headingDone && <span className="lp-cursor" />}
          </h2>

          <p className="lp-subheading">
            {subText}
            {headingDone && subText.length < SUBHEADING.length && (
              <span className="lp-cursor lp-cursor--sub" />
            )}
          </p>

          <div className="lp-divider">
            <div className="lp-divider-line" />
            <div className="lp-divider-dot" />
            <div className="lp-divider-line" />
          </div>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <div className="lp-field">
              <label className="lp-label">Email</label>
              <TextInput
                {...form.getInputProps('email')}
                variant="unstyled" size="md"
                placeholder="you@example.com"
              />
            </div>
            <div className="lp-field">
              <label className="lp-label">Password</label>
              <PasswordInput
                {...form.getInputProps('password')}
                variant="unstyled" size="md"
                placeholder="••••••••"
              />
            </div>
            <div className="lp-btn-wrap">
              <Button loading={loading} type="submit" fullWidth className="lp-btn">
                {loading ? '' : 'Login'}
              </Button>
            </div>
          </form>

          <p className="lp-footer">
            Don't have an account?{' '}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;