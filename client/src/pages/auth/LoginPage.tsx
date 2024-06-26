import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import XSvg from "../../components/svgs/X";
import { useAuthUser, useLogin } from "../../hooks/AuthApi";

const LoginPage = () => {
	const { authUser } = useAuthUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (authUser) {
			navigate("/");
		}
	}, [authUser, navigate]);

	const { loginMutation, isPending, isError, error } = useLogin();

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-3xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white w-ful'>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && error && (
						<p className='text-sm text-center text-red-500'>{error.message}</p>
					)}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-base'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>
							Sign up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
