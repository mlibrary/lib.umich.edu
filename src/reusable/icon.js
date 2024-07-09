/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

const icons = {
  access_time:
    'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm.5-7.8L17,14.9l-.8,1.2L11,13V7h1.5Z',
  accessible_forward:
    'M14,17H12a3,3,0,1,1-3-3V12a5,5,0,1,0,5,5Zm3-3.5H15.14l1.67-3.67A2,2,0,0,0,15,7H9.76A2,2,0,0,0,7.89,8.2L7.22,10l1.92.53L9.79,9H12l-1.83,4.1A2.07,2.07,0,0,0,12,16h5v5h2V15.5A2,2,0,0,0,17,13.5Zm0-11a2,2,0,1,1-2,2A2,2,0,0,1,17,2.54Z',
  archive:
    'M3,3H21V7H3V3M4,8H20V21H4V8M9.5,11A0.5,0.5 0 0,0 9,11.5V13H15V11.5A0.5,0.5 0 0,0 14.5,11H9.5Z',
  blog: 'M8.88,6.44a8.61,8.61,0,0,1,8.58,8.62H15A6.09,6.09,0,0,0,8.88,8.94Zm0-1.94a10.54,10.54,0,0,1,10.5,10.56h2.5A13,13,0,0,0,8.88,2Zm2.5,8A5.41,5.41,0,0,0,7.45,11a1.45,1.45,0,0,0-1.17.5,1.64,1.64,0,0,0-.43,1.14,1.61,1.61,0,0,0,.41,1.12,1.49,1.49,0,0,0,1.19.52,2.41,2.41,0,0,1,1.65.54,2,2,0,0,1,.6,1.53A2.32,2.32,0,0,1,9,18a2.12,2.12,0,0,1-3.13,0,2.3,2.3,0,0,1-.66-1.67v-8a1.59,1.59,0,0,0-1.62-1.7A1.65,1.65,0,0,0,2.48,7,1.61,1.61,0,0,0,2,8.27v8a5.58,5.58,0,0,0,1.6,4A5.15,5.15,0,0,0,7.47,22a5.12,5.12,0,0,0,3.85-1.68,5.58,5.58,0,0,0,1.6-4A5.09,5.09,0,0,0,11.38,12.46Z',
  book: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
  chat: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
  chat_bubble_outline:
    'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z',
  check_circle:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  close:
    'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  code: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
  collection_bookmark:
    'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 10l-2.5-1.5L15 12V4h5v8z',
  document:
    'M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z',
  email:
    'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  error:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
  event:
    'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  event_available:
    'M16.53 11.06L15.47 10l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 17l5.94-5.94zM19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z',
  expand_less: 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z',
  expand_more: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
  facebook:
    'M20.9,2H3.1A1.1,1.1,0,0,0,2,3.1V20.9A1.1,1.1,0,0,0,3.1,22h9.58V14.25h-2.6v-3h2.6V9a3.64,3.64,0,0,1,3.88-4,20.26,20.26,0,0,1,2.33.12v2.7h-1.6c-1.25,0-1.49.59-1.49,1.47v1.92h3l-.39,3H15.8V22h5.1A1.1,1.1,0,0,0,22,20.9V3.1A1.1,1.1,0,0,0,20.9,2Z',
  favorite_border:
    'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z',
  filter:
    'M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14z',
  find_in_page:
    'M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z',
  format_quote: 'M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z',
  gift: 'M20,6.47h-2.2a4.35,4.35,0,0,0,.19-1A2.87,2.87,0,0,0,17.62,4a3.19,3.19,0,0,0-1.1-1.12A3,3,0,0,0,15,2.48a2.91,2.91,0,0,0-1.45.36,2.6,2.6,0,0,0-1.05,1L12,4.51l-.52-.69a2.62,2.62,0,0,0-1.08-1A2.89,2.89,0,0,0,9,2.48a2.92,2.92,0,0,0-1.48.41A3,3,0,0,0,6.4,4,2.87,2.87,0,0,0,6,5.49a4.35,4.35,0,0,0,.19,1H4a2,2,0,0,0-2,2V11A2,2,0,0,0,3.7,13v6.52a2.06,2.06,0,0,0,.57,1.45,1.94,1.94,0,0,0,1.41.58H18.32a1.91,1.91,0,0,0,1.41-.58,2.06,2.06,0,0,0,.57-1.45V13A2,2,0,0,0,22,11V8.46A2,2,0,0,0,20,6.47Zm-5.73-1.7A.92.92,0,0,1,15,4.46a.87.87,0,0,1,.69.32,1,1,0,0,1,.29.71.93.93,0,0,1-.29.7,1,1,0,0,1-.5.28.55.55,0,0,1-.19,0,.75.75,0,0,1-.21,0,1,1,0,0,1-.5-.26A1,1,0,0,1,14,5.49,1,1,0,0,1,14.31,4.77Zm-6,0A.92.92,0,0,1,9,4.46a.87.87,0,0,1,.69.32,1,1,0,0,1,.29.71.93.93,0,0,1-.29.7,1,1,0,0,1-.5.28.55.55,0,0,1-.19,0,.75.75,0,0,1-.21,0,1,1,0,0,1-.5-.26A1,1,0,0,1,8,5.49,1,1,0,0,1,8.29,4.77ZM11,19.49H5.68V13H11ZM11,11H4V8.45h7Zm7.31,8.48H13V13h5.33ZM20,11H13V8.46h7Z',
  hierarchy:
    'M21.83,19.44a1.06,1.06,0,0,1-1.06,1.06H17.23a1.06,1.06,0,0,1-1.06-1.06V15.9a1.06,1.06,0,0,1,1.06-1.07h1.06V12.71H12.62v2.12h1.07a1.07,1.07,0,0,1,1.06,1.07v3.54a1.07,1.07,0,0,1-1.06,1.06H10.15a1.07,1.07,0,0,1-1.07-1.06V15.9a1.07,1.07,0,0,1,1.07-1.07h1.06V12.71H5.54v2.12H6.6A1.07,1.07,0,0,1,7.67,15.9v3.54A1.07,1.07,0,0,1,6.6,20.5H3.06A1.07,1.07,0,0,1,2,19.44V15.9a1.07,1.07,0,0,1,1.06-1.07H4.12V12.71a1.43,1.43,0,0,1,1.42-1.42h5.67V9.17H10.15A1.07,1.07,0,0,1,9.08,8.1V4.56A1.07,1.07,0,0,1,10.15,3.5h3.54a1.07,1.07,0,0,1,1.06,1.06V8.1a1.07,1.07,0,0,1-1.06,1.07H12.62v2.12h5.67a1.43,1.43,0,0,1,1.42,1.42v2.12h1.06a1.06,1.06,0,0,1,1.06,1.07Z',
  info_outline:
        'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
  insert_drive_file:
    'M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z',
  insert_link:
    'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
  instagram:
    'M21.93,16.13a5.91,5.91,0,0,1-1.61,4.19,5.91,5.91,0,0,1-4.19,1.61C14.75,22,13.38,22,12,22s-2.75,0-4.13-.07a5.91,5.91,0,0,1-4.19-1.61,5.91,5.91,0,0,1-1.61-4.19C2,14.75,2,13.38,2,12s0-2.75.07-4.13A5.91,5.91,0,0,1,3.68,3.68,5.91,5.91,0,0,1,7.87,2.07C9.25,2,10.62,2,12,2s2.75,0,4.13.07a5.91,5.91,0,0,1,4.19,1.61,5.91,5.91,0,0,1,1.61,4.19C22,9.25,22,10.62,22,12S22,14.75,21.93,16.13ZM6.1,4.2A3.09,3.09,0,0,0,5,5,3.09,3.09,0,0,0,4.2,6.1c-.52,1.32-.4,4.44-.4,5.9s-.12,4.58.4,5.9A3.09,3.09,0,0,0,5,19a3.09,3.09,0,0,0,1.14.76c1.32.52,4.44.4,5.9.4s4.58.12,5.9-.4a3.49,3.49,0,0,0,1.9-1.9c.52-1.32.4-4.44.4-5.9s.12-4.58-.4-5.9A3.09,3.09,0,0,0,19,5,3.09,3.09,0,0,0,17.9,4.2c-1.32-.52-4.44-.4-5.9-.4S7.42,3.68,6.1,4.2ZM12,17.13A5.13,5.13,0,1,1,17.13,12,5.12,5.12,0,0,1,12,17.13Zm0-8.46A3.33,3.33,0,1,0,15.33,12,3.33,3.33,0,0,0,12,8.67Zm5.34-.81a1.2,1.2,0,1,1,0-2.4,1.2,1.2,0,0,1,0,2.4Z',
  library_books:
    'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z',
  linkedin:
    'M22,18.25A3.75,3.75,0,0,1,18.25,22H5.75A3.75,3.75,0,0,1,2,18.25V5.75A3.75,3.75,0,0,1,5.75,2h12.5A3.75,3.75,0,0,1,22,5.75ZM6.61,5.36A1.58,1.58,0,0,0,4.9,6.92,1.56,1.56,0,0,0,6.57,8.48h0a1.57,1.57,0,1,0,0-3.12ZM8.09,18.74v-9h-3v9Zm10.82,0V13.56c0-2.77-1.48-4.06-3.46-4.06A3,3,0,0,0,12.73,11h0V9.71h-3s0,.84,0,9h3v-5a2.09,2.09,0,0,1,.09-.73,1.65,1.65,0,0,1,1.55-1.09c1.08,0,1.51.82,1.51,2v4.83Z',
  mail_outline:
    'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z',
  map: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z',
  music_note:
    'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  navigate_before: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  navigate_next: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  newspaper:
    'M20,11H4V8H20M20,15H13V13H20M20,19H13V17H20M11,19H4V13H11M20.33,4.67L18.67,3L17,4.67L15.33,3L13.67,4.67L12,3L10.33,4.67L8.67,3L7,4.67L5.33,3L3.67,4.67L2,3V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V3L20.33,4.67Z',
  notes: 'M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z',
  people_outline:
    'M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z',
  person:
    'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  person_outline:
    'M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z',
  photo:
    'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  photo_library:
    'M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z',
  play_circle:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
  play_circle_outline:
    'M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
  remove_red_eye:
    'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  search:
    'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  slideshare:
    'M17.63,15.08c2.24,7.63-5.47,8.85-5.35,4.94,0,.07,0-2.11,0-3.72-.17,0-.34-.08-.54-.13,0,1.63,0,3.92,0,3.85.12,3.91-7.59,2.69-5.35-4.94a10.68,10.68,0,0,1-4.23-2.86c-.36-.55,0-1.13.64-.71l.25.17V3.79a1.91,1.91,0,0,1,1.83-2H19.15a1.91,1.91,0,0,1,1.84,2v7.89l.23-.17c.61-.42,1,.16.64.71A10.68,10.68,0,0,1,17.63,15.08ZM20,4.69c0-1.31-.42-1.82-1.63-1.82H5.73c-1.26,0-1.61.43-1.61,1.82v7.65a11.26,11.26,0,0,0,6.26,1.12,1.4,1.4,0,0,1,1.09.3.57.57,0,0,0,.11.11c.24.22.47.41.69.58.05-.63.4-1,1.35-1A11.11,11.11,0,0,0,20,12.27ZM9.28,12.52a2.38,2.38,0,0,1-2.45-2.29,2.37,2.37,0,0,1,2.45-2.3,2.38,2.38,0,0,1,2.46,2.3A2.38,2.38,0,0,1,9.28,12.52Zm5.71,0a2.39,2.39,0,0,1-2.46-2.29A2.38,2.38,0,0,1,15,7.93a2.37,2.37,0,0,1,2.46,2.3A2.38,2.38,0,0,1,15,12.52Z',
  star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  star_border:
    'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z',
  theaters:
    'M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z',
  timeline:
    'M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z',
  today:
    'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z',
  twitter:
    'M18.3,2.1h3.4l-7.4,8.4L23,21.9h-6.8l-5.3-7l-6.1,7H1.4l7.9-9L1,2.1h7l4.8,6.4L18.3,2.1z M17.1,19.9H19L6.9,4 h-2L17.1,19.9z',
  video_library:
    'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z',
  videogame_asset:
    'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  volume_up:
    'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  web: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z',
  work: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
  youtube:
    'M20,20.15a2.09,2.09,0,0,1-1.79,1.62A55.6,55.6,0,0,1,12,22a55.6,55.6,0,0,1-6.19-.23A2.08,2.08,0,0,1,4,20.15a17.64,17.64,0,0,1-.29-3.91h0A18.21,18.21,0,0,1,4,12.33a2.11,2.11,0,0,1,1.8-1.62A55.33,55.33,0,0,1,12,10.48a55.6,55.6,0,0,1,6.19.23A2.09,2.09,0,0,1,20,12.33a17.59,17.59,0,0,1,.29,3.91A18.26,18.26,0,0,1,20,20.15ZM8.45,13.46V12.41H5v1.05H6.14v6.35H7.26V13.46ZM10.27,2,8.92,6.45v3H7.8v-3a17.15,17.15,0,0,0-.68-2.36C6.88,3.4,6.63,2.69,6.4,2H7.58l.79,2.94L9.13,2Zm1.19,17.81V14.3h-1v4.22c-.22.31-.43.47-.64.47s-.21-.08-.23-.24a2.77,2.77,0,0,1,0-.39V14.3h-1v4.36a2.63,2.63,0,0,0,.09.82.59.59,0,0,0,.64.41,1.6,1.6,0,0,0,1.14-.68v.6Zm1.8-12.14A2.24,2.24,0,0,1,13,9a1.38,1.38,0,0,1-1.18.57A1.38,1.38,0,0,1,10.59,9a2.26,2.26,0,0,1-.31-1.32V5.72a2.18,2.18,0,0,1,.31-1.31,1.38,1.38,0,0,1,1.18-.57A1.38,1.38,0,0,1,13,4.41a2.18,2.18,0,0,1,.31,1.31Zm-1-2.15c0-.52-.15-.77-.48-.77s-.48.25-.48.77V7.86c0,.51.15.78.48.78s.48-.27.48-.78Zm3,10.44a3.72,3.72,0,0,0-.1-1.1.78.78,0,0,0-.79-.63,1.35,1.35,0,0,0-1,.6V12.41h-1v7.4h1v-.53a1.37,1.37,0,0,0,1,.61.78.78,0,0,0,.79-.61,4,4,0,0,0,.1-1.12Zm-1,2.28c0,.5-.15.75-.44.75a.71.71,0,0,1-.5-.25V15.38a.69.69,0,0,1,.5-.24c.29,0,.44.25.44.74ZM17,9.48H16V8.86a1.61,1.61,0,0,1-1.15.7.63.63,0,0,1-.65-.42,2.62,2.62,0,0,1-.09-.83V3.91h1V8a3,3,0,0,0,0,.4c0,.15.1.24.24.24s.41-.16.63-.48V3.91h1Zm2,8.42H18a5,5,0,0,1,0,.68.43.43,0,0,1-.44.41c-.35,0-.52-.26-.52-.77v-1h2V16.1a2.23,2.23,0,0,0-.3-1.3,1.53,1.53,0,0,0-2.38,0A2.15,2.15,0,0,0,16,16.1V18a2.11,2.11,0,0,0,.32,1.29,1.42,1.42,0,0,0,1.21.57,1.37,1.37,0,0,0,1.2-.59,1.21,1.21,0,0,0,.24-.6,4.94,4.94,0,0,0,0-.65Zm-1-1.49H17V15.9c0-.51.17-.76.51-.76s.5.25.5.76Z'
};

const StyledSVG = styled('svg')({
  display: 'inline-block',
  fill: 'currentColor',
  verticalAlign: 'middle'
});

/**
 *Use this to render SVG icons.
 */
// eslint-disable-next-line react/prop-types
const Icon = ({ icon, size, title, className, d: path, ...other }) => {
  // If no title, then hide for AD.
  const isHidden = !title;

  return (
    <StyledSVG
      width={`${size}px`}
      height={`${size}px`}
      viewBox='0 0 24 24'
      className={className}
      aria-hidden={isHidden}
      {...other}
    >
      {title && <title>{title}</title>}
      <path d={path || icons[icon]} />
    </StyledSVG>
  );
};

Icon.propTypes = {
  className: PropTypes.string,
  /** Icon name. */
  icon: PropTypes.string,
  path: PropTypes.string,
  /** Size of the icon in pixels. */
  size: PropTypes.number,
  /** Include a title if this icon requires a text alternative. */
  title: PropTypes.string

};

Icon.defaultProps = {
  size: 16
};

export { icons };
export default Icon;
