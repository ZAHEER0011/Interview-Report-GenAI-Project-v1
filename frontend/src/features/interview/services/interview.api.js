import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

// attach token automatically (same as auth.api.js)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// AI REPORT API
export async function generateReport({ file, jobDescription, selfDescription }) {
    try {
        const formData = new FormData()

        formData.append("resume", file)
        formData.append("jobDescription", jobDescription)
        formData.append("selfDescription", selfDescription)

        const response = await api.post("/api/interview/report", formData)

        return response.data
    } catch (error) {
        console.error("AI ERROR:", error)
        throw error.response?.data || "AI Report generation failed"
    }
}

// ✅ GET SINGLE REPORT
export async function getReportById(id) {
    try {
        const response = await api.get(`/api/interview/report/${id}`)

        const data = response.data
        const parsed = typeof data === "string" ? JSON.parse(data) : data

        let reportContent = null
        if (parsed?.reportJson) {
            reportContent =
                typeof parsed.reportJson === "string"
                    ? JSON.parse(parsed.reportJson)
                    : parsed.reportJson
        }

        const normalized = {
            id: parsed?.id,
            jobDescription: parsed?.jobDescription || "",
            reportJson: reportContent,
        }

        return normalized
    } catch (error) {
        console.error("GET REPORT ERROR:", error)
        throw error.response?.data || "Failed to fetch report"
    }
}


// ✅ GET ALL REPORTS (for dashboard later)
export async function getMyReports() {
    try {
        const response = await api.get(`/api/interview/my-reports`)
        return response.data
    } catch (error) {
        console.error("GET ALL REPORTS ERROR:", error)
        throw error.response?.data || "Failed to fetch reports"
    }
}