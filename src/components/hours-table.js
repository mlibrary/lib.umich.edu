import React from 'react';
import Link from './link';

export default function HoursTableResponsive ({ data, dayOfWeek = false, location }) {
  const todayIndex = dayOfWeek !== false ? dayOfWeek + 1 : -1;
  const todayBorderStyle = '2px solid var(--color-maize-400)';
  const tableBreakpoint = '@media only screen and (max-width: 1100px)';

  return (
    <table
      css={{
        marginTop: '2rem',
        tableLayout: 'fixed',
        textAlign: 'left',
        width: '100%',
        'tr > *': {
          padding: '0.75rem',
          position: 'relative',
          [tableBreakpoint]: {
            display: 'block',
            padding: '0.25rem 0.5rem'
          },
          '&.today': {
            borderLeft: todayBorderStyle,
            borderRight: todayBorderStyle
          },
          '& *.alternative': {
            fontSize: '0.875rem',
            fontWeight: '700',
            textTransform: 'uppercase'
          }
        }
      }}
    >
      <thead css={{
        borderBottom: '2px solid var(--color-neutral-100)',
        [tableBreakpoint]: {
          clip: 'rect(1px, 1px, 1px, 1px)',
          clipPath: 'inset(50%)',
          height: '1px',
          overflow: 'hidden',
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px'
        },
        'th.today': {
          borderTop: todayBorderStyle
        }
      }}
      >
        <tr>
          <th scope='col' colSpan='2'>
            <span className='visually-hidden'>{`Inside ${location}`}</span>
          </th>
          {data.headings.map(({ text, subtext, label }, i) => {
            return (
              <th
                scope='col'
                key={text + subtext + i}
                className={i + 1 === todayIndex ? 'today' : ''}
                css={{
                  verticalAlign: 'bottom'
                }}
              >
                {i + 1 === todayIndex && (
                  <span
                    aria-hidden
                    className='alternative'
                    css={{
                      background: 'var(--color-maize-400)',
                      borderRadius: '2px 2px 0 0',
                      bottom: '100%',
                      display: 'inline-block',
                      left: '-2px',
                      padding: '0 0.25rem',
                      position: 'absolute'
                    }}
                  >
                    Today
                  </span>
                )}
                <abbr aria-label={i + 1 === todayIndex ? `Today, ${label}` : label}>
                  <span
                    className='alternative'
                    css={{
                      display: 'block'
                    }}
                  >
                    {text}
                  </span>
                  <span css={{ color: 'var(--color-neutral-300)' }}>{subtext}</span>
                </abbr>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, y) => {
          return (
            <tr
              key={row + y}
              css={{
                borderBottom: '1px solid var(--color-neutral-100)',
                [tableBreakpoint]: {
                  borderBottom: '0',
                  '&:not:(:first-of-type)': {
                    background: 'inherit'
                  }
                },
                '&:first-of-type': {
                  background: 'var(--color-blue-100)',
                  [tableBreakpoint]: {
                    background: 'inherit'
                  }
                },
                '& > *': {
                  [tableBreakpoint]: {
                    border: '2px solid transparent',
                    '&.today': {
                      border: todayBorderStyle
                    }
                  }
                },
                '&:last-of-type > *.today': {
                  borderBottom: todayBorderStyle
                }
              }}
            >
              {row.map((col, i) => {
                return (
                  <React.Fragment key={row + col.label + y + i}>
                    {i === 0
                      ? (
               <th
                        scope='row'
                        colSpan='2'
                        css={{
             [tableBreakpoint]: {
               background: 'var(--color-blue-100)',
               borderBottomColor: 'var(--color-neutral-100)'
             }
           }}
                      >
                        <Link to={col.to} kind='list-medium'>
             {col.text}
           </Link>
                      </th>
                        )
                      : (
               <td
                        className={i === todayIndex ? 'today' : ''}
                        css={{
             [tableBreakpoint]: {
               display: 'grid!important',
               gap: '5%',
               gridTemplateColumns: 'minmax(min-content, 6.5rem) 5fr max-content'
             }
           }}
                      >
                        <div
             css={{
                          alignContent: 'baseline',
                          alignItems: 'baseline',
                          display: 'none',
                          flexWrap: 'wrap',
                          [tableBreakpoint]: {
                            display: 'flex'
                          }
                        }}
           >
             <span
                          className='alternative'
                          css={{
                            paddingRight: '0.5em'
                          }}
                        >
                          {data.headings[i - 1].text}
                        </span>
             <span
                          css={{
                            color: 'var(--color-neutral-300)'
                          }}
                        >
                          {data.headings[i - 1].subtext}
                        </span>
           </div>
                        <abbr
             aria-label={col.label}
             css={{
                          gridColumn: `2 / span ${i === todayIndex ? '1' : '2'}`
                        }}
           >
             {col.text}
           </abbr>
                        {i === todayIndex && (
             <span
                          aria-hidden
                          className='alternative'
                          css={{
                            background: 'var(--color-maize-400)',
                            display: 'none',
                            [tableBreakpoint]: {
                              alignItems: 'center',
                              display: 'flex'
                            },
                            margin: '-0.25rem -0.5rem',
                            marginLeft: '0',
                            padding: '0 0.5rem'
                          }}
                        >
                          Today
                        </span>
           )}
                      </td>
                        )}
                  </React.Fragment>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
