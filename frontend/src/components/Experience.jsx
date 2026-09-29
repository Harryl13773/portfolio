import { useState } from 'react';
import './Experience.css';

// Company logos
import osuLogo from '../assets/OhioState.png';
import realityAiLogo from '../assets/RealityAILab.png';

// Positions, newest first
const JOBS = [
  {
    id: 1,
    role: 'Electronic Devices Lab Monitor',
    company: 'The Ohio State University',
    logo: osuLogo,
    dates: 'Sept. 2025 – May 2026',
    location: 'Columbus, OH',
    points: [
      'Diagnosed and resolved faults in analog and digital circuits across 3 weekly lab sections supporting 20+ students each, reducing average troubleshooting time by 35% through systematic isolation methodologies.',
      'Guided 60+ students per week through LTspice simulation and oscilloscope measurement workflows, improving average lab report accuracy by 20% through structured pre-lab walkthroughs and real-time fault diagnosis.',
    ],
    tech: ['Analog Circuits', 'LTspice', 'Oscilloscope', 'Digital Logic'],
  },
  {
    id: 2,
    role: 'Software Developer Intern',
    company: 'Reality AI Lab',
    logo: realityAiLogo,
    dates: 'May 2025 – Sept. 2025',
    location: 'Remote',
    points: [
      'Reduced average page load time by 30% across 5+ React interfaces through component-level code splitting, lazy loading, and memoization, backed by RESTful APIs in Node.js and Python.',
      'Cut mean time to bug resolution from 4 hours to under 90 minutes by owning end-to-end debugging workflows with LogRocket session replay, contributing to a 40% reduction in production bug rate.',
      'Engineered core retrieval and ranking logic for a real-time AI recommendation engine - built in Python with vector similarity search and integrated into a Node.js microservice serving 10,000+ daily active users.',
    ],
    tech: ['React', 'Node.js', 'Python', 'REST APIs', 'LogRocket'],
  },
];

function Experience() {
  const [selectedId, setSelectedId] = useState(JOBS[0].id);
  const job = JOBS.find((j) => j.id === selectedId);

  return (
    <div className="split">
      <ul className="picker">
        {JOBS.map((j) => (
          <li key={j.id}>
            <button
              className="picker-item"
              aria-pressed={j.id === selectedId}
              onClick={() => setSelectedId(j.id)}
            >
              <span className="picker-title">{j.role}</span>
              <span className="picker-meta">{j.company}, {j.dates}</span>
            </button>
          </li>
        ))}
      </ul>

      <article key={job.id} className="experience-detail" aria-live="polite">
        <div className="experience-head">
          {job.logo && (
            <img
              className="experience-logo"
              src={job.logo}
              alt=""
              width="44"
              height="44"
              decoding="async"
            />
          )}
          <div>
            <h2 className="detail-title">{job.role}</h2>
            <p className="detail-meta">
              {job.company}, {job.location}. {job.dates}
            </p>
          </div>
        </div>

        <ul className="detail-points">
          {job.points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>

        <p className="detail-tech">
          <strong>Tools</strong> {job.tech.join(', ')}
        </p>
      </article>
    </div>
  );
}

export default Experience;
