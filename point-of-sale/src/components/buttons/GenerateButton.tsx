import React, { FC } from 'react';
import { usePayment } from '../../hooks/usePayment';
import * as css from './GenerateButton.module.pcss';
import { useNavigateWithQuery } from '../../hooks/useNavigateWithQuery';

export const GenerateButton: FC = () => {
    const { amount, generate } = usePayment();
    const navigate = useNavigateWithQuery();

    const doSolProcess = () => {
        navigate('/select');
    };

    return (
        // <button
        //     className={css.root}
        //     type="button"
        //     onClick={generate}
        //     disabled={!amount || amount.isLessThanOrEqualTo(0)}
        // >
        //     Generate Payment Code
        // </button>
        <button
            className={css.root}
            type="button"
            onClick={doSolProcess}
            disabled={!amount || amount.isLessThanOrEqualTo(0)}
        >
            Next step
        </button>
    );
};
