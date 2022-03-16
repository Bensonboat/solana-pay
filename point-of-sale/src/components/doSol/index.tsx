import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { usePayment } from '../../hooks/usePayment';
import style from './index.module.pcss';
import BigNumber from 'bignumber.js';

export const DoSolComponents: FC = () => {
    const amount: BigNumber = new BigNumber(5);
    const [selectToken, setSelectToken] = useState<string>('');
    const [supplyAmount, setSupplyTokenAmount] = useState<number>(1);
    const [borrowAmount, setBorrowAmount] = useState<number | null>(amount.toNumber());
    const [pricesList, setPricesList] = useState<Array<any>>([]);
    // const { amount } = usePayment();

    useEffect(() => {
        setSelectToken('sol');
    }, []);

    useEffect(() => {}, [selectToken, supplyAmount, borrowAmount]);

    useEffect(() => {
        const getPricesList = async () => {
            let res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
            setPricesList(() => res.data);
        };

        getPricesList();
        setInterval(() => {
            getPricesList();
        }, 3000);
    }, []);

    const updateBorrowAmount = (value: number) => {
        let n: number;
        if (value <= amount.toNumber()) {
            n = amount.toNumber();
        } else if (
            value >=
            supplyAmount *
                pricesList.find((t) => t.symbol === selectToken).current_price *
                supportedToken[selectToken].LoanToValueRatio
        ) {
            n =
                supplyAmount *
                pricesList.find((t) => t.symbol === selectToken).current_price *
                supportedToken[selectToken].LoanToValueRatio;
        } else {
            n = value;
        }

        setBorrowAmount(() => n);
    };

    const updateSupplyAmount = (value: number) => {
        if (value < supplyAmount) {
            setBorrowAmount(amount.toNumber());
        }
        setSupplyTokenAmount(value);
    };

    const supportedToken: any = {
        btc: {
            LoanToValueRatio: 0.75,
            LiquidationThreshold: 0.85,
        },
        eth: {
            LoanToValueRatio: 0.75,
            LiquidationThreshold: 0.85,
        },
        usdt: {
            LoanToValueRatio: 0.75,
            LiquidationThreshold: 0.85,
        },
        sol: {
            LoanToValueRatio: 0.75,
            LiquidationThreshold: 0.85,
        },
        ftt: {
            LoanToValueRatio: 0.65,
            LiquidationThreshold: 0.75,
        },
    };

    return (
        <div className={style.doSolComponent}>
            <h1>
                Total <span style={{ color: 'red' }}>{amount?.toNumber()}</span> USDC
            </h1>
            <h3 style={{ marginTop: '5rem' }}>Pay by</h3>
            <div className={style.selectTokenList}>
                <select
                    className={style.select}
                    value={selectToken}
                    onChange={(event) => setSelectToken(event.target.value)}
                >
                    <option value="btc">BTC (Sollet)</option>
                    <option value="eth">soETH (Sollet)</option>
                    <option value="usdt">USDT</option>
                    <option value="sol">SOL</option>
                    <option value="ftt">FTT (Wormhole)</option>
                </select>
            </div>

            {pricesList.length !== 0 && selectToken !== '' ? (
                <>
                    <div style={{ fontSize: '12px', margin: '1rem 0 3rem 0', fontWeight: '600' }}>
                        <div>Current Price: {pricesList.find((t) => t.symbol === selectToken).current_price}</div>
                        <div>Loan to value ratio: {supportedToken[selectToken].LoanToValueRatio * 100}%</div>
                        <div>Liquidation threshold: {supportedToken[selectToken].LiquidationThreshold}%</div>
                    </div>
                    <div>Supply Amount:</div>
                    <select
                        className={style.select}
                        value={supplyAmount}
                        onChange={(event) => updateSupplyAmount(parseInt(event.target.value))}
                    >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                    <h4 style={{ marginTop: '2rem' }}>Borrow USDC:</h4>
                    <input
                        type="number"
                        value={borrowAmount!}
                        onChange={(event) => updateBorrowAmount(parseInt(event.target.value))}
                    />
                    ( Could borrow from {amount?.toNumber()} to{' '}
                    {supplyAmount *
                        pricesList.find((t) => t.symbol === selectToken).current_price *
                        supportedToken[selectToken].LoanToValueRatio}
                    )
                    <h6>
                        Will be Liquidate when {selectToken} price down to{' '}
                        {(borrowAmount! * 1) / supportedToken[selectToken].LiquidationThreshold / supplyAmount}
                    </h6>
                </>
            ) : null}
        </div>
    );
};
