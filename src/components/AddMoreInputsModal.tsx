import { useState } from 'react';

import '../styles/addMoreInputsModal.scss';

interface AddMoreInputsModalPropTypes {
  showAddMoreInputsModal: boolean;
  setModalOpen: (isOpen: boolean) => void;
  onConfirm: (amount: number) => void;
  remainingInputs: number;
}

const AddMoreInputsModal = ({
  showAddMoreInputsModal,
  setModalOpen,
  onConfirm,
  remainingInputs,
}: AddMoreInputsModalPropTypes) => {
  const [value, setValue] = useState('');

  const numericValue = Number(value);
  const isValidNumber = Number.isInteger(numericValue) && numericValue >= 1;

  const inputsLeft = isValidNumber
    ? remainingInputs - numericValue
    : remainingInputs;

  let helperMessage = '';
  let isErrorMessage = false;
  let isWarningMessage = false;

  if (value === '') {
    helperMessage = `You have ${remainingInputs} inputs left.`;
  } else if (!isValidNumber) {
    helperMessage = 'Enter a valid number.';
    isErrorMessage = true;
  } else if (inputsLeft < 0) {
    helperMessage = 'Maximum 40 inputs only.';
    isErrorMessage = true;
  } else {
    helperMessage = `You have ${inputsLeft} inputs left.`;
    isWarningMessage = inputsLeft === 0;
  }

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
            to your list. Only enter whole positive numbers.
          </p>

          <p>
            <span
              className={`error-span ${isErrorMessage ? 'error-text' : ''} ${isWarningMessage ? 'warning-text' : ''}`}
            >
              {helperMessage}
            </span>
          </p>

          <input
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            min='1'
            step='1'
            className='add-additional-items-input'
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />

          <button
            className='confirm-additional-inputs'
            disabled={
              !Number.isInteger(numericValue) ||
              numericValue < 1 ||
              numericValue > remainingInputs
            }
            onClick={() => {
              const amount = Number(value);
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
