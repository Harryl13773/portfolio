import { useState } from 'react'
import './About.css'

// the courses in groups
const COURSE_GROUPS = [
  {
    dept: 'ECE',
    courses: [
      { code: '2020', name: 'Analog Systems and Circuits' },
      { code: '2050', name: 'Introduction to Discrete Time & Signals' },
      { code: '2060', name: 'Introduction to Digital Logic' },
      { code: '2560', name: 'Introduction to Microcontrollers & Systems' },
      { code: '3020', name: 'Introduction to Electronics' },
      { code: '3027', name: 'Electronics Lab' },
      { code: '3567', name: 'Microcontroller Lab' },
      { code: '3561', name: 'Advanced Digital Design' },
      { code: '5307', name: 'Introduction to Machine Learning' },
      { code: '5362', name: 'Computer Architecture and Design' },

    ],
  },
  {
    dept: 'CSE',
    courses: [
      { code: '1222', name: 'Programming C++' },
      { code: '1223', name: 'Programming Java' },
      { code: '2221', name: 'Software I: Software Components' },
      { code: '2231', name: 'Software II: Software Development' },
      { code: '2431', name: 'Systems II: Operating Systems' },
      { code: '2451', name: 'Advanced C Programming' },
      { code: '5471', name: 'Introduction to Cybersecurity' },      
      { code: '5477.02', name: 'Reverse Engineering & Malware Analysis' },      
    ],
  },
]

// Shared renderer for both presentations (inline unfold on phones, side panel on desktop)
function CourseGroups() {
  return (
    <div className="coursework-groups">
      {COURSE_GROUPS.map((group) => (
        <div key={group.dept} className="coursework-group">
          <span className="coursework-dept">{group.dept}</span>
          <ul className="coursework-list">
            {group.courses.map((course) => (
              <li key={course.code} className="coursework-item">
                <span className="coursework-code">{group.dept} {course.code}</span>
                <span className="coursework-name">{course.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function About() {
  const [showCourses, setShowCourses] = useState(false)

  return (
    <section className={'about' + (showCourses ? ' about-split' : '')}>
      <div className="about-main">

      {/* Hero — status, name, and current role */}
      <div className="about-hero">
        <p className="about-status">
          <span className="status-dot" aria-hidden="true" />
          Welcome to my website! · Dayton, OH
        </p>
        <h1 className="about-name">Harry Lian</h1>
        <p className="about-role">Computer Engineer · Full-Stack Developer</p>
      </div>

      {/* Short bio */}
      <p className="about-bio">
        Computer Engineering graduate from The Ohio State University with hands-on experience
        building full-stack web applications, embedded systems, and AI-powered backends.
      </p>

      {/* Education — school name toggles the coursework list */}
      <div className="about-education">
        <button
          className="about-school"
          onClick={() => setShowCourses((open) => !open)}
          aria-expanded={showCourses}
          aria-controls="coursework"
        >
          The Ohio State University
          <svg
            className={'school-chevron' + (showCourses ? ' school-chevron-open' : '')}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <p className="about-degree">B.S. Electrical & Computer Engineering · May 2026</p>

        <div
          id="coursework"
          className={'coursework' + (showCourses ? ' coursework-open' : '')}
        >
          <div className="coursework-inner">
            <span className="coursework-label">Relevant coursework</span>
            <CourseGroups />
          </div>
        </div>
      </div>

      {/* Skills grouped by category */}
      <div className="about-skills">

        <div className="skill-group">
          <span className="skill-label">Languages</span>
          <div className="skill-pills">
            {['Python', 'JavaScript', 'C++', 'C', 'Java', 'SQL', 'MATLAB'].map((s) => (
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

      </div>

      {/* Desktop side panel — same courses, shown >900px; phones use the inline unfold above */}
      <aside
        className="about-panel"
        aria-label="Relevant coursework"
        aria-hidden={!showCourses}
      >
        <div className="about-panel-inner">
          <span className="coursework-label">Relevant coursework</span>
          <CourseGroups />
        </div>
      </aside>
    </section>
  )
}

export default About