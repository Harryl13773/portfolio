import './About.css'

function About() {
  return (
    <section className="about">

      {/* Hero — name and current role */}
      <div className="about-hero">
        <h1 className="about-name">Harry Lian</h1>
        <p className="about-role">Computer Engineer · Full-Stack Developer</p>
      </div>

      {/* Short bio */}
      <p className="about-bio">
        Computer Engineering graduate from Ohio State University with hands-on experience
        building full-stack web applications, embedded systems, and AI-powered backends.
        Passionate about writing clean, purposeful code — from React frontends to Node.js
        APIs to low-level firmware.
      </p>

      {/* Education */}
      <div className="about-education">
        <p className="about-school">Ohio State University</p>
        <p className="about-degree">B.S. Electrical & Computer Engineering · May 2026</p>
        <p className="about-honors">Dean's List · 3rd Place Engineering Showcase · Daytona LaSertoma Recipient</p>
      </div>

      {/* Skills grouped by category */}
      <div className="about-skills">

        <div className="skill-group">
          <span className="skill-label">Languages</span>
          <div className="skill-pills">
            {['Python', 'JavaScript', 'C++', 'C', 'Java', 'SQL', 'HTML/CSS'].map((s) => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>

        <div className="skill-group">
          <span className="skill-label">Frameworks</span>
          <div className="skill-pills">
            {['React', 'Node.js', 'Express', 'FastAPI', 'NumPy', 'Pandas'].map((s) => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>

        <div className="skill-group">
          <span className="skill-label">Cloud & DevOps</span>
          <div className="skill-pills">
            {['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'].map((s) => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>

        <div className="skill-group">
          <span className="skill-label">Databases</span>
          <div className="skill-pills">
            {['PostgreSQL', 'ChromaDB', 'Vector Databases'].map((s) => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </div>

      </div>

    </section>
  )
}

export default About