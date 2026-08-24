'use client';

import AddMoreInputsModal from '../../../src/components/AddMoreInputsModal';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useList } from '../../context/CreateListFormContext';
import { v4 as uuidv4 } from 'uuid';
import { databases } from '../../../src/lib/appwrite';
import { DATABASE_ID, TABLE_ID } from '../../../src/lib/constants';

import '../../../src/styles/createList.scss';

const CreateOrEditList = () => {
  const MAX_ITEMS = 40;
  const [openMoreItems, setOpenMoreItems] = useState(false);
  const {
    numberOfItems,
    lists,
    setLists,
    listName,
    setSelectedListId,
    setCompareLists,
  } = useList();

  const router = useRouter();

  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const listId = searchParams.get('listId');

  const currentList = lists.find((list) => list.id === listId);

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

  useEffect(() => {
    if (mode === 'editList' && currentList) {
      setItems(currentList.items);
    }
  }, [mode, currentList]);

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

    if (mode === 'editList') {
      if (!currentList) return;

      const editedItems = items.filter((item) => item.itemText.trim() !== '');

      const updatedList = {
        id: currentList.id,
        listName: currentList.listName,
        items: editedItems,
      };

      // Updating the Appwrite DB immediately upon save
      await databases.updateDocument(DATABASE_ID, TABLE_ID, updatedList.id, {
        listName: updatedList.listName,
        items: JSON.stringify(updatedList.items),
      });

      // To ensure the homepage displays the updated list correctly
      setLists((prev) =>
        prev.map((list) => (list.id === updatedList.id ? updatedList : list)),
      );

      // Need to update the compareLists as well in order to ensure that re-ordering updates the comparison state correctly i.e. to make sure the Save changes button and its alert display correctly
      setCompareLists((prev) =>
        prev.map((list) => (list.id === updatedList.id ? updatedList : list)),
      );

      // Return to the homepage
      router.push('/');

      return;
    }

    const newListId = uuidv4();

    // Ensure at least one item is filled anywhere
    const hasAtLeastOneItem = items.some((item) => item.itemText.trim() !== '');

    if (!hasAtLeastOneItem) {
      setFirstItemError('At least 1 item required');

      const firstInput = document.getElementById(`item-${items[0]?.id}`);
      firstInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return;
    }

    // Automatically remove any blank inputs before saving
    const listWithBlanksRemoved = items.filter(
      (item) => item.itemText.trim() !== '',
    );

    // Here, "newlyCreatedListFromAppwrite" is essentially the list (document) that Appwrite is returning back after having it saved in the DB i.e. the user creates the list, it gets saved to Appwrite, and then Appwrite is returning said list back to us, which is stored in this variable"
    const newlyCreatedListFromAppwrite = await databases.createDocument(
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
        listName: newlyCreatedListFromAppwrite.listName,
        items: JSON.parse(newlyCreatedListFromAppwrite.items),
      },
    ]);

    setCompareLists((prev) => [
      ...prev,
      {
        id: newListId,
        listName: newlyCreatedListFromAppwrite.listName,
        items: JSON.parse(newlyCreatedListFromAppwrite.items),
      },
    ]);

    setSelectedListId(newListId);

    // Clear first-item error if any
    setFirstItemError('');

    router.push('/');
  };

  const handleCancelButton = () => {
    if (mode === 'editList') {
      router.push('/');
      return;
    }

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
      <h3>
        {mode === 'createList'
          ? 'Create a new list - Step 2'
          : 'Edit current list'}
      </h3>

      <p>
        {mode === 'createList'
          ? `Fill out your ${items.length} list items below.`
          : `Edit the list items you want to change below.`}{' '}
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
            {mode === 'createList' ? 'Create my list' : 'Save changes to list'}{' '}
            <i className='fa-solid fa-arrow-right'></i>
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
            {mode === 'editList'
              ? 'Cancel and go back to lists'
              : 'Cancel and start over'}
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

const CreateOrEditListPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateOrEditList />
    </Suspense>
  );
};

export default CreateOrEditListPage;
