import { Link } from 'react-router-dom';
import Tab from './Tab';

// placeholder type for now, will change later
type Tab = {
  id: string;
  name: string;
};

// placeholder type for now, will change later
type List = {
  id: string;
  name: string;
  numberOfItems: number;
  tabs: Tab[];
};

// TEMP: placeholder data (replace with Redux/backend later)
const lists: List[] = [];

const List = () => {
  // Show empty state if user has not created any lists yet
  if (lists.length === 0) {
    return (
      <div className='no-lists'>
        You have not created a list yet.{' '}
        <Link to='/create-list'>Create one now</Link>.
      </div>
    );
  }

  return (
    <div className='list-wrapper'>
      {lists.map((list) => (
        <div key={list.id} className='list'>
          <h3>{list.name}</h3>
          <div className='tabs-wrapper'>
            {list.tabs.length === 0 ? (
              <div className='no-tabs'>No tabs yet</div>
            ) : (
              list.tabs.map((tab) => <Tab key={tab.id} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
