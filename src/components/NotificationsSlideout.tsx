'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '../../app/context/NotificationsSlideoutContext';

import '../styles/notificationsSlideout.scss';

const NotificationsSlideout = () => {
  const [isHidden, setIsHidden] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  const { notification } = useNotifications();

  useEffect(() => {
    if (notification) {
      setIsHidden(false);
      setTimerKey((prevKey) => prevKey + 1);
    }
  }, [notification]);

  if (!notification) {
    return null;
  }

  return (
    <div className={`notification-slideout ${isHidden ? 'hidden' : ''}`}>
      <div className='notification-slideout-main-content'>
        <div className='notification-slideout-message'>
          {notification.message}
        </div>

        <button
          className='notification-slideout-close-button'
          type='button'
          onClick={() => {
            setIsHidden(true);
          }}
        >
          <span>X</span>
        </button>
      </div>

      <div className='timer-bar-wrapper'>
        <div
          key={timerKey}
          className='timer-bar'
          onAnimationEnd={() => setIsHidden(true)}
        ></div>
      </div>
    </div>
  );
};

export default NotificationsSlideout;
