import type { FormProps, FormItemProps, FormInstance } from 'antd';

export type NoopFunc = (...args: any[]) => any;

export type ISetFunc = (formData: any) => void;

export type Modify<T, R> = Omit<T, keyof R> & R;

export interface IDoniFormProps extends FormProps {

}

export const formItemDelegateProps = [
    'label',
    'colon',
    'hidden',
    'htmlFor',
    'labelAlign',
    'noStyle',
    'preserve',
    'required',
    'trigger',
    'validateFirst',
    'validateStatus',
    'validateTrigger',
] as const;

type FormItemDelegateProps = typeof formItemDelegateProps[number];

export interface IDoniFormItemProps extends Modify<FormItemProps, {
    [K in FormItemDelegateProps]?: FormItemProps[FormItemDelegateProps] | DoniFormComponentPropFunc;
}> {
    name?: string;
}

export interface IFormItemInfo {
    name: string;
}

export interface IFormField {
    value: any;
    computedValueMap: Map<string, { value: any }>;
}

export interface IFormModelFields {
    fieldsMap: Map<string, IFormField>;
}

export interface IFormModelVolatiles {
    antdForm: FormInstance;
}

export interface IFormModelActions {
    initField: (name: string, value: any) => void;
    setFieldComputeValue: (name: string, prop: string, value: any) => void;
    onFieldsValueChange: (dependentFieldsNames: string[], callback: () => void) => void;
    getFieldValue: (name: string) => any;
    setFieldValue: (setFunc: ISetFunc) => void,
    getAllFields: () => Record<string, any>,
}

export interface IFormModel extends IFormModelFields, IFormModelVolatiles, IFormModelActions {}

export type DoniFormComponentPropFunc = (formData: Record<string, any>) => any;