'use client';

import Link from 'next/link';
import { useCreateListForm } from '../../app/context/CreateListFormContext';

const List = () => {
  const { lists } = useCreateListForm();

  if (lists.length === 0) {
    return (
      <div className='no-lists'>
        You have not created a list yet.{' '}
        <Link href='/create-list/step-1'>Create one now.</Link>
      </div>
    );
  }

  return (
    <div className='list-wrapper'>
      {lists.map((list) => (
        <div key={list.id} className='single-list'>
          {list.items.map((item) => (
            <p key={item.id}>{item.itemText}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default List;
