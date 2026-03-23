import { Link } from 'react-router-dom';

const CreateList = () => {
  return (
    <div className='create-new-list'>
      <h3>Create a new list</h3>

      <p>
        Use the form below to create your list. You can always edit your list
        later as needed. <Link to='/'>Go back to main view.</Link>
      </p>
    </div>
    // <form action=''>
    //   <label htmlFor=''>
    //     <input type='text' />
    //   </label>
    // </form>
  );
};

export default CreateList;
