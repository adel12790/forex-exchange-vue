import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const apiClient = axios.create({
  baseURL: 'https://api.massive.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const apiKey = import.meta.env.VITE_MASSIVE_API_KEY
    
    if (apiKey) {
      config.params = {
        ...config.params,
        apiKey
      }
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      const message = (error.response.data as any)?.message || error.message
      
      if (status === 429) {
        throw new Error('API rate limit exceeded. Please wait a moment and try again.')
      } else if (status === 401 || status === 403) {
        throw new Error('Invalid API key. Please check your configuration.')
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(message)
      }
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.')
    } else {
      throw new Error(error.message)
    }
  }
)

export default apiClient

