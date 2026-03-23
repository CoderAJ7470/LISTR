import { useNavigate } from 'react-router-dom';

import '../styles/controlPanel.scss';

const ControlPanel = () => {
  const navigate = useNavigate();

  return (
    <div className='add-new-list'>
      <i className='fa-solid fa-circle-plus'></i>
      <button
        className='create-list-button'
        onClick={() => navigate('/create-list')}
      >
        Create a new list
      </button>
    </div>
  );
};

export default ControlPanel;
