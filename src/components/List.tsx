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
  const { lists, selectedListId, setLists, isLoading, syncDirtyState } =
    useCreateListForm();
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

  /**
   * Handles the sequence of events after the user has finished dragging a SortableItem.
   * This function will a. update list data in which a SortableItem gets dragged and dropped,
   * b. check if the list has actually been updated by the user, and if so,
   */
  const handleOnDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      setLists((prevLists) => {
        let updatedList: any = null;

        const updatedLists = prevLists.map((list) => {
          if (list.id !== selectedListId) return list;

          const oldIndex = list.items.findIndex((i) => i.id === active.id);
          const newIndex = list.items.findIndex((i) => i.id === over.id);

          if (oldIndex === -1 || newIndex === -1) return list;

          updatedList = {
            ...list,
            items: arrayMove(list.items, oldIndex, newIndex),
          };

          return updatedList;
        });

        if (selectedListId && updatedList) {
          syncDirtyState(updatedList);
        }

        return updatedLists;
      });
    },
    [selectedListId, setLists, syncDirtyState],
  );

  const sortableItems = useMemo(
    () => activeList?.items.map((item) => item.id) ?? [],
    [activeList?.items],
  );

  if (isLoading) {
    return (
      <p className='loading-screen'>Retreiving your lists, almost there..</p>
    );
  }

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
