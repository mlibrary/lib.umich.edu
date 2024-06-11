/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import {
  Icon,
  SPACING,
  Z_SPACE
} from '../../reusable';
import SiteSearch from '../site-search';

function SiteSearchModal () {
  return (
    <>
      <button
        onClick={() => {
          document.querySelector('body').classList.add('stop-scroll');
          document.getElementById('dialog').showModal();
        }}
        css={{
          padding: `${SPACING.M} ${SPACING.XS}`
        }}
      >
        <Icon icon='search' size={32} />
        <span className='visually-hidden'>Search this site</span>
      </button>
      <dialog
        id='dialog'
        onClick={() => {
          const dialog = document.getElementById('dialog');
          dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
              event.target.close();
            }
          });
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            document.getElementById('dialog').close();
          }
        }}
        onClose={() => {
          document.querySelector('body').classList.remove('stop-scroll');
        }}
        css={{
          border: '0',
          borderRadius: '2px',
          margin: `${SPACING.L} auto`,
          maxWidth: '82vw',
          padding: '0',
          width: '100%',
          ...Z_SPACE['16'],
          '::backdrop': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
          },
          '&[open]': {
            display: 'table'
          },
          '& *[data-site-search-icon]': {
            left: SPACING.L
          },
          '& input': {
            border: 'none',
            padding: '0.75rem 1.5rem 0.75rem 3.5rem'
          },
          '& .search-popover': {
            maxWidth: '82vw',
            position: 'fixed'
          }
        }}
      >
        <SiteSearch label='Search this site' css={{ width: '100%' }} />
      </dialog>
    </>
  );
}

export default SiteSearchModal;
