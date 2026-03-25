'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../context/CreateListFormContext';
import '../../../src/styles/createList.scss';

const CreateListStep1 = () => {
  const router = useRouter();

  // Grabbing the context setters so we can send in the number of items converted to number (from a string type)
  const { setListName, setNumberOfItems } = useCreateListForm();

  // Local state for inputs
  const [listNameInput, setListNameInput] = useState('');
  const [numberOfItemsInput, setNumberOfItemsInput] = useState('');

  const isValid = listNameInput.trim() !== '' && Number(numberOfItemsInput) > 0;

  const handleStep2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    // Update Context with proper types
    setListName(listNameInput);
    setNumberOfItems(Number(numberOfItemsInput)); // number passed to Context

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
          className='form-inputs'
          value={listNameInput}
          onChange={(e) => setListNameInput(e.target.value)}
        />

        <label htmlFor='numberOfItems'>*Number of list items:</label>
        <input
          id='numberOfItems'
          type='text'
          className='form-inputs'
          inputMode='numeric'
          pattern='[0-9]*'
          value={numberOfItemsInput}
          onChange={(e) => setNumberOfItemsInput(e.target.value)}
        />

        <button
          className='form-create-list-button'
          type='submit'
          disabled={!isValid}
        >
          Go to Step 2{' '}
          <i className='fa-solid fa-arrow-right' aria-disabled={!isValid}></i>
        </button>

        <button className='cancel-button' type='button' onClick={handleCancel}>
          Cancel and go back to home page
        </button>
      </form>
    </>
  );
};

export default CreateListStep1;
