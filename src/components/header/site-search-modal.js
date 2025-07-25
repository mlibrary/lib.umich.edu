import {
  Icon,
  SPACING,
  Z_SPACE
} from '../../reusable';
import React, { useEffect, useRef } from 'react';
import SiteSearch from '../site-search';

const SiteSearchModal = () => {
  const dialogRef = useRef();

  useEffect(() => {
    const dialog = dialogRef.current;

    const handleDialogClick = (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        dialog.close();
      }
    };

    dialog.addEventListener('click', handleDialogClick);
    dialog.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('click', handleDialogClick);
      dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openDialog = () => {
    document.body.classList.add('stop-scroll');
    dialogRef.current.showModal();
  };

  const closeDialog = () => {
    document.body.classList.remove('stop-scroll');
  };

  return (
    <>
      <button
        onClick={openDialog}
        css={{
          padding: `${SPACING.M} ${SPACING.XS}`
        }}
      >
        <Icon icon='search' size={32} />
        <span className='visually-hidden'>Search this site</span>
      </button>
      <dialog
        aria-modal='true'
        id='dialog'
        ref={dialogRef}
        onClose={closeDialog}
        css={{
          border: '0',
          borderRadius: '2px',
          margin: `${SPACING.L} auto`,
          maxWidth: '82vw',
          padding: '0',
          width: '100%',
          ...Z_SPACE['16'],
          '& *[data-site-search-icon]': {
            left: SPACING.L
          },
          '& .search-popover': {
            maxWidth: '82vw',
            position: 'fixed'
          },
          '& input': {
            border: 'none',
            padding: '0.75rem 1.5rem 0.75rem 3.5rem'
          },
          '&[open]': {
            display: 'table'
          },
          '::backdrop': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
          }
        }}
      >
        <SiteSearch label='Search this site' css={{ width: '100%' }} />
      </dialog>
    </>
  );
};

export default SiteSearchModal;
