'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../../src/styles/createList.scss';

const CreateList = () => {
  const router = useRouter();

  const [listName, setListName] = useState('');
  const [numberOfItems, setNumberOfItems] = useState('');

  const isValid = listName.trim() !== '' && Number(numberOfItems) > 0;

  const handleListNameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
  };

  const handleNumOfItemsOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfItems(e.target.value);
  };

  const handleStep2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    router.push('/create-list/step-2');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <>
      <div className='create-new-list-header'>
        <h3>Create a new list - Step 1</h3>
        <p>
          Use the form below to start creating your list. You can always edit
          your list later as needed. <br />* - Denotes required fields.
        </p>
      </div>

      <form className='create-list-form' onSubmit={handleStep2}>
        <label htmlFor='listName'>*List Name:</label>
        <input
          id='listName'
          type='text'
          name='listName'
          value={listName}
          onChange={handleListNameOnChange}
        />

        <label htmlFor='numberOfItems'>*Number of list items:</label>
        <input
          type='text'
          id='numberOfItems'
          inputMode='numeric'
          pattern='[0-9]*'
          name='numberOfItems'
          value={numberOfItems}
          onChange={handleNumOfItemsOnChange}
        />

        <button
          className='form-create-list-button'
          type='submit'
          disabled={!isValid}
        >
          Go to Step 2 <i className='fa-solid fa-arrow-right'></i>
        </button>

        <button className='cancel-button' type='button' onClick={handleCancel}>
          Cancel and go back to home page
        </button>
      </form>
    </>
  );
};

export default CreateList;
