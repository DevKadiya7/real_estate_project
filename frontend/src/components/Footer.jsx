import { memo } from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <p className="footer__title">Gurgaon Real Estate Intelligence Platform</p>
        <p className="footer__text">Price prediction, analytics, and recommendations for Gurgaon property discovery.</p>
      </div>

      <a className="footer__link" href="https://github.com/" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </footer>
  )
}

export default memo(Footer)