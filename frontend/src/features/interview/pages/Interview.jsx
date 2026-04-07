import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from "../hooks/useInterview"
import { useParams, useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import LoadingSpinner from '../../../components/LoadingSpinner'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// const report = {
//     title: 'Full Stack Developer',
//     matchScore: 90,
//     technicalQuestions: [
//         {
//             id: 'tech-1',
//             question: 'You mentioned building reusable React components in your projects. Can you describe your approach to designing a truly reusable and scalable React component?',
//             intention: 'This question evaluates the candidate\'s depth of understanding in React.js, specifically focusing on component architecture, reusability principles, prop management, and performance optimization techniques.',
//             answer: 'The candidate should explain principles like "separation of concerns" and "composition over inheritance". Key points include component structure, prop management, reusability strategies, and performance optimization techniques like React.memo and lazy loading.',
//         },
//         {
//             id: 'tech-2',
//             question: 'In your projects, you\'ve integrated RESTful APIs. Walk me through your design process for a RESTful API endpoint that handles user authentication and session management.',
//             intention: 'This question assesses the candidate\'s understanding of backend development, particularly RESTful API design principles and security best practices.',
//             answer: 'The candidate should outline a structured approach to API design and security including endpoint design, authentication flow using JWT, session management, and security considerations like password hashing and CORS.',
//         },
//         {
//             id: 'tech-3',
//             question: 'You\'ve worked with both MySQL and MongoDB. Based on your experience, for which type of application would you choose MongoDB over MySQL?',
//             intention: 'This question probes the candidate\'s understanding of database choices and their implications on application architecture.',
//             answer: 'Demonstrate understanding of SQL vs NoSQL databases. MySQL for ACID properties and relational data; MongoDB for rapidly evolving data and high scalability. Discuss trade-offs and system design implications.',
//         },
//     ],
//     behavioralQuestions: [
//         {
//             id: 'beh-1',
//             question: 'You mentioned solving key technical issues with analytical thinking during your internship at PocketVendr. Can you describe a particularly challenging technical problem you faced?',
//             intention: 'This question aims to assess the candidate\'s problem-solving skills, analytical thinking, and resilience in real-world scenarios.',
//             answer: 'Use the STAR method (Situation, Task, Action, Result). Describe the context, your responsibility, steps taken for debugging and analysis, and the successful resolution.',
//         },
//         {
//             id: 'beh-2',
//             question: 'Can you share an example of a time you proactively identified a gap in your technical knowledge and successfully worked to fill it?',
//             intention: 'This question assesses the candidate\'s self-awareness, initiative, and commitment to continuous learning.',
//             answer: 'Provide a concrete example of self-directed learning. Detail the situation, motivation, resources used, how you practiced, challenges faced, and the outcome.',
//         },
//         {
//             id: 'beh-3',
//             question: 'You founded and scaled a software agency solo. Tell me about a time you had to take the lead on a project but also needed to collaborate closely with others.',
//             intention: 'This question evaluates the candidate\'s leadership qualities and experience in effective teamwork and collaboration.',
//             answer: 'Describe a project where you demonstrated both leadership and collaboration. Highlight how you defined vision, delegated tasks, solicited feedback, and facilitated discussions.',
//         },
//     ],
//     skillGaps: [
//         { skill: 'Advanced System Design for Scalable Applications', severity: 'medium' },
//         { skill: 'In-depth Backend Architecture Patterns', severity: 'medium' },
//         { skill: 'Advanced Database Optimization Techniques (beyond basics)', severity: 'medium' },
//         { skill: 'Specific Frontend Performance Optimization Methodologies', severity: 'low' },
//         { skill: 'Formal Code Review Experience', severity: 'low' },
//     ],
//     preparationPlan: [
//         {
//             day: 1,
//             focus: 'Core JavaScript & React Refresher',
//             tasks: [
//                 'Review ES6+ features (async/await, promises, destructuring)',
//                 'Deep dive into React Hooks with practical examples',
//                 'Understand React Context API for state management',
//                 'Practice building applications integrating multiple hooks',
//             ],
//         },
//         {
//             day: 2,
//             focus: 'Node.js & Express.js Deep Dive',
//             tasks: [
//                 'Revisit Express.js middleware and error handling',
//                 'Study authentication (JWT, OAuth) patterns',
//                 'Explore advanced Node.js concepts',
//                 'Implement a simple REST API with robust error handling',
//             ],
//         },
//         {
//             day: 3,
//             focus: 'RESTful API Design & Best Practices',
//             tasks: [
//                 'Study principles of RESTful API design',
//                 'Learn about API versioning, pagination, filtering',
//                 'Understand API security best practices',
//                 'Design API endpoints for complex features',
//             ],
//         },
//         {
//             day: 4,
//             focus: 'Database Optimization & Schema Design',
//             tasks: [
//                 'Review SQL indexing strategies and query optimization',
//                 'Explore MongoDB indexing and aggregation pipeline',
//                 'Learn database scaling techniques',
//                 'Practice optimizing slow queries',
//             ],
//         },
//         {
//             day: 5,
//             focus: 'Introduction to System Design',
//             tasks: [
//                 'Study fundamental system design concepts',
//                 'Learn about common architectural patterns',
//                 'Understand key components and scalability',
//                 'Practice designing simple systems',
//             ],
//         },
//         {
//             day: 6,
//             focus: 'Frontend Performance Optimization',
//             tasks: [
//                 'Investigate Web Vitals (LCP, FID, CLS)',
//                 'Learn about code splitting and lazy loading',
//                 'Explore image optimization techniques',
//                 'Run Lighthouse audits on existing projects',
//             ],
//         },
//         {
//             day: 7,
//             focus: 'Behavioral Interview Prep & Project Review',
//             tasks: [
//                 'Prepare answers to common behavioral questions',
//                 'Review your projects with focus on justifying decisions',
//                 'Practice explaining thought process verbally',
//                 'Reflect on areas where you demonstrated leadership',
//             ],
//         },
//     ],
// }

// ── Sub-components ────────────────────────────────────────────────────────────


const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportByIdForUser, loading } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const { handleLogout } = useAuth()

    const handleGoHome = () => navigate('/')
    const handleLogoutClick = async () => {
        try {
            await handleLogout()
        } catch (error) {
            console.error('[Interview] logout failed', error)
        } finally {
            navigate('/login')
        }
    }

    useEffect(() => {
        if (!interviewId) {
            console.warn("[Interview] no interview id in params")
            return
        }

        getReportByIdForUser(interviewId).catch((error) => {
            console.error("[Interview] fetch report error:", error)
        })
    }, [interviewId])

    if (loading) {
        return <LoadingSpinner size="large" message="Loading your interview report..." />
    }

    if (!report) {
        return <h1>No report data available.</h1>
    }

    if (
        !Array.isArray(report.technicalQuestions) ||
        !Array.isArray(report.behavioralQuestions) ||
        !Array.isArray(report.preparationPlan)
    ) {
        console.warn("[Interview] report format invalid", report)
        return <h1>Report is not ready. Retry loading.</h1>
    }
    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">

                        <p className='interview-nav__label'>Title: {`${report.title}`}</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    <div className='interview-toolbar'>
                        <button type='button' className='toolbar-button toolbar-button--back' onClick={handleGoHome}>
                            <span className='toolbar-button__icon'>←</span>
                            Back to Home
                        </button>
                        <button type='button' className='toolbar-button toolbar-button--logout' onClick={handleLogoutClick}>
                            Logout
                        </button>
                    </div>

                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions?.length ?? 0} questions</span>
                            </div>
                            <div className='q-list'>
                                {Array.isArray(report.technicalQuestions) && report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview

