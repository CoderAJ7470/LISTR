import { useList } from '../../app/context/CreateListFormContext';
import { databases } from '../lib/appwrite';
import { DATABASE_ID, TABLE_ID } from '../lib/constants';

interface ConfirmDeleteSelectedItemsProps {
  setShowDeleteItemsModal: (isOpen: boolean) => void;
}

const ConfirmDeleteSelectedItems = ({
  setShowDeleteItemsModal,
}: ConfirmDeleteSelectedItemsProps) => {
  const {
    lists,
    selectedListId,
    selectedItemIds,
    setLists,
    setSelectedItemIds,
  } = useList();

  const handleDeleteSelectedItems = async () => {
    const selectedList = lists.find((list) => list.id === selectedListId);

    if (!selectedList) return;

    // Keep only the items in the list that have not been selected by the user for deletion, create a new array of those items to keep, and then store it in updatedItems
    const updatedItems = selectedList.items.filter(
      (item) => !selectedItemIds.includes(item.id),
    );

    try {
      await databases.updateDocument(DATABASE_ID, TABLE_ID, selectedList.id, {
        listName: selectedList.listName,
        items: JSON.stringify(updatedItems),
      });

      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === selectedList.id ? { ...list, items: updatedItems } : list,
        ),
      );

      setSelectedItemIds([]);
      setShowDeleteItemsModal(false);
    } catch (error) {
      console.error('Error deleting selected list items:', error);
    }
  };

  return (
    <div
      className='delete-modal-overlay'
      onClick={() => {
        setSelectedItemIds([]);
        setShowDeleteItemsModal(false);
      }}
    >
      <div
        className='delete-modal'
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className='delete-modal-title'>Confirm delete</h3>

        <p className='confirm-list-delete-paragraph'>
          Are you sure you want to delete the selected list items?{' '}
          <span className='delete-warning'>This action cannot be undone.</span>
        </p>

        <div className='delete-modal-buttons'>
          <button className='yes-button' onClick={handleDeleteSelectedItems}>
            Yes
          </button>

          <button
            className='cancel-button'
            onClick={() => {
              setSelectedItemIds([]);
              setShowDeleteItemsModal(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteSelectedItems;
