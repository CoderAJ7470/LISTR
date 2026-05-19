'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import '../styles/sortableItem.scss';

type Props = {
  id: string;
  itemText: string;
};

const SortableItem = ({ id, itemText }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ul className='dndkit-ul-list'>
      <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {itemText}
      </li>
    </ul>
  );
};

export default SortableItem;
