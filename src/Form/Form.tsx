import React, { ReactElement, useEffect, useLayoutEffect, useMemo } from 'react';
import { Form } from 'antd';
import { observer } from 'mobx-react-lite';
import { types, onSnapshot, onPatch } from 'mobx-state-tree';
import { DoniFormItemInfoContext, DoniFormRootStoreContext, useModel } from './Context';
import { IFormModelActions, IDoniFormProps, IDoniFormItemProps, formItemDelegateProps } from './types';
import { useFinalProps } from './hooks';

const InternalDoniForm = observer(function DoniForm(props: IDoniFormProps) {
    const { ...antdFormProps } = props;

    const [ antdForm ] = Form.useForm();

    const DoniFormRootModel = types
        .model({
            fieldsMap: types.map(
                types.model({
                    // 表单项（Form.item）里的表单组件的值
                    value: types.union(
                        types.string,
                        types.number,
                        types.boolean,
                        types.array(types.union(
                            types.string,
                            types.number,
                            types.boolean,
                        )),
                    ),
                    // 表单项（Form.item）里的表单组件依赖的别的表单项的值
                    computedValueMap: types.map(types.model({
                        value: types.union(
                            types.string,
                            types.number,
                            types.boolean,
                            types.array(types.union(
                                types.string,
                                types.number,
                                types.boolean,
                            )),
                        ),
                    })),
                }),
            ),
        })
        .volatile(self => ({
            antdForm,
            doniFormAction: {
                getFieldValue: (name: string) => {},
                setFieldValue: (setFunc: (fieldModel: any) => void) => {},
            },
        }))
        .actions(self => {
            const actions: IFormModelActions = {
                initField: (name, value) => {
                    self.fieldsMap.set(name, {
                        value,
                        computedValueMap: {},
                    });
                },

                setFieldComputeValue: (name, prop, value) => {
                    const field = self.fieldsMap.get(name);

                    if (field) {
                        const filedComputedValueMap = field.computedValueMap.get(prop);

                        if (filedComputedValueMap) {
                            filedComputedValueMap.value = value;
                        } else {
                            field.computedValueMap.set(prop, { value })
                        }
                    }
                },

                getFieldValue: (name) => {
                    const field = self.fieldsMap.get(name);

                    return field?.value;
                },

                setFieldValue: (setFunc) => {
                    setFunc(new Proxy({}, {
                        get(target, name) {
                            return actions.getFieldValue(name as string);
                        },

                        set(obj, name, value) {
                            const field = self.fieldsMap.get(name as string);

                            if (field) {
                                field.value = value;
                            } else {
                                self.fieldsMap.set(name as string, {
                                    value,
                                });
                            }

                            // 设置完了之后同步给 antd 的 Form
                            self.antdForm.setFieldsValue({
                                [name]: value,
                            });

                            return true;
                        }
                    }));
                },

                getAllFields: () => {
                    return new Proxy({}, {
                        get(target, name) {
                            const field = self.fieldsMap.get(name as string);

                            return field?.value;
                        },

                        set: function(obj, name, value) {
                            throw Error(`You should not directly set value of form field, please use form.setFieldValue instead.`);
                        }
                    });
                },

                onFieldsValueChange: (dependentFieldsNames, callback) => {
                    onPatch(initialDoniFormRootState, patch => {
                        const { path } = patch;

                        if (dependentFieldsNames.findIndex(fieldName => path === `/fieldsMap/${fieldName}/value`) !== -1) {
                            callback()
                        }
                    });
                },
            };

            self.doniFormAction = {
                getFieldValue: actions.getFieldValue,
                setFieldValue: actions.setFieldValue,
            };

            return actions as any;
        });

    const initialDoniFormRootState = useMemo(() => DoniFormRootModel.create({
        fieldsMap: {},
    }), []);

    useEffect(() => {
        onSnapshot(initialDoniFormRootState, snapshot => {
            // console.log("DoniForm Snapshot: ", snapshot);
        });
    }, []);

    return (
        <DoniFormRootStoreContext.Provider value={ initialDoniFormRootState }>
            <Form form={ antdForm } { ...antdFormProps } />
        </DoniFormRootStoreContext.Provider>
    );
});

export const DoniFormItem = observer(function DoniFormItem(props: IDoniFormItemProps) {
    const { ...antdFormItemProps } = props;

    const doniFormModel = useModel();

    const itemInfo = useMemo(() => {
        return {
            name: props.name || `no-name-form-item-${Math.random().toString(36).slice(2)}`,
        };
    }, []);

    useLayoutEffect(() => {
        // 初始化
        doniFormModel.initField(itemInfo.name, '');
    }, []);

    const finalProps = useFinalProps(antdFormItemProps, formItemDelegateProps, itemInfo);

    return (
        <DoniFormItemInfoContext.Provider value={ itemInfo }>
            <Form.Item { ...finalProps } />
        </DoniFormItemInfoContext.Provider>
    );
});

(InternalDoniForm as any).FormItem = DoniFormItem;

interface CompoundedComponent {
    (props: IDoniFormProps): (ReactElement|null);
    FormItem: typeof DoniFormItem;
}

export const DoniForm: CompoundedComponent = InternalDoniForm as CompoundedComponent;