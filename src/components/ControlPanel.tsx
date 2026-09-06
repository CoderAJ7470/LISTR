'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useList } from '../../app/context/CreateListFormContext';
import ConfirmDeleteListModal from './ConfirmDeleteListModal';
import ConfirmDeleteSelectedItems from './ConfirmDeleteSelectedItems';

import '../styles/controlPanel.scss';
import '../styles/deleteListModal.scss';

const ControlPanel = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showListActions, setShowListActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteItemsModal, setShowDeleteItemsModal] = useState(false);

  const router = useRouter();
  const {
    editedListIds,
    saveEditedLists,
    selectedListId,
    lists,
    selectedItemIds,
  } = useList();
  const totalChanges = editedListIds.length;
  const hasUnsavedChanges = editedListIds.length > 0;

  const listName = lists.find((list) => list.id === selectedListId)?.listName;

  const listActionsButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!showListActions) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        listActionsButtonRef.current &&
        !listActionsButtonRef.current.contains(event.target as Node)
      ) {
        setShowListActions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showListActions]);

  return (
    <div className='control-panel-wrapper'>
      <button
        className='control-panel-create-list-button'
        onClick={() => router.push('/create-list/step-1')}
      >
        <i className='fa-solid fa-circle-plus'></i>
      </button>

      <div className='list-actions-button-wrapper' ref={listActionsButtonRef}>
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
          <button
            className='list-actions-buttons'
            onClick={() =>
              router.push(
                `/create-list/step-2?mode=editList&listId=${selectedListId}`,
              )
            }
          >
            Edit Current List
          </button>

          <button
            className='list-actions-buttons'
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Current List
          </button>

          <button
            className='list-actions-buttons delete-items-button'
            onClick={() => setShowDeleteItemsModal(true)}
            disabled={selectedItemIds.length === 0}
          >
            Delete List Items
          </button>
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

      {/* Programmatically render the ConfirmDeleteList modal */}
      {showDeleteModal && selectedListId && (
        <ConfirmDeleteListModal
          listId={selectedListId}
          listName={listName}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}

      {/* Programmatically render the ConfirmDeleteSelectedItems modal */}
      {showDeleteItemsModal && (
        <ConfirmDeleteSelectedItems
          setShowDeleteItemsModal={setShowDeleteItemsModal}
        />
      )}
    </div>
  );
};

export default ControlPanel;
