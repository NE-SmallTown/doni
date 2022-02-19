import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import './HeadUnit.scss';

type HeadUnitProps = PropsWithChildren<{
    className?: string;
    [key: string]: any;
}>

const HeadUnit = observer(function HeadUnit({ maxLine = 1, className, children, ...restProps }: HeadUnitProps) {

    return (
        <div
            className={classNames(
                [
                    'doni-table-th-cell',
                    className,
                ],
            )}
            { ...restProps }
        >
            { children }
        </div>
    );
});

export default HeadUnit;
