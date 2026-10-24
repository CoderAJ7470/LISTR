import ItemLinks, { type ItemLink, type NewItemLink } from './ItemLinks';

import '../styles/itemLinksModal.scss';

type ItemLinksModalProps = {
  links: ItemLink[];
  onAddLink: (link: NewItemLink) => Promise<boolean>;
  onClose: () => void;
};

const ItemLinksModal = ({ links, onAddLink, onClose }: ItemLinksModalProps) => {
  return (
    <div className='item-links-modal-mask' onClick={onClose}>
      <div
        className='item-links-modal'
        role='dialog'
        aria-modal='true'
        aria-label='Item Links'
        onClick={(event) => event.stopPropagation()}
      >
        <ItemLinks links={links} onAddLink={onAddLink} />
        <button
          className='item-links-cancel-button'
          type='button'
          onClick={onClose}
        >
          {links.length > 0 ? 'Close' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};

export default ItemLinksModal;
