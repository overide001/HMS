import { Avatar } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserProfile } from '../../Service/UserService';
import useProtectedImage from '../Utility/Dropzone/useProtectedImage';
import { useMediaQuery } from '@mantine/hooks';

const ProfileMenu = () => {
  const matches = useMediaQuery('(max-width: 768px)');
  const user = useSelector((state: any) => state.user);
  const [picId, setPicId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.id).then((data) => {
      setPicId(data);
    }).catch((error) => {
      console.log(error);
    })
  }, []);

  const url = useProtectedImage(picId);

  return (
      <>
        <style>{`
        .profile-display {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.375rem 0.75rem;
          border-radius: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .profile-display::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.05), rgba(239, 68, 68, 0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 14px;
        }

        .profile-display:hover::before {
          opacity: 1;
        }

        .profile-display:hover {
          transform: translateY(-1px);
        }

        .profile-user-name {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 500;
          font-size: 0.9375rem;
          color: #1A2332;
          letter-spacing: -0.01em;
          position: relative;
          display: inline-block;
        }

        .profile-user-name::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #DC3545, #EF4444);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px;
        }

        .profile-display:hover .profile-user-name::after {
          width: 100%;
        }

        .profile-name-character {
          display: inline-block;
          animation: gentle-wave 2s ease-in-out infinite;
        }

        .profile-display:hover .profile-name-character {
          animation: character-bounce 0.5s ease-in-out;
        }

        @keyframes gentle-wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        @keyframes character-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .profile-avatar-container {
          position: relative;
        }

        .profile-avatar-container::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #DC3545, #EF4444, #F87171);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          animation: spin-gradient 3s linear infinite;
        }

        .profile-display:hover .profile-avatar-container::before {
          opacity: 0.6;
        }

        @keyframes spin-gradient {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .profile-user-avatar {
          position: relative;
          z-index: 1;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
          transition: box-shadow 0.3s ease;
        }

        .profile-display:hover .profile-user-avatar {
          box-shadow: 0 6px 16px rgba(220, 53, 69, 0.3);
        }
      `}</style>

        <div className='profile-display'>
          {!matches && (
              <span className='profile-user-name'>
            {user.name.split('').map((char: string, index: number) => (
                <span
                    key={index}
                    className='profile-name-character'
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                {char}
              </span>
            ))}
          </span>
          )}
          <div className='profile-avatar-container'>
            <Avatar
                className='profile-user-avatar'
                variant='filled'
                src={url}
                size={45}
                alt="Profile"
            />
          </div>
        </div>
      </>
  );
}

export default ProfileMenu;