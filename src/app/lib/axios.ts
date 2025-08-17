import axios from 'axios'

const axiosInstance = axios.create({ baseURL: 
    process.env.NEXT_PUBLIC_API_URL || 'https://56a2a7d2d775.ngrok-free.app'})

export default axiosInstance