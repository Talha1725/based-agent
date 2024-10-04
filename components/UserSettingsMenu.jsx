// components/UserSettingsMenu.js
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Link as LinkIcon, Wallet, Settings, Users, LogOut } from 'lucide-react';
import { useDisconnect } from 'wagmi'
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import { FaUser } from "react-icons/fa";

const UserSettingsMenu = ({ onDisconnect, account, isWaitingList, handleLogout }) => {
	const { disconnect } = useDisconnect()
	const { data: session } = useSession()

	let menuLinks = []

	if (!isWaitingList) {
		menuLinks = [
			{
				icon: User,
				href: "/profile",
				text: "View Profile"
			},
			{
				icon: Settings,
				href: "/preferences",
				text: "Preferences"
			},
			{
				icon: LinkIcon,
				href: "/integrations",
				text: "Integrations"
			},
			{
				icon: Wallet,
				href: "/wallets",
				text: "Wallets"
			},
			{
				icon: Users,
				href: "/referrals",
				text: "Referrals"
			}
		]
	}
	else {
		menuLinks = [
			{
				icon: Settings,
				href: "/waiting-list/preferences",
				text: "Preferences"
			},
		]
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className=" bg-brownCustom flex flex-col items-center justify-center rounded-full p-3 cursor-pointer">
					<span className='uppercase select-none font-black'>
						{session?.user?.email[0]}
					</span>
					{/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
					<AvatarFallback>BA</AvatarFallback> */}
					{/* <FaUser className='text-blackCustom' size={30} /> */}
				</Avatar>

			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 min-w-[300px] bg-white text-gray-800 border-gray-200">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						{/* <p className="text-sm font-medium leading-none">{session?.verification?.name}</p> */}
						<p className="text-xs leading-none text-gray-400">{session?.user?.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-gray-200" />
				{
					<DropdownMenuItem className="focus:bg-gray-100">
						{/* {account?.address} */}
						<w3m-button />
					</DropdownMenuItem>
				}

				{/* render menu links based on whether it is waiting list or not */}
				{menuLinks.map((link, index) => (
					<DropdownMenuItem key={index} className="focus:bg-gray-100 ">
						<link.icon className="mr-2 h-4 w-4" />
						<Link href={link.href} className="text-gray-800">{link.text}</Link>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator className="bg-gray-200 " />
				<DropdownMenuItem onClick={handleLogout} className="focus:bg-gray-100">
					<LogOut className="mr-2 h-4 w-4" />
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserSettingsMenu;
