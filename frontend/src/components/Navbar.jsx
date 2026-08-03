import { memo } from 'react'
import { BuildingIcon } from './Icons'

const Navbar = ({ activePage, menuItems, onNavigate }) => {
  return (
    <header className="navbar" role="banner">
      <div className="navbar__brand" aria-label="Gurgaon Real Estate Intelligence Platform">
        <span className="navbar__logo" aria-hidden="true">
          <BuildingIcon />
        </span>
        <div>
          <p className="navbar__eyebrow">Gurgaon Real Estate</p>
          <h1 className="navbar__title">Intelligence Platform</h1>
        </div>
      </div>

      <nav className="navbar__nav" aria-label="Primary navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activePage === item.id ? 'nav-link nav-link--active' : 'nav-link'}
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default memo(Navbar)