'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useList } from '../../app/context/ListContext';

import '../styles/sortableItem.scss';

type SortableItemProps = {
  id: string;
  itemText: string;
  listName: string;
  completed: boolean;
};

const SortableItem = ({
  id,
  itemText,
  listName,
  completed,
}: SortableItemProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const {
    selectedItemIds,
    setSelectedItemIds,
    setLists,
    saveItemsMarkedAsComplete,
    lists,
  } = useList();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const isSelected = selectedItemIds.includes(id);

  const handleDeleteClick = () => {
    setSelectedItemIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleCheckboxToggle = () => {
    const newCompletedState = !completed;

    setIsChecked(true);

    setLists((prevLists) => {
      return prevLists.map((list) => {
        if (!list.items.some((item) => item.id === id)) {
          return list;
        }

        return {
          ...list,
          items: list.items.map((item) =>
            item.id === id ? { ...item, completed: newCompletedState } : item,
          ),
        };
      });
    });

    const list = lists.find((list) =>
      list.items.some((item) => item.id === id),
    );

    if (list) {
      saveItemsMarkedAsComplete(list.id, id, newCompletedState);
    }
  };

  return (
    itemText && (
      <li
        className={`${listName}-list-item all-list-items ${
          isSelected ? 'selected-for-deletion' : ''
        }`}
        ref={setNodeRef}
        style={style}
      >
        <div className='top-section'>
          <label className='mark-complete-checkbox'>
            <input
              type='checkbox'
              checked={completed}
              onChange={handleCheckboxToggle}
              aria-label={`Mark ${itemText} as complete`}
            />
          </label>
          <span className='top-section-text'>
            <span
              className={`completed-item ${
                completed
                  ? isChecked
                    ? 'is-completed interacted'
                    : 'is-completed'
                  : isChecked
                    ? 'not-completed interacted'
                    : ''
              }`}
            >
              {itemText}
            </span>
          </span>
          <div className='drag-handle-wrapper' {...attributes} {...listeners}>
            <i
              className='fa-solid fa-grip-lines'
              style={{ pointerEvents: 'none' }}
            ></i>
          </div>
        </div>
        <div className='bottom-section'>
          <i
            className='fa-solid fa-trash-can'
            onClick={handleDeleteClick}
            style={{ color: isSelected ? 'red' : 'black' }}
          ></i>
        </div>
      </li>
    )
  );
};

export default SortableItem;
