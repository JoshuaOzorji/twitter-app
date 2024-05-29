import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FormData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();

	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
		useMutation({
			mutationFn: async (formData: FormData) => {
				try {
					const response = await fetch(`${API_BASE_URL}/api/users/update`, {
						method: "POST",
						credentials: "include",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(formData),
					});
					const data = await response.json();

					if (!response.ok) {
						throw new Error(data.error || "Something went wrong");
					}
					return data;
				} catch (error) {
					console.error(error);
					throw error;
				}
			},

			onSuccess: () => {
				toast.success("Profile updated successfully");

				Promise.all([
					queryClient.invalidateQueries({ queryKey: ["authUser"] }),
					queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
				]);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	return { updateProfile, isUpdatingProfile };
};
