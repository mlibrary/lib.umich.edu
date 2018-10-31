import React from 'react'
import { Link } from 'gatsby'

const Navigation = ({ data }) => {
  const navData = data.map((page) => {
    return {
      title: page.title,
      link: page.path.alias
    }
  })

  return (
    <nav style={{ marginTop: '2rem' }}>
      <h2>Child pages</h2>
      <ul>
        {navData.map(item => (
          <li><Link to={item.link}>{item.title}</Link></li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation