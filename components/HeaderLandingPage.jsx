// components/Header.js
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi'
import { useDisconnect } from 'wagmi'
import { useConnect } from 'wagmi'
import { FaGithub, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from 'next/image'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedChain, setSelectedChain] = useState('base');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const { disconnect } = useDisconnect()
    const { connect } = useConnect()
    const [loading, setLoading] = useState(true);
    const account = useAccount()

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


    return (
        <header className="bg-white border-b border-gray-300 p-4">
            <div className="flex justify-between md:justify-start items-center">

                {/* logo */}

                <div className='w-full md:w-[60%]'>
                    <Link className='font-black text-2xl' href="/landing-page">
                        <Image className='rounded-md object-cover' src="/new-navbar-logo.svg" alt="logo" width={80} height={80} />
                    </Link>
                </div>


                {/* social media icons and profile dropdown */}
                <div className="flex items-center gap-5 justify-end space-x-2 md:w-[30%]">
                    <ul className="flex gap-4">
                        <li className="mr-2">
                            <Link href="https://x.com/basedagents" target="_blank" rel="noopener noreferrer">
                                <FaXTwitter className=' text-blackCustom hover:text-brownCustom' size={30} />
                            </Link>
                        </li>
                        <li className="mr-2">
                            <Link href="https://discord.com/" target="_blank" rel="noopener noreferrer">
                                <FaDiscord className=' text-blackCustom hover:text-brownCustom' size={30} />
                            </Link>
                        </li>
                        {/* <li className="mr-2">
                            <Link href="https://github.com/" >
                                <FaGithub className=' text-blackCustom hover:text-brownCustom' size={30} />
                            </Link>
                        </li> */}
                    </ul>
                </div>

                <div className='md:ml-3'>
                    <w3m-button />
                </div>
            </div>
        </header>
    );
};

export default Header;
