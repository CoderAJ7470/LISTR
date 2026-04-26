'use client';

import AddMoreInputsModal from '../../../src/components/AddMoreInputsModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../context/CreateListFormContext';

import '../../../src/styles/createList.scss';

const CreateListStep2 = () => {
  const MAX_ITEMS = 40;
  const [openMoreItems, setOpenMoreItems] = useState(false);

  const router = useRouter();
  const { numberOfItems } = useCreateListForm();

  const [items, setItems] = useState<string[]>(
    Array.from({ length: numberOfItems }, () => ''),
  );

  const remainingInputs = MAX_ITEMS - items.length;

  // First input-specific error (required)
  const [firstItemError, setFirstItemError] = useState('');

  /**
   * Add more item inputs for the user to fill and complete creating their list
   *
   * @param amount - The number of additional item inputs the user wants to create their list
   * @returns  - just exits the function if the user enters a negative integer or non-integer
   */
  const handleConfirmAddMoreItems = (amount: number) => {
    if (!Number.isInteger(amount) || amount < 1) return;

    if (remainingInputs <= 0) return;

    const safeAmount = Math.min(amount, remainingInputs);

    setItems((prev) => [
      ...prev,
      ...Array.from({ length: safeAmount }, () => ''),
    ]);
  };

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
    const listWithBlanksRemoved = [
      items[0],
      ...items.slice(1).filter((item) => item.trim() !== ''),
    ];
    setItems(listWithBlanksRemoved);

    // Clear first-item error if any
    setFirstItemError('');
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
        Fill out your {items.length} list items below.{' '}
        <b>
          Any blank inputs (except the first one) will automatically be removed
          when you create your list.{' '}
        </b>{' '}
        Add additional inputs using the "Add more items" button below, but{' '}
        <b>keep in mind your list can have only 40 items total.</b> You can
        always make changes later as needed. <br />
        <span className='required-asterisks'>*</span> - Denotes required fields.
      </p>

      <form className='create-list-form' onSubmit={handleSubmit}>
        {itemInputs}

        <section className='step-2-options'>
          <button type='submit' className='form-create-list-button'>
            Create my list <i className='fa-solid fa-arrow-right'></i>
          </button>

          <button
            type='button'
            className='step-2-add-items-button'
            onClick={() => setOpenMoreItems(true)}
            disabled={items.length >= MAX_ITEMS}
          >
            Add more items
          </button>

          <button
            type='button'
            className='cancel-button'
            onClick={handleCancelButton}
          >
            Cancel and start over
          </button>
        </section>
      </form>

      <AddMoreInputsModal
        showAddMoreInputsModal={openMoreItems}
        setModalOpen={setOpenMoreItems}
        onConfirm={handleConfirmAddMoreItems}
        remainingInputs={remainingInputs}
      />
    </div>
  );
};

export default CreateListStep2;
