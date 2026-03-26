import ProfileMenu from './ProfileMenu';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeJwt } from '../../Slices/JwtSlice';
import { removeUser } from '../../Slices/UserSlice';
import SideDrawer from '../SideDrawer/SideDrawer';
import { useMediaQuery } from '@mantine/hooks';

const Header = () => {
    const dispatch = useDispatch();
    const jwt = useSelector((state: any) => state.jwt);
    const handleLogout = () => {
        dispatch(removeJwt());
        dispatch(removeUser());
    };
    const matches = useMediaQuery('(max-width: 768px)');

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                .modern-header {
                    position: sticky;
                    top: 0;
                    width: 100%;
                    height: 70px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(220, 53, 69, 0.08);
                    z-index: 1;
                    transition: all 0.3s ease;
                }

                .modern-header::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(220, 53, 69, 0.4) 50%,
                        transparent
                    );
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .modern-header:hover::before {
                    opacity: 1;
                }

                .header-container {
                    max-width: 1400px;
                    height: 100%;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .header-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .brand-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #DC3545 0%, #EF4444 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .brand-icon:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
                }

                .brand-icon svg {
                    width: 24px;
                    height: 24px;
                    stroke: white;
                    stroke-width: 2.5;
                }

                .brand-text {
                    font-size: 1.25rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #DC3545 0%, #EF4444 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.02em;
                }

                .header-nav {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .modern-btn {
                    position: relative;
                    padding: 0.625rem 1.5rem;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                }

                .logout-btn {
                    color: #DC3545;
                    background: white;
                    border: 1.5px solid rgba(220, 53, 69, 0.2);
                }

                .logout-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(220, 53, 69, 0.05), rgba(220, 53, 69, 0.1));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .logout-btn:hover {
                    border-color: rgba(220, 53, 69, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(220, 53, 69, 0.15);
                }

                .logout-btn:hover::before {
                    opacity: 1;
                }

                .logout-btn:active {
                    transform: translateY(0);
                }

                .login-btn {
                    color: white;
                    background: linear-gradient(135deg, #DC3545 0%, #EF4444 100%);
                    border: 1.5px solid transparent;
                    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.25);
                }

                .login-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.35);
                }

                .login-btn:hover::after {
                    opacity: 1;
                }

                .login-btn:active {
                    transform: translateY(0);
                }

                .btn-content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .login-link {
                    text-decoration: none;
                }

                .profile-container {
                    padding: 0.375rem;
                    border-radius: 10px;
                    transition: background 0.2s ease;
                }

                .profile-container:hover {
                    background: rgba(220, 53, 69, 0.05);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .header-container {
                        padding: 0 1.25rem;
                    }

                    .brand-text {
                        font-size: 1.125rem;
                    }

                    .brand-icon {
                        width: 36px;
                        height: 36px;
                    }

                    .brand-icon svg {
                        width: 20px;
                        height: 20px;
                    }

                    .header-nav {
                        gap: 1rem;
                    }

                    .modern-btn {
                        padding: 0.5rem 1.25rem;
                        font-size: 0.875rem;
                    }
                }

                @media (max-width: 480px) {
                    .modern-header {
                        height: 64px;
                    }

                    .header-container {
                        padding: 0 1rem;
                    }

                    .brand-text {
                        display: none;
                    }

                    .header-nav {
                        gap: 0.75rem;
                    }

                    .modern-btn {
                        padding: 0.5rem 1rem;
                        font-size: 0.8125rem;
                    }
                }
            `}</style>

            <header className='modern-header'>
                <div className='header-container'>
                    <div className='header-brand'>
                        {matches && <SideDrawer />}


                    </div>

                    <nav className='header-nav'>
                        {jwt ? (
                            <>
                                <button className='modern-btn logout-btn' onClick={handleLogout}>
                                    <span className='btn-content'>Logout</span>
                                </button>
                                <div className='profile-container'>
                                    <ProfileMenu />
                                </div>
                            </>
                        ) : (
                            <Link to="login" className='login-link'>
                                <button className='modern-btn login-btn'>
                                    <span className='btn-content'>
                                        Login
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M5 12h14m-7-7l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </button>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;