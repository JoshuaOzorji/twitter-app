import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SignUpData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSignUp = () => {
	// const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }: SignUpData) => {
			try {
				const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, username, fullName, password }),
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
			toast.success("Account created successfully");
			// queryClient.invalidateQueries({ queryKey: ["..."] });
		},
	});
	return { signUp: mutate, isError, isPending, error };
};
