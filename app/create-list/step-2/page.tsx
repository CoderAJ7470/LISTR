'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../context/CreateListFormContext';

import '../../../src/styles/createList.scss';

const CreateListStep2 = () => {
  const router = useRouter();
  const { numberOfItems } = useCreateListForm();

  const [items, setItems] = useState<string[]>(
    Array.from({ length: numberOfItems }, () => ''),
  );

  // First input-specific error (required)
  const [firstItemError, setFirstItemError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure first item is filled
    if (items[0].trim() === '') {
      setFirstItemError('At least 1 item required');

      // Scroll first input into view
      const firstInput = document.getElementById('item-0');
      firstInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return;
    }

    // Automatically remove any blank inputs after index 0
    const cleanedItems = [
      items[0],
      ...items.slice(1).filter((item) => item.trim() !== ''),
    ];
    setItems(cleanedItems);

    // Clear first-item error if any
    setFirstItemError('');

    // Continue with submission logic
    console.log('Final items to submit:', cleanedItems);
  };

  const handleCancelButton = () => {
    router.push('/create-list/step-1');
  };

  // Generate input fields dynamically
  const itemInputs = items.map((item, index) => (
    <div className='create-list-item' key={index}>
      {index === 0 ? (
        <label htmlFor={`item-${index}`}>
          <span className='required-asterisks'>*</span> Item/Description{' '}
          {index + 1}:
        </label>
      ) : (
        <div className='list-item-wrapper'>
          <label htmlFor={`item-${index}`}>Item/Description {index + 1}:</label>
        </div>
      )}

      <input
        type='text'
        id={`item-${index}`}
        className='step-2-form-inputs'
        name={`item-${index}`}
        value={item}
        onChange={(e) => {
          const updatedItems = [...items];
          updatedItems[index] = e.target.value;
          setItems(updatedItems);

          // Clear first-item error if fixed
          if (index === 0 && firstItemError && e.target.value.trim() !== '') {
            setFirstItemError('');
          }
        }}
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
        Fill out your list items below. Any blank inputs (except the first one)
        will automatically be removed when you create your list. You can always
        make changes later as needed. <br />
        <br />
        <span className='required-asterisks'>*</span> - Denotes required fields.
      </p>

      <form className='create-list-form' onSubmit={handleSubmit}>
        {itemInputs}

        <button type='submit' className='form-create-list-button'>
          Create my list <i className='fa-solid fa-arrow-right'></i>
        </button>

        <button type='button' className='step-2-add-items-button'>
          Add more items
        </button>

        <button
          type='button'
          className='cancel-button'
          onClick={handleCancelButton}
        >
          Cancel and start over
        </button>
      </form>
    </div>
  );
};

export default CreateListStep2;
