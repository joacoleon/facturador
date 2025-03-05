import axios, { type AxiosRequestConfig, type AxiosRequestHeaders } from "axios";
import { useAuthStore } from '@/stores/AuthStore';

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
    headers: AxiosRequestHeaders
}

const ApiHelper = axios.create();

ApiHelper.interceptors.request.use(
    async (config): Promise<AdaptAxiosRequestConfig> => {
        config.baseURL = import.meta.env.VITE_API_URL;
        config.timeout = 10000;

        const authStore = useAuthStore();

        const token = await authStore.getIdToken();
        if (token) {
            console.log(token);
            config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers.Accept = 'application/json';
        config.headers.ContentType = 'application/json';

        return config;
    },
    (error): any => {
        return Promise.reject(error);
    }
);

export default ApiHelper;