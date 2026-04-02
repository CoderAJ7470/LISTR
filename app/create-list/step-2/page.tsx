'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../context/CreateListFormContext';

import '../../../src/styles/createList.scss';

const CreateListStep2 = () => {
  const [firstItemValue, setFirstItemValue] = useState('');
  const [firstItemError, setFirstItemError] = useState('');

  const router = useRouter();
  const { numberOfItems } = useCreateListForm();

  // Handle the user input from the first entry of the list item entry form
  const handleFirstItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstItemValue(value);

    if (firstItemError && value !== '') {
      setFirstItemError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (firstItemValue.trim() === '') {
      setFirstItemError('First item cannot be blank');
      return;
    }

    // continue later (next step / review page)
  };

  const handleCancel = () => {
    router.push('/create-list/step-1');
  };

  // Create an array so we can map over it to dynamically generate the list item labels and inputs
  const itemInputs = Array.from({ length: numberOfItems }, (_, index) => (
    <div className='create-list-item' key={index}>
      {index === 0 ? (
        <div className='list-item-wrapper'>
          <label htmlFor={`item-${index}`}>
            <span className='required-asterisks'>*</span> Item/Desc {index + 1}:
          </label>
          <button
            type='button'
            className='remove-create-list-item-button required-or-warning'
            aria-label={`Remove item ${index + 1}`}
          >
            <i className='fa-solid fa-circle-minus'></i>
          </button>
        </div>
      ) : (
        <div className='list-item-wrapper'>
          <label htmlFor={`item-${index}`}>Item/Desc {index + 1}:</label>
          <button
            type='button'
            className='remove-create-list-item-button required-or-warning'
            aria-label={`Remove item ${index + 1}`}
          >
            <i className='fa-solid fa-circle-minus'></i>
          </button>
        </div>
      )}

      <input
        type='text'
        id={`item-${index}`}
        className='step-2-form-inputs'
        name={`item-${index}`}
        value={index === 0 ? firstItemValue : undefined}
        onChange={index === 0 ? handleFirstItemChange : undefined}
      />

      {index === 0 && firstItemError && (
        <span className='step-2-error-message'>{firstItemError}</span>
      )}
    </div>
  ));

  return (
    <div className='create-new-list-header'>
      <h3>Create a new list - Step 2</h3>

      <p>
        Fill out your list items details below. You can always make changes
        later as needed. <br />* - Denotes required fields.
      </p>

      <form className='create-list-form' onSubmit={handleSubmit}>
        {itemInputs}

        <button type='submit' className='form-create-list-button'>
          Review & Confirm
        </button>

        <button type='button' className='step-2-add-items-button'>
          Add more items
        </button>

        <button type='button' className='cancel-button' onClick={handleCancel}>
          Cancel and start over
        </button>
      </form>
    </div>
  );
};

export default CreateListStep2;
