"use client"
import { createContext, useContext, useState } from 'react';

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
    const [coin, setCoin] = useState('base');

    const updateCoin = (coinData) => {
        setCoin(coinData);
    };

    return (
        <CoinContext.Provider value={{ coin, updateCoin }}>
            {children}
        </CoinContext.Provider>
    );
};

export const useCoin = () => {
    return useContext(CoinContext);
};
