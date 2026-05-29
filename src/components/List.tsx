'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import { useCreateListForm } from '../../app/context/CreateListFormContext';

import '../styles/list.scss';

const List = () => {
  const { lists, selectedListId, setLists } = useCreateListForm();
  const activeList = lists.find((list) => list.id === selectedListId);

  // This MUST come before any conditionals since it is a hook - one of the rules of hooks
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const handleOnDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id !== selectedListId) return list;

          const oldIndex = list.items.findIndex((i) => i.id === active.id);
          const newIndex = list.items.findIndex((i) => i.id === over.id);

          if (oldIndex === -1 || newIndex === -1) return list;

          return {
            ...list,
            items: arrayMove(list.items, oldIndex, newIndex),
          };
        }),
      );
    },
    [setLists, selectedListId],
  );

  const sortableItems = useMemo(
    () => activeList?.items.map((item) => item.id) ?? [],
    [activeList?.items],
  );

  if (lists.length === 0) {
    return (
      <div className='no-lists'>
        You have not created a list yet.{' '}
        <Link href='/create-list/step-1'>Create one now.</Link>
      </div>
    );
  }

  if (!activeList) return null;

  return (
    <div className='list-wrapper'>
      <DndContext sensors={sensors} onDragEnd={handleOnDragEnd}>
        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          <ul className='individual-list-container'>
            {activeList.items.map((item) => (
              <SortableItem
                listName={activeList.listName}
                key={item.id}
                id={item.id}
                itemText={item.itemText}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default List;
