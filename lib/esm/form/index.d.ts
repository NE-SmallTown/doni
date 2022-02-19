/// <reference types="react" />
import React from "react";
import { ReactElement } from "react";
import { FormProps, FormItemProps, FormInstance, InputProps, CheckboxProps } from "antd";
import { CheckboxGroupProps } from "antd/lib/checkbox/Group";
type NoopFunc = (...args: any[]) => any;
type ISetFunc = (formData: any) => void;
type Modify<T, R> = Omit<T, keyof R> & R;
interface IDoniFormProps extends FormProps {
}
declare const formItemDelegateProps: readonly [
    "label",
    "colon",
    "hidden",
    "htmlFor",
    "labelAlign",
    "noStyle",
    "preserve",
    "required",
    "trigger",
    "validateFirst",
    "validateStatus",
    "validateTrigger"
];
type FormItemDelegateProps = typeof formItemDelegateProps[number];
interface IDoniFormItemProps extends Modify<FormItemProps, {
    [K in FormItemDelegateProps]?: FormItemProps[FormItemDelegateProps] | DoniFormComponentPropFunc;
}> {
    name?: string;
}
interface IFormItemInfo {
    name: string;
}
interface IFormField {
    value: any;
    computedValueMap: Map<string, {
        value: any;
    }>;
}
interface IFormModelFields {
    fieldsMap: Map<string, IFormField>;
}
interface IFormModelVolatiles {
    antdForm: FormInstance;
}
interface IFormModelActions {
    initField: (name: string, value: any) => void;
    setFieldComputeValue: (name: string, prop: string, value: any) => void;
    onFieldsValueChange: (dependentFieldsNames: string[], callback: () => void) => void;
    getFieldValue: (name: string) => any;
    setFieldValue: (setFunc: ISetFunc) => void;
    getAllFields: () => Record<string, any>;
}
interface IFormModel extends IFormModelFields, IFormModelVolatiles, IFormModelActions {
}
type DoniFormComponentPropFunc = (formData: Record<string, any>) => any;
declare const DoniFormItem: React.FunctionComponent<IDoniFormItemProps>;
interface CompoundedComponent {
    (props: IDoniFormProps): (ReactElement | null);
    FormItem: typeof DoniFormItem;
}
declare const DoniForm: CompoundedComponent;
declare const delegateProps: readonly [
    "value",
    "placeholder",
    "disabled",
    "allowClear",
    "addonBefore",
    "addonAfter",
    "bordered",
    "maxLength",
    "prefix",
    "size",
    "suffix",
    "type"
];
type DelegateProps = typeof delegateProps[number];
interface DoniInputProps extends Modify<InputProps, {
    [K in DelegateProps]?: InputProps[DelegateProps] | DoniFormComponentPropFunc;
}> {
}
declare const DoniInput: React.FunctionComponent<DoniInputProps>;
declare const Input: typeof DoniInput;
declare const checkboxDelegateProps: readonly [
    "checked",
    "disabled",
    "autoFocus",
    "indeterminate"
];
type DelegateCheckboxProps = typeof checkboxDelegateProps[number];
interface DoniCheckBoxProps extends Modify<CheckboxProps, {
    [K in DelegateCheckboxProps]?: CheckboxProps[DelegateCheckboxProps] | DoniFormComponentPropFunc;
}> {
}
declare const checkboxGroupDelegateProps: readonly [
    "disabled"
];
type DelegateCheckboxGroupProps = typeof checkboxGroupDelegateProps[number];
interface DoniCheckBoxGroupProps extends Modify<CheckboxGroupProps, {
    [K in DelegateCheckboxGroupProps]?: CheckboxGroupProps[DelegateCheckboxGroupProps] | DoniFormComponentPropFunc;
}> {
}
declare const DoniCheckBoxGroup: React.FunctionComponent<DoniCheckBoxGroupProps>;
interface CompoundedComponent$0 extends React.ForwardRefExoticComponent<DoniCheckBoxProps> {
    Group: typeof DoniCheckBoxGroup;
}
declare const ExportDoniCheckBox: CompoundedComponent$0;
declare const CheckBox: typeof ExportDoniCheckBox;
export { DoniForm as default, NoopFunc, ISetFunc, Modify, IDoniFormProps, formItemDelegateProps, IDoniFormItemProps, IFormItemInfo, IFormField, IFormModelFields, IFormModelVolatiles, IFormModelActions, IFormModel, DoniFormComponentPropFunc, Input, CheckBox };
