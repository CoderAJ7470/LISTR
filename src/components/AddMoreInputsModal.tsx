// import { useCreateListForm } from '../../app/context/CreateListFormContext';

import '../styles/addMoreInputsModal.scss';

interface AddMoreInputsModalPropTypes {
  showAddMoreInputsModal: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

const AddMoreInputsModal = ({
  showAddMoreInputsModal,
  setModalOpen,
}: AddMoreInputsModalPropTypes) => {
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
          <p>Choose how many inputs you would like to add to your list below</p>

          <button className='confirm-additional-inputs'>Confirm</button>
          <button
            className='close-add-more-inputs-modal'
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </section>
    )
  );
};

export default AddMoreInputsModal;
