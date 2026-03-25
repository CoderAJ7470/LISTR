'use client';

import { useRouter } from 'next/navigation';
import '../styles/controlPanel.scss';

const ControlPanel = () => {
  const router = useRouter();

  return (
    <div className='add-new-list'>
      <i className='fa-solid fa-circle-plus'></i>
      <button
        className='control-panel-create-list-button'
        onClick={() => router.push('/create-list/step-1')}
      >
        Create a new list
      </button>
    </div>
  );
};

export default ControlPanel;
