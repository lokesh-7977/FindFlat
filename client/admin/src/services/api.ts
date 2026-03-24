import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token =
			typeof window !== "undefined"
				? localStorage.getItem("accessToken")
				: null;
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken =
					typeof window !== "undefined"
						? localStorage.getItem("refreshToken")
						: null;
				if (refreshToken) {
					const response = await axios.post(
						`${api.defaults.baseURL}/auth/refresh`,
						{ refreshToken },
					);
					const { accessToken } = response.data;

					if (typeof window !== "undefined") {
						localStorage.setItem("accessToken", accessToken);
					}

					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					}
					return api(originalRequest);
				}
			} catch (_refreshError) {
				if (typeof window !== "undefined") {
					localStorage.removeItem("accessToken");
					localStorage.removeItem("refreshToken");
					window.location.href = "/login";
				}
			}
		}

		return Promise.reject(error);
	},
);

export default api;
