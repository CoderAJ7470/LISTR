import { useList } from '../../app/context/CreateListFormContext';

import '../styles/listButtons.scss';

const ListButtons = () => {
  const { lists, selectedListId, setSelectedListId } = useList();

  return (
    <div className='list-buttons-container'>
      {lists.map((list) => (
        <button
          key={list.id}
          className={`list-buttons ${list.id === selectedListId ? 'active-list-button' : ''}`}
          onClick={() => setSelectedListId(list.id)}
        >
          {list.listName}
        </button>
      ))}
      {/* {<button className='list-buttons'>Test Button</button>}
      {<button className='list-buttons'>Test Button</button>} */}
    </div>
  );
};

export default ListButtons;
