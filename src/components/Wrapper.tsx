import ControlPanel from './ControlPanel';
import List from './List';

import '../styles/wrapper.scss';

const Wrapper = () => {
  return (
    <div className='wrapper'>
      <ControlPanel />
      <List />
    </div>
  );
};

export default Wrapper;
