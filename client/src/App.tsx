import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/home/HomePage";

import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";

import SignUpPage from "./pages/auth/SignupPage";

import { useQuery } from "@tanstack/react-query";
import Layout from "./layout/Layout";

const App = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	return (
		<main>
			<Layout>
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
					<Route path='*' element={<Navigate to='/' />} />
				</Routes>
			</Layout>
			<Toaster
				toastOptions={{
					className:
						"border px-[6px] py-[4px] text-sm rounded-md bg-[#F8F9F9] text-black",

					success: {
						iconTheme: {
							primary: "#27AE60",
							secondary: "#F2F3F4",
						},
					},

					error: {
						iconTheme: {
							primary: "#C0392B",
							secondary: "#F2F3F4",
						},
					},
				}}
			/>
		</main>
	);
};

export default App;
