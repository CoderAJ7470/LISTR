'use client';
import { useState, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../context/CreateListFormContext';
import {
  validateListName,
  validateNumberOfItems,
} from '../../../src/helpers/createListFormValidation';

import '../../../src/styles/createList.scss';

const CreateListStep1 = () => {
  const router = useRouter();

  const [listNameInput, setListNameInput] = useState('');
  const [numberOfItemsInput, setNumberOfItemsInput] = useState('');

  // Error messages state
  const [listNameError, setListNameError] = useState('');
  const [numberOfItemsError, setNumberOfItemsError] = useState('');

  // State variables from CreateListFormContext - brought in here to persist number
  // of items between Steps 1 and 2, if use decides to go back to 1, then back to 2
  const { setListName, setNumberOfItems } = useCreateListForm();

  const validate = () => {
    let valid = true;

    if (!validateListName(listNameInput)) {
      setListNameError('List name cannot be blank');
      valid = false;
    } else {
      setListNameError('');
    }

    // Validate number of items using helper
    if (!validateNumberOfItems(numberOfItemsInput)) {
      setNumberOfItemsError('Enter a whole number > 0');
      valid = false;
    } else {
      setNumberOfItemsError('');
    }

    return valid;
  };

  const handleOnListNameInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    const value = e.target.value;
    setListNameInput(value);

    if (listNameError && value !== '') {
      setListNameError('');
    }
  };

  const handleOnNumberOfItemsInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    const value = e.target.value;
    setNumberOfItemsInput(value);

    if (numberOfItemsError && numberOfItemsInput !== '') {
      setNumberOfItemsError('');
    }
  };

  const handleStep2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setListName(listNameInput);
    setNumberOfItems(Number(numberOfItemsInput));

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
          your list later as needed. <br />
          <span className='required-asterisks'>*</span> - Denotes required
          fields.
        </p>
      </div>

      <form className='create-list-form' onSubmit={handleStep2}>
        <label className='step-1-labels' htmlFor='listName'>
          <span className='required-asterisks'>*</span> List Name:
        </label>

        <div className='input-wrapper'>
          <input
            id='listName'
            type='text'
            className='step-one-form-inputs'
            value={listNameInput}
            onChange={handleOnListNameInputChange}
          />
          {listNameError && (
            <span className='error-message'>{listNameError}</span>
          )}
        </div>

        <label className='step-1-labels' htmlFor='numberOfItems'>
          <span className='required-asterisks'>*</span> Number of items:
        </label>

        <div className='input-wrapper'>
          <input
            id='numberOfItems'
            type='text'
            className='step-one-form-inputs'
            inputMode='numeric'
            pattern='[0-9]*'
            value={numberOfItemsInput}
            onChange={handleOnNumberOfItemsInputChange}
          />
          {numberOfItemsError && (
            <span className='error-message'>{numberOfItemsError}</span>
          )}
        </div>

        <button className='form-create-list-button' type='submit'>
          Go to Step 2 <i className='fa-solid fa-arrow-right'></i>
        </button>

        <button className='cancel-button' type='button' onClick={handleCancel}>
          Cancel and go back to home page
        </button>
      </form>
    </>
  );
};

export default CreateListStep1;
