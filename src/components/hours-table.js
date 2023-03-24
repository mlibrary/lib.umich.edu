import React from 'react';
import Link from './link';

export default function HoursTableResponsive({ data, dayOfWeek = false, location }) {
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
            borderRight: todayBorderStyle,
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
          width: '1px',
        },
        'th.today': {
          borderTop: todayBorderStyle
        }
      }}>
        <tr>
          <th scope="col" colSpan="2">
            <span className="visually-hidden">Inside {location}</span>
          </th>
          {data.headings.map(({ text, subtext, label }, i) => (
            <th
              scope="col"
              key={text + subtext + i}
              className={i + 1 === todayIndex ? 'today' : ''}
              css={{
                verticalAlign: 'bottom'
              }}
            >
              {i + 1 === todayIndex && (
                <span
                  css={{
                    background: 'var(--color-maize-400)',
                    borderRadius: '2px 2px 0 0',
                    bottom: '100%',
                    display: 'inline-block',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    left: '-2px',
                    padding: '0 0.25rem',
                    position: 'absolute',
                    textTransform: 'uppercase'
                  }}
                >
                  Today
                </span>
              )}
              <abbr aria-label={label}>
                <span
                  css={{
                    display: 'block',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '0.875rem',
                  }}
                >
                  {text}
                </span>
                <span css={{ color: 'var(--color-neutral-300)' }}>{subtext}</span>
              </abbr>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, y) => (
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
                },
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
            {row.map((col, i) => (
              <React.Fragment key={row + col.label + y + i}>
                {i === 0 ? (
                  <th
                    scope="row"
                    colSpan="2"
                    css={{
                      [tableBreakpoint]: {
                        background: 'var(--color-blue-100)',
                        borderBottomColor: 'var(--color-neutral-100)'
                      }
                    }}
                  >
                    {console.log(row, y)}
                    <Link to={col.to} kind="list-medium">
                      {col.text}
                    </Link>
                  </th>
                ) : (
                  <td
                    className={i === todayIndex ? 'today' : ''}
                    css={{
                      [tableBreakpoint]: {
                        display: 'flex!important'
                      }
                    }}
                  >
                    <span
                      data-text={data.headings[i-1].text}
                      data-subtext={data.headings[i-1].subtext}
                      css={{
                        [tableBreakpoint]: {
                          display: 'inline-block',
                          flex: '0 0 8.5rem',
                          '&:before, &:after': {
                            display: 'inline'
                          },
                          '&:before': {
                            content: 'attr(data-text) " "',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            fontSize: '0.875rem'
                          },
                          '&:after': {
                            color: 'var(--color-neutral-300)',
                            content: 'attr(data-subtext) " "'
                          }
                        }
                      }}
                    ></span>
                    <span
                      css={{
                        [tableBreakpoint]: {
                          flexGrow: '1',
                          paddingRight: `${i === todayIndex ? '4rem' : 'inherit'}`,
                          '&:after': {
                            alignItems: 'center',
                            bottom: '0',
                            content: `${i === todayIndex ? '"Today"' : 'none'}`,
                            display: 'flex',
                            padding: '0.25rem 0.5rem',
                            position: 'absolute',
                            background: 'var(--color-maize-400)',
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            right: '0',
                            textTransform: 'uppercase',
                            top: '0'
                          }
                        }
                      }}
                    >
                      {col.text}
                    </span>
                  </td>
                )}
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
