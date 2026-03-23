import { Outlet } from 'react-router-dom';
import ControlPanel from './components/ControlPanel';

import './styles/main.scss';
import './styles/wrapper.scss';

const App = () => {
  return (
    <div className='wrapper'>
      <ControlPanel />
      <Outlet />
    </div>
  );
};

export default App;

