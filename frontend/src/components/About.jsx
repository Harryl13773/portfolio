import { useState } from 'react'
import './About.css'

// Coursework grouped by department
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

const SKILLS = [
  { label: 'Languages', items: ['Python', 'JavaScript', 'C++', 'C', 'Java', 'SQL', 'MATLAB'] },
  { label: 'Frameworks', items: ['React', 'Node.js', 'Express', 'FastAPI', 'NumPy', 'Pandas'] },
  { label: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'] },
  { label: 'Databases', items: ['PostgreSQL', 'ChromaDB', 'Vector Databases'] },
]

function About() {
  const [showCourses, setShowCourses] = useState(false)

  return (
    <div className="split about">
      <div className="about-intro">
        <p className="about-bio">
          Computer Engineering graduate from The Ohio State University building full-stack
          web applications, embedded systems, and AI-powered backends.
        </p>
        <p className="about-location">Based in Dayton, OH</p>

        <div className="about-education">
          <p className="about-school">The Ohio State University</p>
          <p className="about-degree">B.S. Electrical &amp; Computer Engineering, May 2026</p>
          <button
            className="about-courses-toggle"
            onClick={() => setShowCourses((open) => !open)}
            aria-expanded={showCourses}
            aria-controls="about-aside"
          >
            {showCourses ? 'Show skills' : 'Show coursework'}
          </button>
        </div>
      </div>

      {/* Skills and coursework toggle in place */}
      <div id="about-aside" className="about-aside">
        <dl className={'skills about-view' + (showCourses ? ' about-view-hidden' : '')} inert={showCourses}>
          {SKILLS.map((group) => (
            <div key={group.label} className="skill-row">
              <dt className="about-heading">{group.label}</dt>
              <dd>{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>

        <div className={'coursework about-view' + (showCourses ? '' : ' about-view-hidden')} inert={!showCourses}>
          {COURSE_GROUPS.map((group) => (
            <div key={group.dept}>
              <h3 className="about-heading">{group.dept} coursework</h3>
              <ul className="coursework-list">
                {group.courses.map((course) => (
                  <li key={course.code}>
                    <span className="coursework-code">{course.code}</span>
                    <span>{course.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
