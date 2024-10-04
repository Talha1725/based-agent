'use client'

import React, { ReactNode } from 'react'
import { config, projectId, metadata } from '@/config/wagmiConfig'

import { createWeb3Modal } from '@web3modal/wagmi/react'


import { State, WagmiProvider } from 'wagmi'

// Setup queryClient

if (!projectId) throw new Error('Project ID is not defined')

// Create modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeVariables: {
    '--w3m-border-radius-master': "0px",
    "--w3m-font-family": "Monorama, sans-serif",

  },
  themeMode: 'light',
})

export default function AppKitProvider({
  children,
  initialState
}: {
  children: ReactNode
  initialState?: State
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      {children}
    </WagmiProvider>
  )
}