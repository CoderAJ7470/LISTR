interface DeleteModalProps {
  listId: string;
  listName: string | undefined;
}

const DeleteListModal = ({ listId, listName }: DeleteModalProps) => {
  return (
    <div className='delete-modal-overlay'>
      <div className='delete-modal'>
        <h3 className='delete-modal-title'>Confirm delete</h3>

        <p className='confirm-list-delete-paragraph'>
          Are you sure you want to delete {listName} from your lists?{' '}
          <span className='delete-warning'>This action cannot be undone.</span>
        </p>

        <div className='delete-modal-buttons'>
          <button className='yes-button'>Yes</button>
          <button className='cancel-button'>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListModal;
