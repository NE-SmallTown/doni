import React, { useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useModel } from './Context';
import BodyUnit from './BodyUnit';
import { useColumnStickStyle } from './hooks';
import { DoniTableColumn, NoopFunc } from './types';

import './BodyCell.scss'

interface BodyCellProps<RecordType> {
    record: RecordType;
    rowKey: string;
    column: DoniTableColumn<RecordType>;
    index: number;
}

const noop: NoopFunc = () => {};

const useForceUpdate = () => {
    const [ _, set ] = useState({});

    const forceUpdate = useCallback(() => {
        set({});
    }, []);

    return forceUpdate;
};

const MODAL_LIMIT_AMOUNT = 5; // 默认最多提供 5 个 modal 对象

const BodyCell = observer(function BodyCell<RecordType>(props: BodyCellProps<RecordType>) {
    const { record, column, index, rowKey } = props;

    const doniTableModel = useModel();

    const forceUpdate = useForceUpdate();

    const paramsRef = useRef({
        index,
        action: {
            setRecord: noop,
        },
        tableAction: doniTableModel.doniTableAction,
        modals: Array.from({ length: MODAL_LIMIT_AMOUNT }).map(() => ({
            visible: false,
            openModal: noop,
            closeModal: noop,
            toggleModal: noop,
        })),
    });

    useEffect(() => {
        paramsRef.current.modals.forEach(modal => {
            const setVisible = (visible: boolean) => {
                modal.visible = visible;

                forceUpdate();
            };

            modal.openModal = () => {
                setVisible(true);
            };

            modal.closeModal = () => {
                setVisible(false);
            };

            modal.toggleModal = () => {
                setVisible(!modal.visible);
            };
        });

        // 由于 record 的引用对应固定的某一行是永远不会变的，而 recordId 是会改变的
        // 所以可以通过下面的方式在不 re-render 组件的情况下动态的获取到最新的 recordId
        paramsRef.current.action.setRecord = (setFunc) => {
            const recordId = (record as any)[rowKey];

            doniTableModel.doniTableAction.setRowValue(recordId, setFunc);
        };
    }, []);

    const style = useColumnStickStyle(column.fixed, index);

    // console.log(`Doni Cell(${typeof column.title === 'function' ? column.title.name : column.title}) render`);
    console.log(`Doni Cell render`);

    const childElement = column.render(record, paramsRef.current);

    if (typeof childElement === 'object') {
        // @ts-ignore
        const type = childElement.type;

        if (type !== BodyUnit) {
            throw Error(`The column.render returns must be wrapped by a BodyCell component, but now get: ${ type.toString() || type.$$typeof.toString() }`);
        }

        return (
            <td className='doni-table-td' style={ style }>
                { childElement }
            </td>
        );
    }

    return (
        <td className='doni-table-td' style={ style }>
            <BodyUnit>
                { childElement }
            </BodyUnit>
        </td>
    );
});

export default BodyCell;