import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';

import './Ellipsis.scss';

type EllipsisProps = PropsWithChildren<{
    className?: string;
    maxLine?: number;
    [key: string]: any;
}>

const Ellipsis = ({ maxLine = 1, className, children, ...restProps }: EllipsisProps) => {

    return (
        <div
            className={classNames(
                [
                    'doni-table-ellipsis',
                    className,
                ],
            )}
            { ...restProps }
        >
            { children }
        </div>
    );
};

export default Ellipsis;
