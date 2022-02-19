import React, {
    useRef,
    useEffect,
    useMemo,
} from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';
import { getSnapshot, IAnyModelType, types, cast } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import ColGroup from './ColGroup';
import HeadItem from './HeadItem';
import BodyItem from './BodyItem';
import DetectTableInfo from './DetectTableInfo';
import DoniTablePagination from './DoniTablePagination';
import { DoniTableRootStoreContext, useModel } from './Context';
import {
    DoniTableProps,
    IRootModelActions,
    DoniTableActionMobxType,
    IHeadSize,
} from './types';

import './Table.scss';

// Q: recordMobxType 能否去掉？
// A: 很难，几乎做不到。recordMobxType 存在的原因是，无论 mobx 还是 mobx-state-tree，对于要被 observer 的数据都是要求「先定义，后使用」。
//    对于完全无法确定长什么样子的数据，是没有办法去 observe 的。
//    有两种可能的方案（假设传入的数据为 initDate = [{ name: 'hello', author: { name: 'bar' }}] ）：
//                  1. 将 record 定义为 types.map(XXX)，然后遍历 initDate，拿到第一层的 key，然后调用 map 的 set 方法设置进去
//                     但是这里的 XXX 是必须要填的，填什么呢？没有办法知道。所以这种方案走不通。
//
//                  2. 仍然定义一个 list: types.array(types.model(XXX))，这里的 XXX 可以通过 deep 遍历 initData 来手动构造一个 model 出来
//                     但是有一个问题，就是在面对数组的时候，没有办法保证数组里的每一个元素的数据结构都是一样的。
//                     比如 users: [ { name: '1', age: 40 }, { name: '2', car: 'none' } ]
//                     如果 users 里面的所有元素的数据结构是一样的（都只有 name 和 age 这两个字段）
//                     那么我们可以通过遍历得到 types 为 types.array(types.model({ name: types.string, age: types.number }))
//                     但实际上这是很难的，数组里的元素很容易会有多了一个字段或者少了一个字段的情况。（如上面的就多了 car 字段，少了 age 字段）
//                     所以只有先求出数组所有元素的字段的最大集合，然后将共有的设置为必须，将非共有的都设置为 types.maybe()，这样才不会报错
//                     types.array(types.model({ name: types.string, age: types.maybe(types.number), car: types.maybe(types.string) }))
//                     这似乎是理论上看起来还可行的方案。。。不过也太复杂了，还是算了 ：）
export const ExportDoniTable = function ExportDoniTable<RecordType> (props: DoniTableProps<RecordType> & { recordMobxType: IAnyModelType }) {
    const { recordMobxType } = props;

    const Component = useMemo(() => {
        const tableId = Math.random().toString(36).slice(2);

        const rowKey = props.rowKey || 'id';

        const TableComponent = createDoniTable<RecordType>(tableId, recordMobxType, rowKey);

        return TableComponent;
    }, []);

    return <Component { ...props } />
};

const NEED_FILTER = '__doniTableNeedFilter';

const getSafeMobxValue = (value: any) => typeof value === 'object' ? getSnapshot(value) : value;

const DoniTable = observer(function DoniTable<RecordType>(props: DoniTableProps<RecordType>) {
    const {
        initData,
        loading,
        className,
        scroll,
        tableId,
        rowKey,
        columns,
        actionRef,

        pagination,
        toolbar,
        expandable,
        components,
    } = props;

    const cacheScroll = useMemo(() => scroll, []);
    const cachePagination = useMemo(() => ({
        defaultPageSize: 10,
        ...pagination,
    }), []);

    const tableProps = {
        tableId,
        rowKey,
        columns,
        actionRef,
        scroll: cacheScroll,
        pagination: cachePagination,
    };

    const paginationProps = {
        pagination: cachePagination,
    };

    const initDataRef = useRef(initData);

    useEffect(() => {
        initDataRef.current = initData;

        if (!loading) {
            window.dispatchEvent(new CustomEvent(`doni_table_init_${tableId}`, { detail: initData }));
        }
    }, [ initData, loading ]);

    const { x: scrollX, y: scrollY } = props.scroll || {};
    const style: any = useMemo(() => {
        const style: any = { overflowX: 'hidden', overflowY: 'hidden' };

        if (scrollX) {
            style.overflowX = 'auto';
        }

        if (scrollY) {
            style.overflowY = 'auto';
            style.maxHeight = typeof scrollY === 'number' ? scrollY + 'px' : scrollY;
        }

        return style;
    }, [ scrollX, scrollY ]);

    // console.log('DoniTable render');

    return (
        <>
            <div
                style={ style }
                className={classNames(
                    [
                        'doni-table-wrap',
                        className,
                    ],
                )}
            >
                <DetectTableInfo<RecordType> columns={ props.columns } />

                {/* @ts-ignore */}
                <DoniTableInner<RecordType> { ...tableProps } />

                { loading && <Spin className='doni-table-loading-spin' /> }
            </div>

            { pagination !== false && <DoniTablePagination<RecordType> { ...paginationProps } /> }
        </>
    );
});

const createDoniTable = <RecordType,>(tableId: string, recordMobxType: IAnyModelType, rowKey: string) => {
    const getListModel = () => types.array(types.compose(
        recordMobxType,
        types.model({
            [NEED_FILTER]: types.optional(types.boolean, true),
        }),
    ));

    const DoniTableRootModel = types
        .model({
            // Q: 假设目前表格是分页的，一共有两页，第一页有一条数据，第二页有两条数据，每一页都只有两列。初始时，在第一页。
            //    目前的表格组件，都面临下面的问题。假设第一页的数据是 { c1: 'foo', c2: 'bar1' }，第二页的数据也是 { c1: 'foo', c2: 'bar2' }
            //    那么，当我们从第 1 页切换到第 2 页的时候，表格的第一行涉及到的组件会重新渲染，即，我们提供的 column.render 方法会被重新执行
            //    但是这实际并不是我们期望的。我们期望的是：
            //          1. c1 涉及的组件不会 re-render（column.render 不被执行，因为 c1 列的值并没有发生变化，仍然是 'foo'）
            //          2. c2 涉及的组件会 re-render（column.render 被执行，因为 c2 列的值发生了变化，从 'bar1' 变成了 'bar2'）
            //
            // 这个问题的根本原因在于，第 1 页切换到第 2 页的时候，第一行背后对应的数据**的引用**发生了变化。
            // 所以为了解决这个问题，Table 内置了两种不同模式的数据流方案：
            //
            // ******** 方案一：displayList + list 模式（针对有分页的 Table，对应 'pagination' 这种 listMode）***********
            // 界面上展示的表格的数据来源是 displayList，displayList 的长度始终等于一页表格的展示条数，且里面的数据**的引用始终不变**。
            // 而真实的数据为 list，当有数据需要更新的时候，先更新 list，然后**同步**给 displayList(不改变引用，只改变引用里的值）。
            //
            // ******** 方案二：单一 list 模式（针对没有分页的 Table，对应 'scroll' 这种 listMode）*********
            // 和常规的方案差不多，只是会有一个 NEED_FILTER 的 flag 来阻止组件被卸载。
            listMode: types.enumeration('ListMode', ['scroll', 'pagination']),
            displayList: getListModel(),
            list: getListModel(),

            currentPage: types.number,
            pageSize: types.number,

            headSizes: types.array(types.model({
                width: types.number,
            })),
        })
        .volatile(self => ({
            doniTableAction: DoniTableActionMobxType,
        }))
        .actions((self) => {
            const actions: IRootModelActions = {
                initList(dataSource, pageSize) {
                    // 先 deep clone 一下，以便表格里所有对表格数据的操作能够完全被 DoniTable 接管
                    const list = JSON.parse(JSON.stringify(dataSource));

                    self.listMode = typeof pageSize === 'undefined' ? 'scroll' : 'pagination';
                    self.list = list;

                    if (self.listMode === 'pagination') {
                        const displayList = JSON.parse(JSON.stringify(dataSource.slice(0, pageSize)));

                        self.displayList = displayList;
                    }

                    self.pageSize = pageSize || Infinity;
                    actions.setCurrentPage(1, self.pageSize);
                },

                setRowValueByFunc(rowId, func) {
                    const rowModel = self.list.find(item => item[rowKey] === rowId);

                    if (!rowModel) {
                        throw Error(`Can't find rowId('${rowId}') in the data you pass into table.`);
                    }

                    func(rowModel);

                    // 修改 list 后，同步给 displayList
                    if (self.listMode === 'pagination') {
                        const rowDisplayModel = self.displayList.find(item => item[rowKey] === rowId);

                        Object.keys(rowModel).forEach(key => {
                            const newValue = rowModel[key];
                            const displayValue = rowDisplayModel[key];

                            if (newValue !== displayValue) {
                                rowDisplayModel[key] = getSafeMobxValue(newValue);
                            }
                        });
                    }
                },

                // 从表格的所有 items 中选择出某些 item
                filterRow(isNeedFilter, options = {}) {
                    const { onlyCurrentPage = true } = options;

                    const newList: any[] = [];

                    self.list.forEach((record, index) => {
                        let needFilter;

                        // 如果只是对当前页的数据进行过滤，那么需要 check 一下 index 是否属于当前页
                        if (onlyCurrentPage) {
                            needFilter = (index >= self.pageSize * (self.currentPage - 1) && index < self.pageSize * self.currentPage) && isNeedFilter(record, index);
                        } else {
                            needFilter = isNeedFilter(record, index);
                        }

                        if (needFilter) {
                            record[NEED_FILTER] = true;

                            newList.push(record);
                        } else {
                            record[NEED_FILTER] = false;
                        }
                    });

                    const finalList: any[] = [];

                    // 修改 list 后，同步给 displayList
                    if (self.listMode === 'pagination') {
                        self.displayList.forEach((record, index) => {
                            if (index <= newList.length - 1) {
                                Object.keys(record).forEach(key => {
                                    const newValue = newList[index][key];

                                    record[key] = getSafeMobxValue(newValue);
                                });

                                record[NEED_FILTER] = true;

                                finalList.push(record);
                            } else {
                                record[NEED_FILTER] = false;
                            }
                        });
                    }

                    return finalList;
                },

                // TODO 更改页码后，还需要清除所有已经设置了的 filters 组件（如 FilterDropDown 和 sorter）
                setCurrentPage(page: number, pageSize: number) {
                    self.currentPage = page;
                    self.pageSize = pageSize;

                    actions.filterRow(
                        (_, index) => index >= pageSize * (page - 1) && index < pageSize * page,
                        { onlyCurrentPage: false },
                    );
                },

                setHeadSizes(headSizes: IHeadSize[]) {
                    self.headSizes = cast(headSizes);
                },

                getListSnapshot() {
                    return getSnapshot(self.list);
                },
            };

            self.doniTableAction = {
                // 修改某一行对应的数据
                // rowId 其实就是 item 的 id 字段对应的值
                setRowValue: (rowId, fieldKey, fieldValue) => {
                    if (typeof fieldKey === 'function') {
                        const func = fieldKey;

                        actions.setRowValueByFunc(rowId, func);
                    } else {
                        actions.setRowValueByFunc(rowId, rowModel => {
                            rowModel[fieldKey] = fieldValue;
                        });
                    }
                },

                filterRow: (isNeedFilterFunc) => actions.filterRow(isNeedFilterFunc),

                // 获取表格当前的数据
                getTableData: () => {
                    return actions.getListSnapshot();
                },
            };

            return actions as any;
        });

    const initialDoniTableRootStoreState = DoniTableRootModel.create({
        listMode: 'scroll',
        displayList: [],
        list: [],
        currentPage: 1,
        pageSize: Infinity,
        headSizes: [],
    });

    return function CreateDoniTable(props: DoniTableProps<RecordType>) {
        return (
            <DoniTableRootStoreContext.Provider value={ initialDoniTableRootStoreState }>
                <DoniTable<RecordType> { ...props } rowKey={ rowKey } tableId={ tableId } />
            </DoniTableRootStoreContext.Provider>
        )
    };
};

const DoniTableInner = observer(function DoniTableInner<RecordType>(
    props: DoniTableProps<RecordType> & { rowKey: string; }
) {
    const { columns, actionRef, scroll, rowKey, tableId, pagination } = props;

    const doniTableModel = useModel();

    useEffect(() => {
        const onInit = ({ detail }: any) => {
            doniTableModel.initList(detail, pagination ? (pagination as any).defaultPageSize : undefined);
        };

        window.addEventListener(`doni_table_init_${tableId}`, onInit);

        return () => {
            window.removeEventListener(`doni_table_init_${tableId}`, onInit);
        };
    }, []);

    useEffect(() => {
        if (actionRef) {
            if (typeof actionRef === 'object') {
                actionRef.current = doniTableModel.doniTableAction;
            } else if(typeof actionRef === 'function') {
                actionRef(doniTableModel.doniTableAction);
            }
        }
    }, []);

    const style: any = useMemo(() => {
        const style: any = {};

        if (scroll?.x) {
            style.width = scroll.x + 'px';
        }

        return style;
    }, [ scroll?.x ]);

    let list: any[];

    if (doniTableModel.listMode === 'pagination') {
        list = doniTableModel.displayList.filter(record => record[NEED_FILTER]);
    } else {
        list = doniTableModel.list.filter(record => record[NEED_FILTER]);
    }

    // console.log('DoniTableInner render');

    return (
        <table className='doni-table' style={ style }>
            <ColGroup columns={ columns } scroll={ scroll } />

            <thead>
                <tr>
                    {
                        columns.map((column, index) => (
                            <HeadItem<RecordType>
                                key={ index }
                                index={ index }
                                rowKey={ rowKey }
                                column={ column }
                                scroll={ scroll }
                            />
                        ))
                    }
                </tr>
            </thead>

            <tbody>
                {
                    list.map((record, index) => (
                        <BodyItem<RecordType>
                            /*
                                 *
                                 * TODO 在不会用到删除和插入操作的时候，用 index 作为 key，这样可以避免翻页的时候 key 不同导致所有表格被卸载再创建导致页面抖动
                                 *      在会用到删除和插入操作的时候，用 record[rowKey]（即 id）作为 key
                                 *      这样对于 React diff 友好，不会导致由于插入或者删除的那个节点的后面的节点都被不必要的 render
                                 *
                            */
                            key={ index }
                            index={ index }
                            rowKey={ rowKey }
                            record={ record }
                            columns={ columns }
                        />
                    ))
                }
            </tbody>
        </table>
    );
});
