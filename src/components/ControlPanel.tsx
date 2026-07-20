'use client';

import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../app/context/CreateListFormContext';

import '../styles/controlPanel.scss';
import { useEffect, useState } from 'react';

const ControlPanel = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showListActions, setShowListActions] = useState(false);

  const router = useRouter();
  const { editedListIds, saveEditedLists } = useCreateListForm();
  const totalChanges = editedListIds.length;
  const hasUnsavedChanges = editedListIds.length > 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className='control-panel-wrapper'>
      <button
        className='control-panel-create-list-button'
        onClick={() => router.push('/create-list/step-1')}
      >
        <i className='fa-solid fa-circle-plus'></i>
      </button>

      <div className='list-actions-button-wrapper'>
        <button
          className='control-panel-list-actions-button'
          onClick={() => setShowListActions((prev) => !prev)}
        >
          List Actions
        </button>

        <div
          className={`list-actions-button-menu ${
            showListActions ? 'visible' : ''
          }`}
        >
          <button className='list-actions-button-menu-item'>
            Edit Current List
          </button>

          <button className='list-actions-button-menu-item'>Test Button</button>
        </div>
      </div>

      <button
        className='control-panel-save-changes-button'
        disabled={isMounted ? !hasUnsavedChanges : false}
        onClick={() => saveEditedLists()}
      >
        Save changes
        <span
          className={`alert-on-save-changes-button ${
            hasUnsavedChanges ? 'alert-visible' : ''
          }`}
        >
          {hasUnsavedChanges && totalChanges}
        </span>
      </button>
    </div>
  );
};

export default ControlPanel;
