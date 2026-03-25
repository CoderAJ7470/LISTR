'use client';

import { useRouter } from 'next/navigation';
import { useCreateListForm } from '../../context/CreateListFormContext';
import '../../../src/styles/createList.scss';

const CreateListStep2 = () => {
  const router = useRouter();
  const { numberOfItems } = useCreateListForm();

  const handleCancel = () => {
    router.push('/create-list/step-1');
  };

  // Create an array so we can map over it to dynamically generate the list item labels and inputs
  const itemInputs = Array.from({ length: numberOfItems }, (_, index) => (
    <div className='create-list-item' key={index}>
      <label htmlFor={`item-${index}`}>Item/Desc {index + 1}:</label>{' '}
      <input
        type='text'
        id={`item-${index}`}
        className='form-inputs'
        name={`item-${index}`}
      />
    </div>
  ));

  return (
    <div className='create-new-list-header'>
      <h3>Create a new list - Step 2</h3>

      <p>
        Fill out your list's item details below. You can always make changes
        later as needed. <br />* - Denotes required fields.
      </p>

      <form className='create-list-form'>
        {itemInputs}

        <button type='submit' className='form-create-list-button'>
          Review & Confirm
        </button>

        <button className='cancel-button' type='button' onClick={handleCancel}>
          Cancel and start over
        </button>
      </form>
    </div>
  );
};

export default CreateListStep2;
