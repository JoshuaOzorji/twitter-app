import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFollow = () => {
	const queryClient = useQueryClient();

	const { mutate: follow, isPending } = useMutation({
		mutationFn: async (userId: string) => {
			try {
				const response = await fetch(
					`${API_BASE_URL}/api/users/follow/${userId}`,
					{ method: "POST", credentials: "include" },
				);

				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, isPending };
};
