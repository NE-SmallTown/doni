/// <reference types="react" />
import { IAnyModelType } from "mobx-state-tree";
import React from "react";
import { ForwardedRef, PropsWithChildren, ReactNode, ReactElement } from "react";
type FixedType = "left" | "right" | boolean;
type CellEllipsisType = {
    showTooltip?: boolean;
} | boolean;
type AlignType = "left" | "center" | "right";
type Component<P> = React.ComponentType<P> | React.ForwardRefExoticComponent<P> | React.FC<P> | keyof React.ReactHTML;
declare const DoniTableActionMobxType: {
    setRowValue: (rowId: string, fieldKey: string | ISetRowValueFunc, fieldValue?: any) => void;
    filterRow: <RecordType>(isNeedFilter: (record: RecordType, index: number) => boolean, options?: {
        onlyCurrentPage?: boolean | undefined;
    } | undefined) => void;
    getTableData: () => void;
};
type IListMode = "scroll" | "pagination";
interface IRootModelFields {
    listMode: IListMode;
    displayList: any[];
    list: any[];
    currentPage: number;
    pageSize: number;
    headSizes: IHeadSize[];
    doniTableAction: IDoniTableAction;
}
interface IHeadSize {
    width: number;
}
interface IRootModelActions {
    initList: (dataSource: IListItem[], pageSize?: number) => void;
    setRowValueByFunc: (rowId: string, func: ISetRowValueFunc) => void;
    filterRow: (isNeedFilter: (record: any, index: number) => boolean, options?: {
        onlyCurrentPage?: boolean;
    }) => IListItem[];
    getListSnapshot: () => IListItem[];
    setHeadSizes: (headSizes: IHeadSize[]) => void;
    setCurrentPage: (page: number, pageSize: number) => void;
}
interface IRootModel extends IRootModelFields, IRootModelActions {
}
interface IListItem {
    [key: string]: any;
}
interface DoniTableColumnSharedType<RecordType> {
    title: string | number | null | undefined | ((params: {
        // 通用字段
        index: number;
        // action 相关字段
        tableAction: IDoniTableAction;
    }) => React.ReactNode);
    className?: string;
    shrink?: boolean; // 当表格宽度超出行宽度时，该列（的宽）是否参与压缩
    grow?: boolean; // 当表格宽度小于行宽度时，该列（的宽）是否参与膨胀
    // ellipsis?: CellEllipsisType; // 通过使用 Ellipsis 来实现
    // copyable?: boolean; // 通过使用 CopyToClipboard 来实现
    // align?: AlignType; // 通过给 BodyUnit 传的 className 设置 text-align: xxx 来实现
    // filters: any; // 通过使用 FilterDropdown（传给 column.title）来实现
    fixed?: FixedType;
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
type NoopFunc = (...args: any[]) => any;
interface ITableModal {
    visible: boolean;
    closeModal: () => void;
    openModal: () => void;
    toggleModal: () => void;
}
interface DoniTableColumn<RecordType> extends DoniTableColumnSharedType<RecordType> {
    width: number | string;
    render: (record: RecordType, 
    // TODO 这里 params 根据传的 column 里的 type 的不同，params 对象里的字段也会不同
    params: {
        // 通用字段
        index: number;
        // modal 相关字段
        modals: ITableModal[];
        // action 相关字段
        action: IDoniTableRecordAction;
        tableAction: IDoniTableAction;
    }) => React.ReactNode;
}
type ISetRowValueFunc = (rowModel: any) => void;
interface DoniTableToolbarProps {
    actions?: React.ReactNode[];
}
type CustomizeComponent = Component<any>;
interface DoniTableComponentsProps<RecordType> {
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
interface DoniTableExpandableProps<RecordType> {
    expandedRowRender?: (record: RecordType, index: number, indent: number, expanded: boolean) => React.ReactNode;
}
type DoniTablePaginationProps = {
    onChange?: (page: number, pageSize: number) => void;
    showTotal?: (total: number, range: [
        number,
        number
    ]) => React.ReactNode;
    defaultCurrent?: number;
    defaultPageSize?: number;
} | false;
interface ScrollProp {
    x?: number | string;
    y?: number | string;
}
interface DoniTableProps<RecordType> {
    tableId?: string;
    initData: RecordType[];
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
interface IDoniTableAction {
    setRowValue: (rowId: string, fieldKey: string | ISetRowValueFunc, fieldValue?: any) => void;
    filterRow: <RecordType>(isNeedFilter: (record: RecordType, index: number) => boolean) => IListItem[];
    getTableData: () => IListItem[];
}
interface IDoniTableRecordAction {
    setRecord: (setFunc: ISetRowValueFunc) => void;
}
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
declare const ExportDoniTable: <RecordType>(props: DoniTableProps<RecordType> & {
    recordMobxType: IAnyModelType;
}) => JSX.Element;
type CopyToClipboardProps = PropsWithChildren<{
    text: string;
    resetDelay?: number; // copy 后过多少 ms 后重置状态
    [key: string]: any;
}>;
declare const CopyToClipboard: ({ text, resetDelay, ...restProps }: CopyToClipboardProps) => JSX.Element;
type EllipsisProps = PropsWithChildren<{
    className?: string;
    maxLine?: number;
    [key: string]: any;
}>;
declare const Ellipsis: ({ maxLine, className, children, ...restProps }: EllipsisProps) => JSX.Element;
declare const HeadUnit: React.FunctionComponent<{
    [key: string]: any;
    className?: string | undefined;
}>;
declare const BodyUnit: React.FunctionComponent<{
    [key: string]: any;
    className?: string | undefined;
}>;
type FilterDropdownProps = PropsWithChildren<{
    className?: string;
    data: {
        text: ReactNode;
        value: string;
    }[];
    dropdownProps?: {};
    menuProps?: {
        multiple?: boolean;
        className?: string;
        [key: string]: any;
    };
    onFinish: (selectedKeys: string[]) => void;
    [key: string]: any;
}>;
declare const FilterDropdown: (props: FilterDropdownProps) => JSX.Element;
type ModalButtonProps = PropsWithChildren<{
    button: string | ReactElement;
    className?: string;
    modal: ITableModal;
    modalProps?: {
        [key: string]: any;
    };
}>;
declare const ModalButton: (<RecordType>(props: ModalButtonProps) => JSX.Element) & {
    displayName: string;
};
export { FixedType, CellEllipsisType, AlignType, DoniTableActionMobxType, IListMode, IRootModelFields, IHeadSize, IRootModelActions, IRootModel, IListItem, NoopFunc, ITableModal, DoniTableColumn, ISetRowValueFunc, DoniTableToolbarProps, CustomizeComponent, DoniTableComponentsProps, DoniTableExpandableProps, DoniTablePaginationProps, ScrollProp, DoniTableProps, IDoniTableAction, IDoniTableRecordAction, Ellipsis, CopyToClipboard, FilterDropdown, ModalButton, HeadUnit as HeadCell, BodyUnit as BodyCell, ExportDoniTable as Table };
