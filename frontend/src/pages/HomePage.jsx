import Hero from '../components/Hero'

const HomePage = ({ metrics, featureCards, heroActions, onNavigate }) => {
  return (
    <div className="page-stack">
      <Hero
        title="Modern Gurgaon property intelligence for faster decisions"
        description="Estimate prices, study market patterns, and compare properties through a clean dashboard built for real estate workflows."
        actions={heroActions}
        metrics={metrics}
        onAction={onNavigate}
      />

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Project capabilities</p>
            <h2>What this platform delivers</h2>
          </div>
        </div>

        <div className="feature-grid">
          {featureCards.map((card) => (
            <article className="feature-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage