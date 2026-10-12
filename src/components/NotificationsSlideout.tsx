'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '../../app/context/NotificationsSlideoutContext';

import '../styles/notificationsSlideout.scss';

const NotificationsSlideout = () => {
  const [isHidden, setIsHidden] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const [timerWrapperVisibleClassname, setTimerWrapperVisibleClassname] =
    useState('');
  const [timerVisibleClassname, setTimerVisibleClassname] = useState('');

  const { notification } = useNotifications();

  useEffect(() => {
    if (notification) {
      setIsHidden(false);
      setTimerKey((prevKey) => prevKey + 1);

      if (notification.type === 'success') {
        setTimerWrapperVisibleClassname('success');
        setTimerVisibleClassname('success-timer');
      }
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

      <div className={`timer-bar-wrapper ${timerWrapperVisibleClassname}`}>
        <div
          key={timerKey}
          className={`timer-bar ${timerVisibleClassname}`}
          onAnimationEnd={() => setIsHidden(true)}
        ></div>
      </div>
    </div>
  );
};

export default NotificationsSlideout;
