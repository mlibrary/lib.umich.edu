import {
  Alert,
  COLORS,
  Heading,
  Icon,
  LINK_STYLES,
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
import PropTypes from 'prop-types';

const StateContext = createContext();
const dropdownSideWidth = '24rem';

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
  reducer: PropTypes.func
};

const useStateValue = () => {
  return useContext(StateContext);
};

const Nav = ({ items }) => {
  const reducer = (state, action) => {
    switch (action.type) {
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
      case 'setMinHeight':
        return {
          ...state,
          minHeight: action.minHeight
        };

      default:
        return state;
    }
  };

  return (
    <StateProvider initialState={{ panelOpen: 0 }} reducer={reducer}>
      <nav aria-label='Main' aria-describedby='main-nav-description'>
        <p id='main-nav-description' className='visually-hidden'>
          Expand main navigation buttons to view related content groups and
          associated links.
        </p>
        <ul
          css={{
            alignItems: 'stretch',
            display: 'flex'
          }}
        >
          {items.map(({ text, to, children }, iterator) => {
            return (
              <NavPrimaryItem
                key={iterator + text}
                text={text}
                to={to}
                items={children}
                i={iterator}
              />
            );
          })}
        </ul>
      </nav>
    </StateProvider>
  );
};

Nav.propTypes = {
  items: PropTypes.array
};

const NavPrimaryItem = ({ text, items, i: iterator }) => {
  const [{ open }, dispatch] = useStateValue();
  const isOpen = open === iterator;
  const primaryNode = useRef();

  const activeStyles = () => {
    if (isOpen) {
      return {
        borderColor: COLORS.teal['400']
      };
    }
    return {};
  };

  return (
    <li
      key={iterator + text}
      css={{
        '> button': {
          marginRight: SPACING.L
        },
        display: 'inline-block'
      }}
    >
      <button
        onClick={() => {
          return dispatch({
            open: isOpen ? null : iterator,
            type: 'setOpen'
          });
        }}
        aria-expanded={isOpen}
        css={{
          ':hover': {
            borderColor: COLORS.teal['400']
          },
          ...activeStyles(),
          ...TYPOGRAPHY.XS,
          borderBottom: `solid 3px transparent`,
          cursor: 'pointer',
          display: 'inline-block',
          height: '100%',
          paddingBottom: `calc(${SPACING.M} - 3px)`,
          paddingTop: SPACING.M
        }}
        ref={primaryNode}
      >
        {text}
      </button>

      {isOpen && <NavDropdown items={items} primaryNode={primaryNode} />}
    </li>
  );
};

NavPrimaryItem.propTypes = {
  items: PropTypes.array,
  iterator: PropTypes.number,
  text: PropTypes.string
};

const NavDropdown = ({ items, primaryNode }) => {
  const [, dispatch] = useStateValue();
  const dropdownNode = useRef();

  const closeDropdown = () => {
    dispatch({
      open: null,
      type: 'setOpen'
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
      if (primaryNode.current.contains(event.target)) {
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
  }, []);

  return (
    <div
      css={{
        background: 'white',
        border: `solid 1px ${COLORS.neutral[100]}`,
        boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.1)`,
        left: '0',
        position: 'absolute',
        width: '100%',
        zIndex: '101'
      }}
      ref={dropdownNode}
    >
      <NavPanel items={items} />
    </div>
  );
};

NavDropdown.propTypes = {
  items: PropTypes.array,
  primaryNode: PropTypes.object
};

const NavPanel = ({ items }) => {
  const [{ openPanel, minHeight }, dispatch] = useStateValue();

  const minHeightValue = minHeight > 340 ? minHeight : 340;

  /*
   * Set panel open to null on "unmount" of the NavPanel.
   * This is useful so that when opening a different dropdown,
   * It wont use a previous panel index. It resets.
   */
  useEffect(() => {
    return () => {
      dispatch({
        panelOpen: 0,
        type: 'setPanelOpen'
      });
    };
  }, [openPanel, dispatch]);

  return (
    <div
      css={{
        position: 'relative'
      }}
    >
      <ul
        css={{
          borderRight: `solid 1px ${COLORS.neutral[100]}`,
          minHeight: minHeightValue,
          padding: `${SPACING.S} 0`,
          width: dropdownSideWidth
        }}
      >
        {items.map((item, iterator) => {
          return (
            <NavPanelItem {...item} i={iterator} key={iterator + item.text} />
          );
        })}
      </ul>
    </div>
  );
};

NavPanel.propTypes = {
  items: PropTypes.array
};

const NavPanelItem = ({ text, to, description, children, i: iterator }) => {
  const [{ panelOpen }, dispatch] = useStateValue();
  const isOpen = panelOpen === iterator;
  const noPanelsAreOpen = panelOpen === null;

  const activeStyles = () => {
    if (isOpen) {
      return {
        background: COLORS.teal['100'],
        borderColor: COLORS.teal['400']
      };
    }

    return {};
  };

  // Render as a link if no links to show in panel.
  if (!children) {
    return (
      <li>
        <Link
          to={to}
          css={{
            ':hover .text': LINK_STYLES['list-strong'][':hover'],
            display: 'block',
            fontWeight: '800',
            padding: `${SPACING.S} ${SPACING.L}`
          }}
        >
          <span className='text'>{text}</span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        css={{
          ':hover': {
            '.text': {
              ...LINK_STYLES['list-strong'][':hover']
            },
            cursor: 'pointer'
          },
          ...activeStyles(),
          alignItems: 'center',
          borderLeft: 'solid 5px transparent',
          display: 'flex',
          justifyContent: 'space-between',
          padding: `${SPACING.S} ${SPACING.L}`,
          paddingLeft: `calc(${SPACING.L} - 5px)`,
          textAlign: 'left',
          width: '100%'
        }}
        onClick={() => {
          return dispatch({
            panelOpen: panelOpen === iterator ? null : iterator,
            type: 'setPanelOpen'
          });
        }}
        aria-expanded={panelOpen === iterator}
      >
        <span
          className='text'
          css={{
            ...LINK_STYLES['list-strong'],
            fontSize: '1rem'
          }}
        >
          {text}
        </span>
        <Icon icon='navigate_next' />
      </button>
      {isOpen && (
        <NavPanelItemLinks
          parentItem={{ description, text, to }}
          items={children}
        />
      )}
      {noPanelsAreOpen && <NoPanelsAreOpen />}
    </li>
  );
};

NavPanelItem.propTypes = {
  children: PropTypes.array,
  description: PropTypes.string,
  iterator: PropTypes.number,
  text: PropTypes.string,
  to: PropTypes.string
};

const NavPanelItemLinks = ({ parentItem, items }) => {
  const [, dispatch] = useStateValue();
  const ref = useRef();

  useEffect(() => {
    dispatch({
      minHeight: ref.current.clientHeight,
      type: 'setMinHeight'
    });
  }, [dispatch]);

  const columnStyles = () => {
    if (items.length > 4) {
      return {
        columnGap: SPACING.L,
        columns: items.length > 4 ? '2' : 'none'
      };
    }

    return {};
  };

  return (
    <div
      css={{
        padding: `${SPACING.XL} ${SPACING['2XL']}`,
        position: 'absolute',
        right: '0',
        top: '0',
        width: `calc(100% - ${dropdownSideWidth})`
      }}
      ref={ref}
    >
      <Heading size='M' level={2}>
        {parentItem.text}
      </Heading>
      {parentItem.description && (
        <p
          css={{
            color: COLORS.neutral[300],
            paddingTop: SPACING.XS
          }}
        >
          {parentItem.description}
        </p>
      )}
      {items
        ? (
            <ul
              css={{
                ...columnStyles(),
                borderTop: `solid 1px ${COLORS.neutral['100']}`,
                marginTop: SPACING.M,
                paddingTop: SPACING.L
              }}
            >
              {items.map(({ text, to }, iterator) => {
                return (
                  <li
                    key={iterator + text}
                    css={{
                      breakInside: 'avoid'
                    }}
                  >
                    <Link
                      to={to}
                      css={{
                        ':hover': {
                          '.text': LINK_STYLES.list[':hover']
                        },
                        display: 'block',
                        fontSize: '1rem',
                        padding: `${SPACING.XS} 0`
                      }}
                    >
                      <span className='text'>{text}</span>
                    </Link>
                  </li>
                );
              })}
              {parentItem.to && (
                <li>
                  <Link
                    to={parentItem.to}
                    css={{
                      ':hover': {
                        '.text': LINK_STYLES['list-strong'][':hover']
                      },
                      display: 'block',
                      fontSize: '1rem',
                      fontWeight: '800',
                      padding: `${SPACING.XS} 0`
                    }}
                  >
                    <span className='text'>View all {parentItem.text}</span>
                    {' '}
                    <Icon d='M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z' />
                  </Link>
                </li>
              )}
            </ul>
          )
        : (
            <div
              css={{
                padding: `${SPACING.L} 0`
              }}
            >
              <Alert intent='warning'>
                <span style={{ fontSize: '1rem' }}>
                  This navigation panel does not have any pages to show.
                </span>
              </Alert>
            </div>
          )}
    </div>
  );
};

NavPanelItemLinks.propTypes = {
  items: PropTypes.array,
  parentItem: PropTypes.object
};

const NoPanelsAreOpen = () => {
  return (
    <div
      css={{
        alignItems: 'center',
        background: COLORS.blue['100'],
        color: COLORS.neutral['300'],
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        padding: `${SPACING.XL} ${SPACING['2XL']}`,
        position: 'absolute',
        right: '0',
        top: '0',
        width: `calc(100% - ${dropdownSideWidth})`
      }}
    >
      <p
        css={{
          ...TYPOGRAPHY['2XS']
        }}
      >
        Select an item from the list to see related links.
      </p>
    </div>
  );
};

export default Nav;
