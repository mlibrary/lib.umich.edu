import React, { useState, createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { Link } from 'gatsby'
import {
  SPACING,
  TYPOGRAPHY,
  COLORS,
  Icon,
  Button,
  Margins
} from '@umich-lib/core'

import Search from './search'
import Logo from './logo'

const StateContext = createContext();

const StateProvider = ({reducer, initialState, children}) =>(
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

const useStateValue = () => useContext(StateContext);

function SmallScreenHeader({
  primary,
  secondary
}) {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'setOpenNav':
        return {
          ...state,
          openNav: action.openNav
        }
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
      default:
        return state;
    }
  };

  return (
    <StateProvider
      initialState={{}}
      reducer={reducer}
    >
      <header
        css={{
          borderBottom: `solid 1px ${COLORS.neutral['100']}`
        }}
      >
        <Margins>
          <div css={{
            position: 'relative'
          }}>
            <div css={{
              padding: `${SPACING['M']} 0`
            }}>
              <Logo size={32} />
            </div>
            <Nav
              primary={primary}
              secondary={secondary}
            />
          </div>
        </Margins>
      </header>
    </StateProvider>
  )
}

function Nav({ primary, secondary }) {
  const [{ openNav, open }, dispatch] = useStateValue();
  const isOpen = openNav === true
  const label = isOpen ? 'Close' : 'Open'
  const toggleNavNode = useRef()

  return (
    <nav aria-label="Main navigation">
      <button
        css={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: SPACING['M'],
          marginRight: `-${SPACING['M']}`,
          cursor: 'pointer'
        }}
        ref={toggleNavNode}
      >
        {isOpen ? (
          <Icon
            icon="close"
            title={label}
            size={32}
            onClick={() => dispatch({
              type: 'setOpenNav',
              openNav: !isOpen
            })}
          />
        ) : (
          <Icon
            d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
            title={label}
            size={32}
            onClick={() => dispatch({
              type: 'setOpenNav',
              openNav: !isOpen
            })}
          />
        )}
      </button>
      {isOpen && (
        <NavDropdown toggleNavNode={toggleNavNode}>
          {!Number.isInteger(open) && (
            <div css={{
              padding: SPACING['M'],
              borderBottom: `solid 1px ${COLORS.neutral['100']}`,
            }}>
              <Search />
            </div>
          )}
          {primary && (
            <NavPrimary items={primary} />
          )}
          {secondary && !Number.isInteger(open) && (
            <NavSecondary items={secondary} />
          )}
        </NavDropdown>
      )}
    </nav>
  )
}

function NavDropdown({ children, toggleNavNode }) {
  const [{}, dispatch] = useStateValue();
  const dropdownNode = useRef()

  useEffect(() => {
    return () => dispatch({
      type: 'setOpenNav',
      openNav: null
    })
  }, []);

  function closeDropdown() {
    dispatch({
      type: 'setOpenNav',
      open: null
    })
  }

  function handleClick(e) {
    /*
      Double check the node is current.
    */
    if (dropdownNode.current) {
      /*
        If the user is clicking the primary nav button
        then they're clicking outside, but this button
        will handle closing for us. No need to close it
        from here.
      */
      if (toggleNavNode.current.contains(e.target)) {
        return
      }

      /*
        If the click is outside of the dropdown then
        close the dropdown.

        Except if they're click on the primary nav button,
        but this case is caught above.
      */
      if (!dropdownNode.current.contains(e.target)) {
        closeDropdown()
      }
    }
  };
  
  function handleKeydown(e) {
    if (e.keyCode === 27) {
      // ESC key
      closeDropdown()
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleClick);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("mouseup", handleClick);
      document.addEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div
      css={{
        border: `solid 1px ${COLORS.neutral[100]}`,
        position: 'absolute',
        width: '20rem',
        maxWidth: '90vw',
        background: 'white',
        right: '0',
        boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.1)`,
        zIndex: '1'
      }}
      ref={dropdownNode}
    >
      {children}
    </div>
  )
}

function NavSecondary({ items }) {
  return (
    <ul>
      {items.map(({to, text}, i) => (
        <li>
          <Link
            to={to}
            css={{
              ...nav_item_styles,
              ...TYPOGRAPHY['3XS'],
              color: COLORS.neutral['300'],
              background: COLORS.blue['100']
            }}
          >{text}</Link>
        </li>
      ))}
    </ul>
  )
}

function NavPrimary({ items }) {
  const [{ open }] = useStateValue();

  // Is an primary nav item open.
  if (Number.isInteger(open)) {
    return (
      <NavPanelSecondary {...items[open]} />
    )
  }

  return (
    <ul>
      {items.map((item, i) =>
        <NavPrimaryItem {...item} i={i} key={i + item.text} />
      )}
    </ul>
  )
}

function NavPrimaryItem({ to, text, children, i }) {
  const [{ open }, dispatch] = useStateValue();
  const isOpen = open === i

  return (
    <li>
      <button
        css={{
          ...nav_item_styles,
          display: 'flex',
          justifyContent: 'space-between',
          paddingRight: SPACING['2XL'] // for the icon
        }}
        onClick={() => dispatch({
          type: 'setOpen',
          open: isOpen ? null : i
        })}
      >
        {text} <NextIcon />
      </button>
    </li>
  )
}

function NextIcon() {
  return (
    <span css={{
      position: 'absolute',
      right: SPACING['M'],
      lineHeight: '1'
    }}><Icon icon="navigate_next" size={24}/></span>
  )
}

const nav_item_styles = {
  padding: SPACING['M'],
  display: 'block',
  width: '100%',
  textAlign: 'left',
  borderBottom: `solid 1px ${COLORS.neutral['100']}`,
  textDecoration: 'none',
  color: COLORS.neutral['400'],
  cursor: 'pointer'
}

function NavPanelSecondary({ text, to, children }) {
  const [{ panelOpen }, dispatch] = useStateValue();

  if (panelOpen) {
    return (
      <NavPanelTertiary {...children[panelOpen]}  />
    )
  }

  return (
    <div>
      <button
        css={{
          ...nav_item_styles,
          position: 'relative',
          paddingLeft: SPACING['2XL'] // for the icon
        }}
        onClick={() => dispatch({
          type: 'setOpen',
          open: null
        })}
      >
        <span css={{
          position: 'absolute',
          left: SPACING['M'],
          lineHeight: '1'
        }}><Icon icon="navigate_before" size={24} /></span>
        <span css={{ fontWeight: '800' }}>{text}</span>
      </button>

      <ul>
        {children.map((item, i) => (
          <li key={i + item.text}>
            {item.children ? (
              <button
                css={{
                  ...nav_item_styles,
                  paddingRight: SPACING['2XL'] // for the icon
                }}
                onClick={() => dispatch({
                  type: 'setPanelOpen',
                  panelOpen: i
                })}
              >
                {item.text}
                <NextIcon />
              </button>
            ) : (
              <Link
                to={to}
                css={nav_item_styles}
              >{item.text}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function NavPanelTertiary({ text, to, children }) {
  const [{ panelOpen }, dispatch] = useStateValue();

  return (
    <div>
      <button
        css={{
          ...nav_item_styles,
          position: 'relative',
          paddingLeft: SPACING['2XL'] // for the icon
        }}
        onClick={() => dispatch({
          type: 'setPanelOpen',
          panelOpen: null
        })}
      >
        <span css={{
          position: 'absolute',
          left: SPACING['M'],
          lineHeight: '1'
        }}><Icon icon="navigate_before" size={24} /></span>
        <span css={{ fontWeight: '800' }}>{text}</span>
      </button>

      <ul>
        {children.map((item, i) => (
          <li key={i + item.text}>
            {item.children ? (
              <button
                css={nav_item_styles}
              >
                {item.text}
                <NextIcon />
              </button>
            ) : (
              <Link
                to={to}
                css={nav_item_styles}
              >{item.text}</Link>
            )}
          </li>
        ))}
        <li>
          <Link
            to={to}
            css={{
              ...nav_item_styles,
              color: COLORS.teal['400']
            }}
          >View all {text}</Link>
        </li>
      </ul>
    </div>
  )
}

export default SmallScreenHeader