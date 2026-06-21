'use client';

// import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../app/context/CreateListFormContext';

import '../styles/controlPanel.scss';
import { useEffect, useState } from 'react';

const ControlPanel = () => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const { lists, editedListIds, saveEditedLists } = useCreateListForm();
  const totalChanges = editedListIds.length;
  const hasUnsavedChanges = editedListIds.length > 0;

  console.log('lists: ', lists);
  console.log('edited list ids ', editedListIds);
  console.log('has unsaved? ', hasUnsavedChanges);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className='add-new-list'>
      <button
        className='control-panel-create-list-button'
        onClick={() => router.push('/create-list/step-1')}
      >
        <i className='fa-solid fa-circle-plus'></i>
        Add a new list
      </button>
      <button
        className='save-changes-button'
        disabled={isMounted ? !hasUnsavedChanges : false}
        onClick={() => saveEditedLists()}
      >
        Save changes
        <span
          className={`alert-on-save-changes-button ${hasUnsavedChanges ? 'alert-visible' : ''}`}
        >
          {hasUnsavedChanges && totalChanges}
        </span>
      </button>
    </div>
  );
};

export default ControlPanel;
