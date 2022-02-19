import React, { ForwardedRef, ReactNode } from 'react';

export declare type FixedType = 'left' | 'right' | boolean;
export declare type CellEllipsisType = {
    showTooltip?: boolean;
} | boolean;
export declare type AlignType = 'left' | 'center' | 'right';
declare type Component<P> = React.ComponentType<P> | React.ForwardRefExoticComponent<P> | React.FC<P> | keyof React.ReactHTML;

export const DoniTableActionMobxType = {
    setRowValue: (rowId: string, fieldKey: string | ISetRowValueFunc, fieldValue?: any) => {},
    filterRow: <RecordType>(isNeedFilter: (record: RecordType, index: number) => boolean, options?: { onlyCurrentPage?: boolean }) => {},
    getTableData: () => {},
};

export type IListMode = 'scroll' | 'pagination';

export interface IRootModelFields {
    listMode: IListMode;
    displayList: any[];
    list: any[];
    currentPage: number;
    pageSize: number;
    headSizes: IHeadSize[];
    doniTableAction: IDoniTableAction;
}

export interface IHeadSize {
    width: number;
}

export interface IRootModelActions {
    initList: (dataSource: IListItem[], pageSize?: number) => void;
    setRowValueByFunc: (rowId: string, func: ISetRowValueFunc) => void;
    filterRow: (isNeedFilter: (record: any, index: number) => boolean, options?: { onlyCurrentPage?: boolean }) => IListItem[],
    getListSnapshot: () => IListItem[];
    setHeadSizes: (headSizes: IHeadSize[]) => void;
    setCurrentPage: (page: number, pageSize: number) => void;
}

export interface IRootModel extends IRootModelFields, IRootModelActions {}

export interface IListItem  {
    [key: string]: any;
}

interface DoniTableColumnSharedType<RecordType> {
    title: string | number | null | undefined | ((
        params: {
            // 通用字段
            index: number;

            // action 相关字段
            tableAction: IDoniTableAction;
        },
    ) => React.ReactNode);
    className?: string;
    shrink?: boolean; // 当表格宽度超出行宽度时，该列（的宽）是否参与压缩
    grow?: boolean; // 当表格宽度小于行宽度时，该列（的宽）是否参与膨胀
    // ellipsis?: CellEllipsisType; // 通过使用 Ellipsis 来实现
    // copyable?: boolean; // 通过使用 CopyToClipboard 来实现
    // align?: AlignType; // 通过给 BodyUnit 传的 className 设置 text-align: xxx 来实现
    // filters: any; // 通过使用 FilterDropdown（传给 column.title）来实现
    fixed?: FixedType;

    // TODO 以下待实现
    // 排序（sorter）
    // 合并行/合并列
    // 行内可编辑
}

// 针对表单开发 DoniForm 组件，需要解决的问题：
// 1. 表单联动：  <Select disable={ ... } />，这里 disable 的值，如果取决于另一个表单的值，就很麻烦。（antd 里面需要用 getFieldValue 配合 shouldUpdate。或者用 dependencies）
//              如果在使用 Select 的组件里面去获取然后传给 Select，那么使用 Select 的那个组件也会跟着更新，也就是 Select 的兄弟节点也会更新，没必要
//              所以，这里应该支持表单组件的很多 prop 可以直接传一个函数，这个函数的第一个参数为 formData，然后每个表单组件默认会被套一个 observer 的 HOC
//              然后在表单组件（如 Select）的内部（function 的 body）里直接调用这个函数，这样就相当于触发了依赖收集，这样如果这里用到的某个 formData.xx 在别的
//              表单组件那里被更新了的，这里的表单组件也会被更新，完美！否则需要像下面这么写，太麻烦了
//      <Form.Item
//         name="confirm"
//         label="Confirm Password"
//         dependencies={['password']}
//         rules={[
//           ({ getFieldValue }) => ({
//             validator(_, value) {
//               if (!value || getFieldValue('password') === value) {
//                 return Promise.resolve();
//               }
//               return Promise.reject(new Error('The two passwords that you entered do not match!'));
//             },
//           }),
//         ]}
//       >
//         <Input.Password />
//       </Form.Item>
//
//                 <Form.Item
//                     noStyle
//                     shouldUpdate={(prevValues, curValues) =>
//                       prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
//                     }
//                   >
//                   {() => (
//                     <Form.Item
//                       {...field}
//                       label="Sight"
//                       name={[field.name, 'sight']}
//                       rules={[{ required: true, message: 'Missing sight' }]}
//                     >
//                       <Select disabled={!form.getFieldValue('area')} style={{ width: 130 }}>
//                         {(sights[form.getFieldValue('area')] || []).map(item => (
//                           <Option key={item} value={item}>
//                             {item}
//                           </Option>
//                         ))}
//                       </Select>
//                     </Form.Item>
//                   )}
//                 </Form.Item>
// 2. 表单的精准更新
// 3. 表单的方便获取数据
// 4. TODO 支持 formater（将 value 值传给表单组件之前的转换函数）和 outputer（将表单组件内部的值传给回调如 onFinsh 或者 getFieldValue 之前的转换函数）
// 5. 支持类似 antd 的 Form.List 的形式，即，删除/添加表单中的某一行（提供 action.addForm 和 action.deleteForm 方法）
// 6. 支持 Form.Item 默认使用 Form 里面的某个 prop（如果有），如 disabled 属性
// 7. 表单 value 值的联动（一个表单项的 value 值依赖另一个表单项）（不能传 value 为一个函数了，因为 antd 会过滤，不过滤也不行。。那样就有两个数据源了）

// TODO 将 doniTable 里面用的的所有 antd 的表单组件（Input，Select，Menu 等等）都换成 DoniForm 对应的组件

export type NoopFunc = (...args: any[]) => any;

export interface ITableModal {
    visible: boolean;
    closeModal: () => void;
    openModal: () => void;
    toggleModal: () => void;
}

export interface DoniTableColumn<RecordType> extends DoniTableColumnSharedType<RecordType> {
    width: number | string;

    render: (
        record: RecordType,
        // TODO 这里 params 根据传的 column 里的 type 的不同，params 对象里的字段也会不同
        params: {
            // 通用字段
            index: number;

            // modal 相关字段
            modals: ITableModal[];
            
            // action 相关字段
            action: IDoniTableRecordAction,
            tableAction: IDoniTableAction;
        },
    ) => React.ReactNode;
}

export type ISetRowValueFunc = (rowModel: any) => void;

export interface DoniTableToolbarProps {
    actions?: React.ReactNode[];
}

export type CustomizeComponent = Component<any>;

export interface DoniTableComponentsProps<RecordType> {
    table?: CustomizeComponent;
    header?: {
        wrapper?: CustomizeComponent;
        row?: CustomizeComponent;
        cell?: CustomizeComponent;
    };
    body?: {
        wrapper?: CustomizeComponent;
        row?: CustomizeComponent;
        cell?: CustomizeComponent;
    };
}

export interface DoniTableExpandableProps<RecordType> {
    expandedRowRender?: (record: RecordType, index: number, indent: number, expanded: boolean) => React.ReactNode;
}

export type DoniTablePaginationProps = {
    onChange?: (page: number, pageSize: number) => void;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
    defaultCurrent?: number;
    defaultPageSize?: number;
} | false;

export interface ScrollProp {
    x?: number | string;
    y?: number | string;
}

export interface DoniTableProps<RecordType> {
    tableId?: string;
    initData: RecordType[],
    rowKey?: string;
    columns: DoniTableColumn<RecordType>[];
    actionRef?: ForwardedRef<IDoniTableAction>;
    scroll?: ScrollProp;
    loading?: boolean;
    className?: string;
    pagination?: DoniTablePaginationProps;

    // TODO 以下待实现
    toolbar?: DoniTableToolbarProps;
    expandable?: DoniTableExpandableProps<RecordType>; // 展开的 table
    components?: DoniTableComponentsProps<RecordType>;
}

export interface IDoniTableAction {
    setRowValue: (rowId: string, fieldKey: string | ISetRowValueFunc, fieldValue?: any) => void;
    filterRow: <RecordType>(isNeedFilter: (record: RecordType, index: number) => boolean) => IListItem[],
    getTableData: () => IListItem[];
}

export interface IDoniTableRecordAction {
    setRecord: (setFunc: ISetRowValueFunc) => void;
}
