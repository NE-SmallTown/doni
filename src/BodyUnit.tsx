import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import './BodyUnit.scss';

type BodyUnitProps = PropsWithChildren<{
    className?: string;
    [key: string]: any;
}>

const BodyUnit = observer(function BodyUnit({ maxLine = 1, className, children, ...restProps }: BodyUnitProps) {

    return (
        <div
            className={classNames(
                [
                    'doni-table-td-cell',
                    className,
                ],
            )}
            { ...restProps }
        >
            { children }
        </div>
    );
});

export default BodyUnit;
