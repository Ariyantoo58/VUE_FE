import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

const config = {
	baseURL: "http://localhost:8001",
	// timeout: 60 * 1000, // Timeout
	withCredentials: true, // Check cross-site Access-Control
};

const accessToken = Cookies.get("accessToken");

const Api = axios.create(config);

Api.defaults.withCredentials = true;

Api.interceptors.request.use(
	function (config) {
		// Do something before request is sent

		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

// Add a response interceptor
Api.interceptors.response.use(
	function (response) {
		// Do something with response data
		response = typeof response.data !== undefined ? response.data : response;
		return response;
	},
	function (error) {
		// Do something with response error
		return Promise.reject(error);
	}
);

export default Api;
