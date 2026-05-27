'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import '../styles/sortableItem.scss';

type SortableItemProps = {
  id: string;
  itemText: string;
  listName: string;
};

const SortableItem = ({ id, itemText, listName }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    itemText && (
      <li
        className={`${listName}-list-item all-list-items`}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div className='top-section'>{itemText}</div>
        <div className='bottom-section'>Icons and such</div>
      </li>
    )
  );
};

export default SortableItem;
