'use client';

import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../app/context/CreateListFormContext';

import '../styles/controlPanel.scss';

const ControlPanel = () => {
  const router = useRouter();
  const { dirtyListIds } = useCreateListForm();

  const hasUnsavedChanges = dirtyListIds.length > 0;

  return (
    <div className='add-new-list'>
      <button
        className='control-panel-create-list-button'
        onClick={() => router.push('/create-list/step-1')}
      >
        <i className='fa-solid fa-circle-plus'></i>
        Add a new list
      </button>
      <button className='save-changes-button' disabled={!hasUnsavedChanges}>
        Save changes
      </button>
    </div>
  );
};

export default ControlPanel;
