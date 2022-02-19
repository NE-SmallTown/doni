import React from 'react';
import { observer } from 'mobx-react-lite';
import HeadCell from './HeadCell';
import { DoniTableColumn, ScrollProp } from './types';

import './HeadItem.scss';

interface HeadItemProps<RecordType> {
    column: DoniTableColumn<RecordType>;
    rowKey: string;
    index: number;
    scroll?: ScrollProp;
}

const HeadItem = observer(function HeadItem<RecordType>(props: HeadItemProps<RecordType>) {
    const { column, index, rowKey, scroll } = props;

    // console.log('HeadItem render')

    return (
        <HeadCell
            key={ index }
            index={ index }
            column={ column }
            rowKey={ rowKey }
            scroll={ scroll }
        />
    );
});

export default HeadItem;