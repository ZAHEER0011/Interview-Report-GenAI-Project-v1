import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'
import AllReports from './AllReports'
import LoadingSpinner from '../../../components/LoadingSpinner'

function Home() {

    const { loading, generateReportForUser } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedResumeName, setSelectedResumeName] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleResumeSelect = (event) => {
        const file = event.target.files?.[0]
        setSelectedResumeName(file?.name || "")
    }

    const handleViewReports = () => {
        navigate('/my-reports')
    }

    const handleGenerateReoprt = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReportForUser({ jobDescription, selfDescription, file: resumeFile })
        const reportId = data?.id || data?.reportId
        if (!reportId) {
            console.error("[Home] no report id returned from generateReportForUser", data)
            return
        }
        navigate(`/interview/${reportId}`)
    }

    if(loading){
        return <LoadingSpinner size="large" message="Generating your interview report..." />
    }

    return (
        <main className='home'>
            <div className='container'>
                <header className='headline'>
                    <h1>Generate Your <span className='heading-highlight'>Interview Report</span></h1>
                    <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
                </header>

                <section className='cards'>
                    <article className='card job-card'>
                        <div className='card-title'>
                            <span className='dot'></span>
                            <h2>Target Job Description</h2>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            id='jobDescription'
                            name='jobDescription'
                            placeholder='Paste the full job description here... e.g. Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale systems design.'
                            rows={14}
                        />
                        <div className='char-count'>0 / 5000 chars</div>
                    </article>

                    <article className='card profile-card'>
                        <div className='card-title'>
                            <span className='dot'></span>
                            <h2>Your Profile</h2>
                        </div>

                        <div className='upload-group'>
                            <p>Upload Resume <small>(PDF only)</small></p>
                            <label htmlFor='resume' className='upload-box'>
                                <span className='upload-icon'>⬆</span>
                                <strong>{selectedResumeName || 'Click to upload or drag & drop'}</strong>
                                <span className='upload-help'>{selectedResumeName ? `${selectedResumeName} selected` : 'PDF or DOCX (max 5MB)'}</span>
                            </label>
                            <input ref={resumeInputRef} onChange={handleResumeSelect} type='file' id='resume' name='resume' accept='.pdf,.docx' hidden />
                        </div>

                        <div className='self-desc-group'>
                            <label htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                placeholder='Briefly describe your experience, skills, and career goals...'
                                rows={7}
                            />
                        </div>

                        <p className='note'>Either a Resume or a Self Description is required to generate a personalized plan.</p>

                        <div className='profile-actions'>
                            <button type='button' onClick={handleViewReports} className='secondary-btn'>All Generated Reports</button>
                            <button type='button' onClick={handleGenerateReoprt} className='generate-btn'>Generate Interview Report</button>
                        </div>
                    </article>
                </section>

            </div>
            <AllReports />
        </main>
    )
}

export default Home
