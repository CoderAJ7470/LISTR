'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useList } from '../../app/context/CreateListFormContext';

import '../styles/sortableItem.scss';

type SortableItemProps = {
  id: string;
  itemText: string;
  listName: string;
};

const SortableItem = ({ id, itemText, listName }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { selectedItemIds, setSelectedItemIds } = useList();

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
          <span className='top-section-text'>{itemText}</span>
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
