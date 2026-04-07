import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getMyReports } from '../services/interview.api'
import '../style/allReports.scss'
import { SkeletonCard } from '../../../components/Skeleton'

const AllReports = () => {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true)
                const data = await getMyReports()
                setReports(data || [])
            } catch (err) {
                setError(err.message || 'Failed to load reports')
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    const truncateDescription = (text, maxLength = 150) => {
        if (!text) return ''
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const getScoreColor = (score) => {
        if (score > 85) return 'high'
        if (score >= 60) return 'medium'
        return 'low'
    }

    const handleOpenReport = (id) => {
        navigate(`/interview/${id}`)
    }

    if (loading) {
        return (
            <div className='all-reports-container'>
                <h1 className='all-reports-title'>Your Generated Reports</h1>
                <div className='all-reports-grid'>
                    {Array.from({ length: 6 }, (_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='all-reports-error'>
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        )
    }

    if (!reports.length) {
        return (
            <div className='all-reports-empty'>
                <p>No reports found. Generate your first interview report!</p>
            </div>
        )
    }

    return (
        <section className='all-reports'>
            <div className='all-reports-container'>
                <h2 className='all-reports-title'>My Interview Reports</h2>
                <div className='reports-list'>
                    {reports.map((report) => (
                        <article
                            key={report.id}
                            className='report-card'
                            onClick={() => handleOpenReport(report.id)}
                        >
                            <div className='report-card-content'>
                                <h3 className='report-title'>{report.title}</h3>
                                <p className='report-description'>
                                    {truncateDescription(report.jobDescription)}
                                </p>
                                <div className='report-footer'>
                                    <span className={`match-score match-score--${getScoreColor(report.matchScore)}`}>
                                        {report.matchScore}% Match
                                    </span>
                                    <button
                                        className='open-report-btn'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleOpenReport(report.id)
                                        }}
                                    >
                                        Open Report
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AllReports