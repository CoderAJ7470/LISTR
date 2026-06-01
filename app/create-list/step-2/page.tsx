'use client';

import AddMoreInputsModal from '../../../src/components/AddMoreInputsModal';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../context/CreateListFormContext';
import { v4 as uuidv4 } from 'uuid';
import { databases } from '../../../src/lib/appwrite';
import { DATABASE_ID, TABLE_ID } from '../../../src/lib/constants';

import '../../../src/styles/createList.scss';

const CreateListStep2 = () => {
  const MAX_ITEMS = 40;
  const [openMoreItems, setOpenMoreItems] = useState(false);
  const { numberOfItems, setLists, listName, setSelectedListId } =
    useCreateListForm();

  const router = useRouter();

  const [items, setItems] = useState(
    Array.from({ length: numberOfItems }, () => ({
      id: uuidv4(),
      itemText: '',
    })),
  );

  const remainingInputs = MAX_ITEMS - items.length;

  // First input-specific error (required)
  const [firstItemError, setFirstItemError] = useState('');

  // KEEP FOR NOW; TO BE REMOVED LATER
  useEffect(() => {
    console.log('Appwrite client initialized:', databases);
  }, []);

  /**
   * Add more item inputs for the user to fill and complete creating their list
   *
   * @param amount - The number of additional item inputs the user wants to create their list
   * @returns - just exits the function if the user enters a negative integer or non-integer
   */
  const handleConfirmAddMoreItems = (amount: number) => {
    if (!Number.isInteger(amount) || amount < 1) return;

    if (remainingInputs <= 0) return;

    const safeAmount = Math.min(amount, remainingInputs);

    setItems((prev) => [
      ...prev,
      ...Array.from({ length: safeAmount }, () => ({
        id: uuidv4(),
        itemText: '',
      })),
    ]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newListId = uuidv4();

    // Ensure at least one item is filled anywhere
    const hasAtLeastOneItem = items.some((item) => item.itemText.trim() !== '');

    if (!hasAtLeastOneItem) {
      setFirstItemError('At least 1 item required');

      const firstInput = document.getElementById(`item-${items[0]?.id}`);
      firstInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return;
    }

    // Automatically remove any blank inputs after index 0
    const listWithBlanksRemoved = items.filter(
      (item, index) => index === 0 || item.itemText.trim() !== '',
    );

    const newList = await databases.createDocument(
      DATABASE_ID,
      TABLE_ID,
      newListId,
      {
        listName,
        items: JSON.stringify(listWithBlanksRemoved),
      },
    );

    setLists((prev) => [
      ...prev,
      {
        id: newListId,
        listName,
        items: listWithBlanksRemoved,
      },
    ]);

    setSelectedListId(newListId);

    // Clear first-item error if any
    setFirstItemError('');

    router.push('/');
  };

  const handleCancelButton = () => {
    router.push('/create-list/step-1');
  };

  // Generate input fields dynamically
  const itemInputs = items.map((item, index) => (
    <div className='create-list-item' key={item.id}>
      {index === 0 ? (
        <label htmlFor={`item-${item.id}`}>
          <span className='required-asterisks'>*</span> Item/Description{' '}
          {index + 1}:
        </label>
      ) : (
        <div className='list-item-wrapper'>
          <label htmlFor={`item-${item.id}`}>
            Item/Description {index + 1}:
          </label>
        </div>
      )}

      <input
        type='text'
        id={`item-${item.id}`}
        className='step-2-form-inputs'
        name={`item-${item.id}`}
        value={item.itemText}
        onChange={(e) => {
          const value = e.target.value;

          setItems((prev) =>
            prev.map((currItem) =>
              currItem.id === item.id
                ? { ...currItem, itemText: value }
                : currItem,
            ),
          );

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
