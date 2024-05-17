import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";

const App = () => {
	return (
		<div className='flex max-w-6xl mx-auto'>
			<Routes>
				<Route path='/' element={<HomePage />}></Route>
				<Route path='/login' element={<LoginPage />}></Route>
				<Route path='/signup' element={<SignupPage />}></Route>
			</Routes>
		</div>
	);
};

export default App;
