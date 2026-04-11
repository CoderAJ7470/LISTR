import { useState } from 'react';
// import { useCreateListForm } from '../../app/context/CreateListFormContext';

import '../styles/addMoreInputsModal.scss';

interface AddMoreInputsModalPropTypes {
  showAddMoreInputsModal: boolean;
  setModalOpen: (isOpen: boolean) => void;
  onConfirm: (amount: number) => void;
}

const AddMoreInputsModal = ({
  showAddMoreInputsModal,
  setModalOpen,
  onConfirm,
}: AddMoreInputsModalPropTypes) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    showAddMoreInputsModal && (
      <section
        className='add-more-inputs-modal-overlay'
        onClick={() => setModalOpen(false)} // click on overlay closes modal
      >
        <div
          className='add-more-inputs-modal'
          onClick={(e) => e.stopPropagation()} // prevent modal click from closing
        >
          <p>
            Choose how many additional item inputs you would like to add below
            to your list. Only enter whole positive numbers, and remember you
            can only have a total of 40 items.
          </p>

          <input
            type='number'
            inputMode='numeric'
            pattern='[0-9]*'
            min='1'
            step='1'
            className='add-additional-items-input'
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError('');
            }}
          />
          <span
            className={`additional-inputs-error-message ${!error ? 'error-hidden' : ''}`}
          >
            {error}
          </span>

          <button
            className='confirm-additional-inputs'
            onClick={() => {
              const amount = Number(value);

              if (!Number.isInteger(amount) || amount < 1) {
                setError('Enter a valid number (1 or more)');
                return;
              }

              setError('');
              onConfirm(amount);
              setModalOpen(false);
              setValue('');
            }}
          >
            Confirm
          </button>

          <button
            className='close-add-more-inputs-modal'
            onClick={() => {
              setModalOpen(false);
              setError('');
              setValue('');
            }}
          >
            Cancel
          </button>
        </div>
      </section>
    )
  );
};

export default AddMoreInputsModal;
