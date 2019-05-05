/** @jsx jsx */
import React, {createContext, useContext, useReducer, useEffect, useRef} from 'react'
import { jsx } from '@emotion/core'
import { Link } from 'gatsby'
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  Heading,
  Icon,
  Alert
} from '@umich-lib/core'

const StateContext = createContext();

const StateProvider = ({reducer, initialState, children}) =>(
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

const useStateValue = () => useContext(StateContext);

function Nav({ items }) {  
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
    <StateProvider
      initialState={{}}
      reducer={reducer}
    >
      <nav
        css={{
          position: 'relative'
        }}
      >
        <ul>
          {items.map(({ text, to, children }, i) => (
            <NavPrimaryItem
              key={i + text}
              text={text}
              to={to}
              items={children}
              i={i}
            />
          ))}
        </ul>
      </nav>
    </StateProvider>
  )
}

function NavPrimaryItem({
  text,
  to,
  items,
  i
}) {
  const [{ open }, dispatch] = useStateValue();
  const isOpen = open === i
  const primaryNode = useRef()

  function activeStyles() {
    if (isOpen) {
      return {
        borderColor: COLORS.teal['400']
      }
    }
  }

  return (
    <li
      key={i + text}
      css={{
        display: 'inline-block',
        ':not(:last-child)': {
          '> button': {
            marginRight: SPACING['L']
          }
        }
      }}
    >
      <button
        onClick={() => setTimeout(dispatch({
          type: 'setOpen',
          open: isOpen ? null : i
        }), 100)}
        aria-expanded={isOpen}
        css={{
          ...TYPOGRAPHY['XS'],
          display: 'inline-block',
          borderBottom: `solid 3px transparent`,
          cursor: 'pointer',
          paddingTop: SPACING['M'],
          paddingBottom: `calc(${SPACING['M']} - 3px)`,
          ...activeStyles()
        }}
        ref={primaryNode}
      >
        {text}
      </button>

      {isOpen && (
        <NavDropdown
          items={items}
          primaryNode={primaryNode}
        />
      )}
    </li>
  )
}

function NavDropdown({ items, primaryNode }) {
  const [{}, dispatch] = useStateValue();
  const dropdownNode = useRef()

  function closeDropdown() {
    dispatch({
      type: 'setOpen',
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
      if (primaryNode.current.contains(e.target)) {
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
        width: '100%',
        background: 'white',
        left: '0',
        boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.1)`,
        zIndex: '1'
      }}
      ref={dropdownNode}
    >
      <NavPanel items={items} />
    </div>
  )
}

function NavPanel({ items }) {
  const [{ minHeight }, dispatch] = useStateValue();

  // Set panel open to null on "unmount" of the NavPanel.
  // This is useful so that when opening a different dropdown,
  // it wont use a previous panel index. It resets.
  useEffect(() => {
    return () => {
      dispatch({
        type: 'setPanelOpen',
        panelOpen: null
      })
    }
  }, [])

  return (
    <div css={{
      position: 'relative',
    }}>
      <ul css={{
        width: '24rem',
        borderRight: `solid 1px ${COLORS.neutral[100]}`,
        padding: `${SPACING['S']} 0`,
        minHeight
      }}>
        {items.map((item, i) => (
          <NavPanelItem {...item} i={i} key={i + item.text} />
        ))}
      </ul>
    </div>
    
  )
}

function NavPanelItem({ text, to, description, children, i }) {
  const [{ panelOpen }, dispatch] = useStateValue();
  const isOpen = panelOpen === i

  function activeStyles() {
    if (isOpen) {
      return {
        borderColor: COLORS.teal['400'],
        background: COLORS.teal['100']
      }
    }

    return {}
  }

  return (
    <li>
      <button
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          textAlign: 'left',
          padding: `${SPACING['S']} ${SPACING['L']}`,
          paddingLeft: `calc(${SPACING['L']} - 3px)`,
          borderLeft: 'solid 3px transparent',
          fontWeight: '600',
          ":hover": {
            cursor: 'pointer'
          },
          ...activeStyles()
        }}
        onClick={() => dispatch({
          type: 'setPanelOpen',
          panelOpen: panelOpen === i ? null : i
        })}
        aria-expanded={panelOpen === i}
      >{text} <span><Icon icon="navigate_next" /></span></button>

      
        
      {isOpen && (
        <NavPanelItemLinks
          parentItem={{ text, to, description, }}
          items={children}
        />
      )}
    </li>
  )
}

function NavPanelItemLinks({
  parentItem,
  items
}) {
  const [{}, dispatch] = useStateValue();
  const ref = useRef()

  useEffect(() => {
    dispatch({
      type: 'setMinHeight',
      minHeight: ref.current.clientHeight
    })
  }, [])

  return (
    <div css={{
      position: 'absolute',
      right: '0',
      top: '0',
      width: 'calc(100% - 24rem)',
      padding: `${SPACING['XL']} ${SPACING['2XL']}`,
    }}
    ref={ref}
    >
      <Heading size="M" level={2}>{parentItem.text}</Heading>
      {parentItem.description && (<p css={{
        color: COLORS.neutral[300],
        paddingTop: SPACING['XS']
      }}>{parentItem.description}</p>)}
      {items ? (
        <ul
          css={{
            columns: '2',
            columnGap: SPACING["L"],
            paddingTop: SPACING['M'],
            marginTop: SPACING['M'],
            borderTop: `solid 1px ${COLORS.neutral['100']}`
          }}
        >
          {items.map(({ text, to }, i) => (
            <li key={i + text}>
              <Link
                to={to}
                css={{
                  textDecoration: 'none',
                  color: COLORS.neutral['400'],
                  display: 'inline-block',
                  padding: `${SPACING['XS']} 0`,
                  ":hover": {
                    textDecoration: 'underline'
                  }
                }}
              >{text}</Link>
            </li>
          ))}
          {parentItem.to && (
            <li>
              <Link to={parentItem.to} css={{
                display: 'inline-block',
                marginTop: SPACING['XS'],
                textDecoration: 'none',
                ":hover": {
                  textDecoration: 'underline'
                }
              }}>View all {parentItem.text}</Link>
            </li>
          )}
        </ul>
      ) : (
        <div css={{
          padding: `${SPACING['L']} 0`
        }}>
          <Alert intent="warning">
            <span style={{ fontSize: '1rem' }}>
              This navigation panel does not have any pages to show.
            </span>
          </Alert>
        </div>
      )}
    </div>
  )
}

export default Nav