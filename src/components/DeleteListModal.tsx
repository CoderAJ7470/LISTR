import { useList } from '../../app/context/CreateListFormContext';
import { databases } from '../lib/appwrite';
import { DATABASE_ID, TABLE_ID } from '../lib/constants';

interface DeleteModalProps {
  listId: string;
  listName: string | undefined;
  setShowDeleteModal: (isOpen: boolean) => void;
}

const DeleteListModal = ({
  listId,
  listName,
  setShowDeleteModal,
}: DeleteModalProps) => {
  const { setLists } = useList();

  const handleDeleteList = async () => {
    try {
      await databases.deleteDocument(DATABASE_ID, TABLE_ID, listId);

      setLists((prev) => prev.filter((list) => list.id !== listId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  return (
    <div
      className='delete-modal-overlay'
      onClick={() => setShowDeleteModal(false)}
    >
      <div
        className='delete-modal'
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className='delete-modal-title'>Confirm delete</h3>

        <p className='confirm-list-delete-paragraph'>
          Are you sure you want to delete {listName} from your lists?{' '}
          <span className='delete-warning'>This action cannot be undone.</span>
        </p>

        <div className='delete-modal-buttons'>
          <button className='yes-button' onClick={handleDeleteList}>
            Yes
          </button>
          <button
            className='cancel-button'
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListModal;
