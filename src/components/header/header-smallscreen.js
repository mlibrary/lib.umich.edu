import {
  COLORS,
  Icon,
  LINK_STYLES,
  Margins,
  SPACING,
  TYPOGRAPHY
} from '../../reusable';
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef
} from 'react';
import { Link } from 'gatsby';
import Logo from './logo';
import PropTypes from 'prop-types';
import SiteSearchModal from './site-search-modal';

const StateContext = createContext();

const StateProvider = ({ reducer, initialState, children }) => {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

StateProvider.propTypes = {
  children: PropTypes.object,
  initialState: PropTypes.object,
  reducer: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func
  ])
};

const useStateValue = () => {
  return useContext(StateContext);
};

const SmallScreenHeader = ({ primary, secondary }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'setOpenNav':
        return {
          ...state,
          openNav: action.openNav
        };
      case 'setOpen':
        return {
          ...state,
          open: action.open
        };
      case 'setPanelOpen':
        return {
          ...state,
          panelOpen: action.panelOpen
        };
      case 'reset':
        return {};
      default:
        return state;
    }
  };

  return (
    <StateProvider initialState={{}} reducer={reducer}>
      <header
        css={{
          '@media only screen and (min-width: 1129px)': {
            display: 'none'
          },
          borderBottom: `solid 2px ${COLORS.neutral['100']}`,
          display: 'block'
        }}
      >
        <Margins>
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div
              css={{
                flexShrink: '1',
                padding: `${SPACING.M} 0`
              }}
            >
              <Logo size={32} />
            </div>
            <Nav primary={primary} secondary={secondary} />
          </div>
        </Margins>
      </header>
    </StateProvider>
  );
};

SmallScreenHeader.propTypes = {
  primary: PropTypes.array,
  secondary: PropTypes.array
};

const Nav = ({ primary, secondary }) => {
  const [{ openNav, open }, dispatch] = useStateValue();
  const isOpen = openNav === true;
  const toggleNavNode = useRef();

  return (
    <nav
      aria-label='Main and utility'
      css={{
        flexShrink: 0
      }}
    >
      <SiteSearchModal />
      <button
        css={{
          cursor: 'pointer',
          marginRight: `-${SPACING.XS}`,
          padding: `${SPACING.M} ${SPACING.XS}`
        }}
        ref={toggleNavNode}
        aria-expanded={isOpen}
        onClick={() => {
          return dispatch({
            openNav: !isOpen,
            type: 'setOpenNav'
          });
        }}
      >
        {isOpen
          ? (
            <Icon icon='close' size={32} />
            )
          : (
            <Icon d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' size={32} />
            )}
        <span className='visually-hidden'>Navigation</span>
      </button>
      {isOpen && (
        <NavDropdown toggleNavNode={toggleNavNode}>
          {primary && <NavPrimary items={primary} />}
          {secondary && !Number.isInteger(open) && (
            <NavSecondary items={secondary} />
          )}
        </NavDropdown>
      )}
    </nav>
  );
};

Nav.propTypes = {
  primary: PropTypes.array,
  secondary: PropTypes.array
};

const NavDropdown = ({ children, toggleNavNode }) => {
  const [, dispatch] = useStateValue();
  const dropdownNode = useRef();

  /*
   *Reset Nav state on unmount / close.
   */
  useEffect(() => {
    return () => {
      dispatch({
        type: 'reset'
      });
    };
  }, [dispatch]);

  const closeDropdown = () => {
    dispatch({
      open: null,
      type: 'setOpenNav'
    });
  };

  const handleClick = (event) => {
    /*
     *Double check the node is current.
     */
    if (dropdownNode.current) {
      /*
       *If the user is clicking the primary nav button
       *then they're clicking outside, but this button
       *will handle closing for us. No need to close it
       *from here.
       */
      if (toggleNavNode.current.contains(event.target)) {
        return;
      }

      /*
       *If the click is outside of the dropdown then
       *close the dropdown.
       *
       *Except if they're click on the primary nav button,
       *but this case is caught above.
       */
      if (!dropdownNode.current.contains(event.target)) {
        closeDropdown();
      }
    }
  };

  const handleKeydown = (event) => {
    if (event.keyCode === 27) {
      // ESC key
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('mouseup', handleClick);
      document.addEventListener('keydown', handleKeydown);
    };
  });

  return (
    <div
      css={{
        background: 'white',
        borderTop: `solid 1px ${COLORS.neutral[100]}`,
        boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.1)`,
        maxWidth: '84vw',
        position: 'absolute',
        /* Less the side site margin on small screens. */
        right: 'calc(-1rem)',
        width: '20rem',
        zIndex: '101'
      }}
      ref={dropdownNode}
    >
      {children}
    </div>
  );
};

NavDropdown.propTypes = {
  children: PropTypes.array,
  toggleNavNode: PropTypes.func
};

const navItemStyles = {
  alignItems: 'center',
  borderBottom: `solid 1px ${COLORS.neutral['100']}`,
  color: COLORS.neutral['400'],
  cursor: 'pointer',
  display: 'flex',
  padding: SPACING.M,
  textAlign: 'left',
  textDecoration: 'none',
  width: '100%'
};

const NavSecondary = ({ items }) => {
  return (
    <ul aria-label='Utility'>
      {items.map(({ to, text, icon }, iterator) => {
        return (
          <li key={iterator + text}>
            <Link
              to={to}
              css={{
                ...navItemStyles,
                ...TYPOGRAPHY['3XS'],
                background: COLORS.blue['100'],
                color: COLORS.neutral['300']
              }}
            >
              {icon && (
                <Icon
                  icon={icon}
                  css={{
                    marginRight: SPACING['2XS'],
                    marginTop: '-2px'
                  }}
                />
              )}
              <span>{text}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

NavSecondary.propTypes = {
  items: PropTypes.array
};

const NavPrimary = ({ items }) => {
  const [{ open }] = useStateValue();

  // Is an primary nav item open.
  if (Number.isInteger(open)) {
    return <NavPanelSecondary {...items[open]} />;
  }

  return (
    <ul aria-label='Main'>
      {items.map((item, iterator) => {
        return (
          <NavPrimaryItem {...item} i={iterator} key={iterator + item.text} />
        );
      })}
    </ul>
  );
};

NavPrimary.propTypes = {
  items: PropTypes.array
};

const NavPrimaryItem = ({ text, i: iterator }) => {
  const [{ open }, dispatch] = useStateValue();
  const isOpen = open === iterator;

  return (
    <li>
      <button
        css={{
          ...navItemStyles,
          justifyContent: 'space-between'
        }}
        aria-expanded={isOpen}
        onClick={() => {
          return dispatch({
            open: isOpen ? null : iterator,
            type: 'setOpen'
          });
        }}
      >
        {text} <NextIcon />
      </button>
    </li>
  );
};

NavPrimaryItem.propTypes = {
  i: PropTypes.number,
  text: PropTypes.object
};

const BeforeIcon = () => {
  return (
    <span
      css={{
        lineHeight: '1',
        paddingRight: SPACING.S
      }}
    >
      <Icon icon='navigate_before' size={24} />
    </span>
  );
};

const NextIcon = () => {
  return (
    <span
      css={{
        lineHeight: '1',
        paddingLeft: SPACING.S
      }}
    >
      <Icon icon='navigate_next' size={24} />
    </span>
  );
};

const NavPanelSecondary = ({ text, children }) => {
  const [{ panelOpen }, dispatch] = useStateValue();
  const beforeNode = useRef(null);

  useEffect(() => {
    if (beforeNode.current) {
      beforeNode.current.focus();
    }
  }, [panelOpen]);

  if (Number.isInteger(panelOpen)) {
    return <NavPanelTertiary {...children[panelOpen]} />;
  }

  return (
    <div>
      <button
        css={{
          ...navItemStyles
        }}
        ref={beforeNode}
        aria-expanded={true}
        onClick={() => {
          return dispatch({
            open: null,
            type: 'setOpen'
          });
        }}
      >
        <BeforeIcon />
        <span css={{ fontWeight: '800' }}>{text}</span>
      </button>

      <ul>
        {children.map((item, iterator) => {
          return (
            <li key={iterator + item.text}>
              {item.children
                ? (
                  <button
                    css={{
                      ...navItemStyles,
                      justifyContent: 'space-between'
                    }}
                    aria-expanded={false}
                    onClick={() => {
                      return dispatch({
                        panelOpen: iterator,
                        type: 'setPanelOpen'
                      });
                    }}
                  >
                    {item.text}
                    <NextIcon />
                  </button>
                  )
                : (
                  <Link to={item.to} css={navItemStyles}>
                    {item.text}
                  </Link>
                  )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

NavPanelSecondary.propTypes = {
  children: PropTypes.array,
  text: PropTypes.string
};

const NavPanelTertiary = ({ text, to, children }) => {
  const [, dispatch] = useStateValue();
  const beforeNode = useRef();

  useEffect(() => {
    beforeNode.current.focus();
  }, []);

  return (
    <div>
      <button
        css={{
          ...navItemStyles
        }}
        onClick={() => {
          return dispatch({
            panelOpen: null,
            type: 'setPanelOpen'
          });
        }}
        ref={beforeNode}
        aria-expanded={true}
      >
        <BeforeIcon />
        <span css={{ fontWeight: '800' }}>{text}</span>
      </button>

      <ul>
        {children.map((item, iterator) => {
          return (
            <li key={iterator + item.text}>
              <Link to={item.to} css={navItemStyles}>
                {item.text}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            to={to}
            css={{
              ':hover': {
                '.text': LINK_STYLES['list-strong'][':hover']
              },
              ...navItemStyles,
              fontSize: '1rem',
              fontWeight: '800'
            }}
          >
            <span className='text' css={{ marginRight: '0.5rem' }}>
              View all {text}
            </span>
            <span>
              <Icon d='M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z' />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

NavPanelTertiary.propTypes = {
  children: PropTypes.array,
  text: PropTypes.string,
  to: PropTypes.string
};

export default SmallScreenHeader;
