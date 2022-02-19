import React, { useState, useCallback, PropsWithChildren } from 'react';
import {
    CopyOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import { CopyToClipboard as Copy } from 'react-copy-to-clipboard';

type CopyToClipboardProps = PropsWithChildren<{
    text: string,
    resetDelay?: number, // copy 后过多少 ms 后重置状态
    [key: string]: any;
}>

const CopyToClipboard = ({ text, resetDelay = 2000, ...restProps }: CopyToClipboardProps) => {
    const [ hasCopy, setHasCopy ] = useState(false);

    const handleOnCopy = useCallback(() => {
        setHasCopy(true);

        setTimeout(() => {
            setHasCopy(false);
        }, resetDelay);
    }, []);

    return (
        <Copy text={ text } onCopy={ handleOnCopy } { ...restProps }>
            {
                hasCopy
                    ? <CheckOutlined style={{ color: '#52c41a' }} />
                    : <CopyOutlined style={{ color: '#1890ff' }} />
            }
        </Copy>
    );
};

export default CopyToClipboard;
