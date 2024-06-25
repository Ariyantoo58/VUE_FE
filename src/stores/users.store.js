import { defineStore } from "pinia";

import { fetchWrapper } from "@/helpers";
import { useAuthStore } from "@/stores";
import Api from "../service/api";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useUsersStore = defineStore({
	id: "users",
	state: () => ({
		users: {},
		user: {},
	}),
	actions: {
		async register(user) {
			await Api.post(`/api/v1/authentication/register`, user);
		},
		async getAll() {
			this.users = { loading: true };
			try {
				const users = await Api.get(`/api/v1/users`);
				this.users = users.responseData;
			} catch (error) {
				this.users = { error };
			}
		},
		async getById(id) {
			this.user = { loading: true };
			try {
				const user = await Api.get(`/api/v1/users/${id}`);
				console.log(user, "userrr");
				this.user = user.responseData;
			} catch (error) {
				this.user = { error };
			}
		},
		async update(id, params) {
			await Api.put(`/api/v1/users/${id}`, params);
			// update stored user if the logged in user updated their own record
			const authStore = useAuthStore();
			if (id === authStore.user.id) {
				// update local storage
				const user = { ...authStore.user, ...params };
				localStorage.setItem("user", JSON.stringify(user));

				// update auth user in pinia state
				authStore.user = user;
			}
		},
		async delete(id) {
			// add isDeleting prop to user being deleted

			await Api.delete(`api/v1/users/${id}`);

			// remove user from list after deleted
			this.users = this.users.filter((x) => x.id !== id);

			// auto logout if the logged in user deleted their own record
			const authStore = useAuthStore();
			if (id === authStore.user.userId) {
				authStore.logout();
			}
		},
	},
});
