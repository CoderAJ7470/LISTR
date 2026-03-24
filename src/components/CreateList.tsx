import '../styles/createList.scss';

import { useNavigate } from 'react-router-dom';

const CreateList = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='create-new-list'>
        <h3>Create a new list - Step 1</h3>

        <p>
          Use the form below to start creating your list. You can always edit
          your list later as needed. <br /> * - Denotes required fields.
        </p>
      </div>

      <form className='create-list-form' action=''>
        <label htmlFor='listName'>*List Name:</label>
        <input id='listName' type='text' name='listName' />
        <label htmlFor='numberOfItems'>*Number of list items:</label>
        <input
          type='text'
          id='numberOfItems'
          inputMode='numeric'
          pattern='[0-9]*'
          name='numberOfItems'
        />
        <button className='form-create-list-button' type='submit'>
          Go to Step 2 <i className='fa-solid fa-arrow-right'></i>
        </button>
        <button
          className='cancel-button'
          type='button'
          onClick={() => navigate('/')}
        >
          Cancel and go back to home page
        </button>
      </form>
    </>
  );
};

export default CreateList;
