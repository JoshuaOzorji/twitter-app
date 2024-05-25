import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import SignUpPage from "./pages/auth/SignupPage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
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

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}
	return (
		<div className='flex max-w-6xl mx-auto'>
			{authUser && <Sidebar />}
			<Routes>
				<Route
					path='/'
					element={authUser ? <HomePage /> : <Navigate to='/login' />}
				/>
				<Route
					path='/login'
					element={!authUser ? <LoginPage /> : <Navigate to='/' />}
				/>
				<Route
					path='/signup'
					element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
				/>
				<Route
					path='/notifications'
					element={authUser ? <NotificationPage /> : <Navigate to='/login' />}
				/>
				<Route
					path='/profile/:username'
					element={authUser ? <ProfilePage /> : <Navigate to='/login' />}
				/>
			</Routes>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
};

export default App;
