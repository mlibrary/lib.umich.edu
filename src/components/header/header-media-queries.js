/*
  Separate from MEDIA_QUERIES in utils because the width of the content in the header
  dictates this breakpoint. The "Locations and Hours", "Information", "Ask a Librarian",
  "Give", and "Account" nav bar currently fits perfectly at this breakpoint. If we need
  to modify that content this breakpoint can be updated to change the navbar to the
  mobile view to reflect the new content width
*/

const HEADER_MEDIA_QUERIES = {
  LARGESCREEN: '@media only screen and (min-width: 1130px)'
};

export default HEADER_MEDIA_QUERIES;
