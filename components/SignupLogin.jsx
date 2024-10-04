import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Github} from 'lucide-react';
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

const SignupLogin = ({onAuthSuccess}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const router = useRouter();
	
	const handleEmailChange = (e) => setEmail(e.target.value);
	const handlePasswordChange = (e) => setPassword(e.target.value);
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await signIn('credentials', {
			redirect: false,
			email,
			password,
		});
		
		if (res.error) {
			setError(res.error);
		} else {
			// Redirect to the dashboard or another page on successful login
			// router.push('/');
			onAuthSuccess();
			
		}
	};
	
	const handleSocialLogin = async (provider) => {
		// Initiate sign-in with GitHub provider
		const res = await signIn(provider);
		
		if (res.error) {
			setError('Failed to sign in with GitHub');
		} else {
			
			
			onAuthSuccess();
			router.push('/');
			
		}
	};
	
	return (
		<div className="bg-white p-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-800">Sign Up / Login</h2>
			</div>
			
			<div className="space-y-4 mt-6">
				<Button
					className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
					onClick={() => handleSocialLogin('github')} // Use GitHub provider
				>
					<Github className="mr-2 h-4 w-4"/> Continue with GitHub
				</Button>
			</div>
			
			<div className="my-4 flex items-center">
				<hr className="flex-grow border-gray-300"/>
				<span className="px-3 text-gray-500">or</span>
				<hr className="flex-grow border-gray-300"/>
			</div>
			
			<form onSubmit={handleSubmit} className="space-y-4">
				{error && <p className="text-red-600">{error}</p>}
				
				<div>
					<Label htmlFor="email" className="text-gray-800">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={handleEmailChange}
						className="bg-gray-50 text-gray-800 border border-gray-300"
					/>
				</div>
				<div>
					<Label htmlFor="password" className="text-gray-800">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={handlePasswordChange}
						className="bg-gray-50 text-gray-800 border border-gray-300"
					/>
				</div>
				<Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
					Sign In
				</Button>
			</form>
		</div>
	);
};

export default SignupLogin;
