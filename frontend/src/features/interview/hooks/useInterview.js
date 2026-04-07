import { generateReport, getMyReports, getReportById } from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {
    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReportForUser = async ({ jobDescription, selfDescription, file }) => {
        setLoading(true)
        try {
            const response = await generateReport({ file, jobDescription, selfDescription })

            const parsedReport =
                typeof response?.reportJson === "string"
                    ? JSON.parse(response.reportJson)
                    : response?.reportJson || null

            if (!parsedReport) {
                throw new Error("reportJson missing or invalid in generateReport response")
            }

            setReport(parsedReport)
            return response
        } catch (error) {
            console.error("[useInterview] generateReportForUser error:", error)
            setReport(null)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportByIdForUser = async (interviewId) => {
        setLoading(true)
        try {
            const response = await getReportById(interviewId)

            const parsedReport =
                typeof response?.reportJson === "string"
                    ? JSON.parse(response.reportJson)
                    : response?.reportJson || null

            if (!parsedReport) {
                throw new Error("reportJson missing or invalid in API response")
            }

            setReport(parsedReport)
            return parsedReport
        } catch (error) {
            console.error("[useInterview] getReportByIdForUser error:", error)
            setReport(null)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getMyReports()
            setReports(response)
        } catch (error) {
            // Error handled silently
        } finally {
            setLoading(false)
        }
    }

    return { loading, report, reports, generateReportForUser, getReports, getReportByIdForUser }
}