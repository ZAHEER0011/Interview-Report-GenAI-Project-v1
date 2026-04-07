import axios from "axios"

const api = axios.create(
    {
        baseURL: import.meta.env.VITE_BASE_URL
    }
)

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export async function register({ username, email, password }) {
    try {
        const response = await api.post(`/api/auth/register`, {
            username, email, password
        })

        return response.data
    } catch (error) {
        throw error.response?.data || "Registration failed"
    }
}

export async function login({email, password}){
    try {
        const response = await api.post(`/api/auth/login`,{
            email, password
        })

        const token = response.data.token   // ✅ FIX
        localStorage.setItem("token", token)

        return response.data   // includes user + token
    } catch (error) {
        throw error.response?.data || "Login Failed"
    }
}

export async function logout() {
    try {
        const response = await api.post(`/api/auth/logout`)

        return response.data
    } catch (error) {
        throw error.response?.data || "Logout Failed"
    }
}

export async function getMe() {
    try {
        const response = await api.get(`/api/auth/user/get-me`)
        return response.data
    } catch (error) {
        throw error.response?.data || "User Data fetch Failed"
    }
}