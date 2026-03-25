import Link from 'next/link';
import Tab from './Tab';

// placeholder type for now
type Tab = { id: string; name: string };

// placeholder type for now
type List = { id: string; name: string; numberOfItems: number; tabs: Tab[] };

// TEMP: placeholder data
const lists: List[] = [];

const List = () => {
  if (lists.length === 0) {
    return (
      <div className='no-lists'>
        You have not created a list yet.{' '}
        <Link href='/create-list/step-1'>Create one now</Link>.
      </div>
    );
  }

  // will most probabkly change later; just an example flow for now
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
