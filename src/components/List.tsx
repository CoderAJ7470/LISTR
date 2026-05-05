'use client';

import Link from 'next/link';
import { useCreateListForm } from '../../app/context/CreateListFormContext';

const List = () => {
  const { listName, items } = useCreateListForm();

  if (items.length === 0) {
    return (
      <div className='no-lists'>
        You have not created a list yet.{' '}
        <Link href='/create-list/step-1'>Create one now.</Link>
      </div>
    );
  }

  return (
    <div className='list-wrapper'>
      <div>{listName}</div>
      {items.map((item) => (
        <p key={item.id}>{item.itemText}</p>
      ))}
    </div>
  );
};

export default List;
