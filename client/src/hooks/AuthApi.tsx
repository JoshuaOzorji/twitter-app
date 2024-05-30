import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SignupType {
	email: string;
	username: string;
	fullName: string;
	password: string;
}

export const useSignUp = () => {
	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }: SignupType) => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, username, fullName, password }),
					credentials: "include",
				});

				const data = await response.json();
				if (!response.ok)
					throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Event has been created");
			// toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});
	return { signUp: mutate, isError, isPending, error };
};

interface LoginType {
	username: string;
	password: string;
}

export const useLogin = () => {
	const queryClient = useQueryClient();

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: async ({ username, password }: LoginType) => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ username, password }),
					credentials: "include",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Unable to login");
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Login successful");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});
	return { loginMutation: mutate, isPending, isError, error };
};

export const useAuthUser = () => {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
					credentials: "include",
				});
				const data = await response.json();
				console.log(data);
				if (data.error) return null;
				if (!response.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		retry: false,
	});

	return { authUser, isLoading };
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
					method: "POST",
					credentials: "include",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Unable to logout");
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});

	return { authUser: mutate };
};
