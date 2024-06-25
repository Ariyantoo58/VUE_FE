import { defineStore } from "pinia";

import { fetchWrapper } from "@/helpers";
import { router } from "@/router";
import { useAlertStore } from "@/stores";
import Api from "../service/api";
import Cookies from "js-cookie";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
	id: "auth",
	state: () => ({
		// initialize state from local storage to enable user to stay logged in
		user: JSON.parse(localStorage.getItem("user")),
		accessToken: null,
		returnUrl: null,
	}),
	actions: {
		async login(email, password) {
			try {
				const user = await Api.post(`/api/v1/authentication/login`, {
					email: email,
					password: password,
				});

				// update pinia state
				Cookies.set("accessToken", user.responseData.accessToken);
				this.user = user.responseData;
				this.accessToken = user.responseData.accessToken;

				// store user details and jwt in local storage to keep user logged in between page refreshes
				localStorage.setItem("user", JSON.stringify(user.responseData));

				// redirect to previous url or default to home page
				router.push(this.returnUrl || "/");
			} catch (error) {
				const alertStore = useAlertStore();
				alertStore.error(error.response.data.responseMessage);
			}
		},
		async logout() {
			try {
				this.user = null;
				Api.get(`/api/v1/authentication/logout`);
				localStorage.removeItem("user");
				router.push("/account/login");
			} catch (error) {
				alert(error.message);
			}
		},
	},
});
