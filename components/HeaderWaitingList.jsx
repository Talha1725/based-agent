// components/Header.js
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import UserSettingsMenu from './UserSettingsMenu';
import { Menu, X, LoaderCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ThemeToggle from './ThemeToggle';
import { signOut } from 'next-auth/react'; // Import signOut from NextAuth
import { useAccount } from 'wagmi'
import { useDisconnect } from 'wagmi'
import { useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { FaGithub, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { config } from './config'

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [selectedChain, setSelectedChain] = useState('base');
	const [isWalletConnected, setIsWalletConnected] = useState(false);
	const { disconnect } = useDisconnect()
	const { connect } = useConnect()
	const [loading, setLoading] = useState(true);
	const account = useAccount()
	const pathname = usePathname()

	// extract the current page from the pathname
	const currentPage = pathname.split('/').pop()


	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const handleConnectWallet = () => {
		if (!account.isConnected && !account.isConnecting) {
			connect({ connector: injected() })
		}
		setIsWalletConnected(true);
	};

	const handleDisconnectWallet = async () => {
		// disconnect wallet using the hook
		setLoading(true);
		console.log('Disconnecting wallet...')
		disconnect(config)
		console.log('Wallet disconnected');
		setLoading(false);
		setIsWalletConnected(false);
	};

	// connect wallet on page load
	useEffect(() => {
		if (account.status !== 'connected') {
			if (account.isReconnecting) {
				setLoading(true);
				console.log('Reconnecting to wallet...');
				console.log("account", account)
				// connect({ connector: injected() })
			} else if (account.isConnected) {
				setIsWalletConnected(true);
				console.log('Wallet connected')
				console.log("account", account)
				setLoading(false);
			} else {
				setIsWalletConnected(false);
				setLoading(false);
			}
		}
	}, [account.isReconnecting, account.isConnected, connect, account.status]);

	const handleLogout = async () => {
		setLoading(true);
		try {

			await handleDisconnectWallet();
			// Now proceed to sign out after disconnecting the wallet
			await signOut();

			console.log('User signed out');
		} catch (error) {
			console.error('Error during logout process:', error);
		} finally {
			setLoading(false);
		}
	};


	const NavLink = ({ href, children, active }) => (
		<Link href={href}
			className={`${active ? 'text-brownCustom font-black' : 'text-blackCustom'} hover:text-brownCustom  px-3 py-2  text-sm  `}
			onClick={() => setIsMenuOpen(false)}>
			{children}
		</Link>
	);

	const ExternalLink = ({ href, children }) => (
		<a href={href} target="_blank" rel="noopener noreferrer"
			className="text-gray-800  px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 "
			onClick={() => setIsMenuOpen(false)}>
			{children}
		</a>
	);

	const ChainLogo = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{(selectedChain === 'base' || selectedChain === 'solana') && (
					<img
						src={
							selectedChain === 'base'
								? '/base-logo.svg'
								: '/solana-logo.svg'
						}
						alt={`${selectedChain} logo`}
						className="w-6 h-6 cursor-pointer"
					/>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-40 bg-white text-gray-800 border-gray-200 ">
				<DropdownMenuItem onClick={() => setSelectedChain('base')} className="focus:bg-gray-100">
					<img src="/base-logo.svg" alt="Base logo" className="w-4 h-4 mr-2" />
					Base
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setSelectedChain('solana')}
					className="focus:bg-gray-100">
					<img src="/solana-logo.svg" alt="Solana logo" className="w-4 h-4 mr-2" />
					Solana
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<header className="bg-white border-b border-gray-200  p-4">
			<div className="flex items-center">

				{/* logo */}

				<div className='w-[15%]'>
					<Link className='font-black text-2xl' href="/landing-page">
						<Image className='rounded-md object-cover' src="/new-navbar-logo.svg" alt="logo" width={80} height={80} />
					</Link>
				</div>

				{/* nav links */}

				<div className="flex justify-center items-center w-[70%]">
					<button className="lg:hidden text-gray-800" onClick={toggleMenu}>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
					<nav
						className={`lg:flex items-center ${isMenuOpen ? 'flex flex-col absolute top-16 left-0 right-0 bg-white p-4 space-y-2 z-50' : 'hidden lg:flex'}`}>
						<div
							className={`flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 ${isMenuOpen ? 'items-start w-full' : ''}`}>
							<NavLink active={currentPage === "welcome-referral"}
								href="/waiting-list/welcome-referral">Referral </NavLink>
							<NavLink active={currentPage === "leaderboard"} href="/waiting-list/leaderboard">Waiting List</NavLink>
							{/* <NavLink active={currentPage === "preferences"} href="/waiting-list/preferences">Preferences </NavLink> */}
							{/* <NavLink href="/waiting-list//preferences">Preferences</NavLink> */}

						</div>
					</nav>
				</div>

				{/* social media icons and profile dropdown */}
				<div className="flex items-center justify-end gap-5 space-x-2 w-[15%]">
					<ul className="hidden md:flex gap-4">
						<li className="mr-2">
							<Link href="https://x.com/basedagents" target="_blank" rel="noopener noreferrer">
								<FaXTwitter className=' text-blackCustom hover:text-brownCustom' size={30} />
							</Link>
						</li>
						<li className="mr-2">
							<Link href="https://discord.gg/m2Qud5GDqp" target="_blank" rel="noopener noreferrer">
								<FaDiscord className=' text-blackCustom hover:text-brownCustom' size={30} />
							</Link>
						</li>
						{/* <li className="mr-2">
							<Link href="https://github.com/">
								<FaGithub className=' text-blackCustom hover:text-brownCustom' size={30} />
							</Link>
						</li> */}
					</ul>
					{/* <div className="hidden lg:block">
						<ChainLogo />
					</div> */}
					{

					}
					{false ? <div className='animate-spin'><LoaderCircle className='text-black' /></div> : true ? (
						<UserSettingsMenu handleLogout={handleLogout} isWaitingList={true} account={account}
							onDisconnect={handleDisconnectWallet} />
					) : (
						<w3m-button />
					)}


					{/* <ThemeToggle /> */}
				</div>
			</div>
		</header>
	);
};

export default Header;
