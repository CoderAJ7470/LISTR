import { useState, type SubmitEvent } from 'react';
import {
  MAX_LINKS_PER_ITEM,
  validateLinkURL,
} from '../helpers/addNewLinkFormValidation';

import '../styles/itemLinks.scss';

export type ItemLink = {
  id: string;
  name: string;
  url: string;
};

export type NewItemLink = Omit<ItemLink, 'id'>;

type ItemLinksProps = {
  links: ItemLink[];
  onAddLink: (link: NewItemLink) => Promise<boolean>;
};

const ItemLinks = ({ links, onAddLink }: ItemLinksProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [urlError, setURLError] = useState<string | null>(null);
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasReachedLinkLimit = links.length >= MAX_LINKS_PER_ITEM;
  const showForm = links.length === 0 || showAddLinkForm;
  const remainingLinks = MAX_LINKS_PER_ITEM - links.length;

  const handleAddLinkSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasReachedLinkLimit || isSubmitting) return;

    const trimmedUrl = linkUrl.trim();
    const error = !trimmedUrl
      ? 'URL is required.'
      : !validateLinkURL(trimmedUrl)
        ? 'Invalid URL, please try again.'
        : null;

    setURLError(error);

    if (error) return;

    setIsSubmitting(true);

    try {
      const wasAdded = await onAddLink({
        url: trimmedUrl,
        name: linkName.trim() || trimmedUrl,
      });

      if (!wasAdded) return;

      setLinkUrl('');
      setLinkName('');
      setURLError(null);
      setShowAddLinkForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='item-links'>
      {links.length === 0 ? (
        <>
          <h3 className='add-links-modal-title'>
            Add links for this list item
          </h3>
          <p>
            You have not added any links for this list item. You may add a link
            using the form below (<b>maximum 4 links</b>).{' '}
            <span className='required-asterisks'>*</span> - denotes required
            fields.
          </p>
        </>
      ) : (
        <>
          <h3 className='add-links-modal-title'>
            Current links for this list item.
          </h3>
          <p>
            Showing links you have added for this list item.{' '}
            {remainingLinks === 0
              ? `You have reached the maximum of ${MAX_LINKS_PER_ITEM} links allowed and cannot add any more.`
              : `You have ${remainingLinks} links left.`}
          </p>
          <ol>
            {links.map((link) => (
              <li key={link.id} className='user-added-links'>
                <a href={link.url} target='_blank' rel='noopener noreferrer'>
                  {link.name}
                </a>
              </li>
            ))}
          </ol>

          <button
            type='button'
            className='add-new-links-form-button'
            aria-label='Add a link associated with this item.'
            disabled={hasReachedLinkLimit}
            onClick={() => setShowAddLinkForm(true)}
          >
            <i className='fa-solid fa-circle-plus'></i>
          </button>

          {hasReachedLinkLimit && (
            <p role='status'>
              Maximum of {MAX_LINKS_PER_ITEM} links reached for this item.
            </p>
          )}
        </>
      )}

      {showForm && (
        <form
          noValidate
          className='add-link-form'
          onSubmit={handleAddLinkSubmit}
        >
          <label htmlFor='addLinkUrl'>
            Link URL (<b>must use https</b>):
            <span className='required-asterisks'>*</span>
          </label>
          <input
            type='url'
            id='addLinkUrl'
            value={linkUrl}
            onChange={(event) => {
              setLinkUrl(event.target.value);
              if (urlError) setURLError(null);
            }}
            required
          />

          <div className='url-error-slot' aria-live='polite'>
            {urlError && (
              <span className='url-error-message' role='alert'>
                {urlError}
              </span>
            )}
          </div>

          <label htmlFor='addLinkName'>Link name:</label>
          <input
            type='text'
            id='addLinkName'
            value={linkName}
            onChange={(event) => setLinkName(event.target.value)}
          />

          <section className='add-link-form-buttons'>
            <button
              type='submit'
              className='add-link-button'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding link...' : 'Add link'}
            </button>

            {links.length > 0 && (
              <button
                type='button'
                className='cancel-adding-new-link'
                onClick={() => setShowAddLinkForm(false)}
              >
                Cancel
              </button>
            )}
          </section>
        </form>
      )}
    </section>
  );
};

export default ItemLinks;
