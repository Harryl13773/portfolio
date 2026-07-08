import './Experience.css';

// Company logos — Vite hashes and bundles these like the resume PDF
import osuLogo from '../assets/OhioState.png';
import realityAiLogo from '../assets/RealityAILab.png';

// Positions from resume — newest first.
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
  return (
    <div className="experience">
      <span className="section-eyebrow experience-eyebrow reveal">
        Experience
      </span>
      <h2 className="experience-heading reveal">Where I&apos;ve Worked</h2>

      <ol className="experience-list">
        {JOBS.map((job) => (
          <li key={job.id} className="experience-item reveal">
            <div className="experience-marker" aria-hidden="true" />

            {job.logo && (
              <img
                className="experience-logo"
                src={job.logo}
                alt={`${job.company} logo`}
                loading="lazy"
              />
            )}

            <div className="experience-content">
              <div className="experience-top">
                <h3 className="experience-role">{job.role}</h3>
                <span className="experience-dates">{job.dates}</span>
              </div>

              <p className="experience-company">
                {job.company}
                {job.location && (
                  <span className="experience-location"> · {job.location}</span>
                )}
              </p>

              <ul className="experience-points">
                {job.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>

              {job.tech && job.tech.length > 0 && (
                <div className="experience-tech">
                  {job.tech.map((t) => (
                    <span key={t} className="experience-pill">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Experience;