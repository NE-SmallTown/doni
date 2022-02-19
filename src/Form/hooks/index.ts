import { useLayoutEffect } from 'react';
import { useFormItemInfo, useModel } from '../Context';
import { IFormItemInfo } from '../types';

export const useFinalProps = (originProps: Record<string, any>, delegateProps: readonly string[], itemInfo?: IFormItemInfo) => {
    const doniFormModel = useModel();

    const formItemInfo = itemInfo || useFormItemInfo();

    const finalProps = { ...originProps };

    useLayoutEffect(() => {
        delegateProps.forEach(key => {
            const propValue = originProps[key as keyof typeof originProps];

            if (typeof propValue !== 'undefined' && typeof propValue === 'function') {
                const getPropValueFunc = propValue;
                const dependentFieldsNames: string[] = [];

                const getComputedValue = () => {
                    return getPropValueFunc(new Proxy({}, {
                        get(target, name) {
                            name = name as string;

                            if (dependentFieldsNames.indexOf(name) === -1) {
                                dependentFieldsNames.push(name);
                            }

                            return doniFormModel.getFieldValue(name);
                        },

                        set: function(obj, name, value) {
                            throw Error(`You should not directly set the value of form field, please use form.setFieldValue instead.`);
                        }
                    }));
                };

                const computedValue = getComputedValue();

                doniFormModel.setFieldComputeValue(formItemInfo.name, key, computedValue);

                // 获取了依赖哪些字段后监听这些字段
                doniFormModel.onFieldsValueChange(dependentFieldsNames, () => {
                    const computedValue = getComputedValue();

                    doniFormModel.setFieldComputeValue(formItemInfo.name, key, computedValue);
                });
            }
        });
    }, []);

    delegateProps.forEach(key => {
        const propValue = originProps[key as keyof typeof originProps];

        if (typeof propValue !== 'undefined') {
            if (typeof propValue === 'function') {
                // 这里好像没有办法让调用 propValue() 返回的值不变组件就不渲染（即便把这里改成一个带参数的 computed，因为带参数的 computed 是不会被 cache 的）
                // https://github.com/mobxjs/mobx-state-tree/discussions/1742
                // 虽然乍一看是很难弄，不过经过我坚持不懈的不抛弃不放弃，想到了这种通过 types.map + onPatch 的方案来实现带缓存的 computed，完美！
                finalProps[key] = doniFormModel.fieldsMap.get(formItemInfo.name)?.computedValueMap.get(key)?.value;
            } else {
                finalProps[key] = propValue;
            }
        }
    });

    return finalProps;
};