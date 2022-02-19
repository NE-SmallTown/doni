import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import HeadUnit from './HeadUnit';
import { useModel } from './Context';
import { useColumnStickStyle } from './hooks';
import { DoniTableColumn, ScrollProp } from './types';

import './HeadCell.scss'

interface HeadCellProps<RecordType> {
    column: DoniTableColumn<RecordType>;
    rowKey: string;
    index: number;
    scroll?: ScrollProp;
}

const HeadCell = observer(function HeadCell<RecordType>(props: HeadCellProps<RecordType>) {
    const { column, index, scroll } = props;
    let childElement = column.title;
    const isHeaderTopFixed = Boolean(scroll?.y);

    const { doniTableAction } = useModel();

    const paramsRef = useRef({
        index,
        tableAction: doniTableAction,
    });

    const style = useColumnStickStyle(column.fixed, index);

    if (typeof column.title === 'function') {
        childElement = column.title(paramsRef.current) as any;
    }

    const className = classNames(['doni-table-th'], {
        'doni-table-th-top-fixed': isHeaderTopFixed,
    });

    if (typeof childElement === 'object') {
        // @ts-ignore
        const type = childElement.type;

        if (type !== HeadUnit) {
            throw Error(`The column.render returns must be wrapped by a HeadCell component, but now get: ${ type.toString() || type.$$typeof.toString() }`);
        }

        return (
            <th className={ className } style={ style }>
                { childElement }
            </th>
        );
    }

    return (
        <th className={ className } style={ style }>
            <HeadUnit>
                { childElement }
            </HeadUnit>
        </th>
    );
});

export default HeadCell;