import { Outlet } from 'react-router-dom';

import './styles/main.scss';
import './styles/wrapper.scss';

const App = () => {
  return (
    <div className='wrapper'>
      <Outlet />
    </div>
  );
};

export default App;

