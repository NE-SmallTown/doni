import React, { useCallback } from 'react';
import { Input } from 'antd';
import { observer } from 'mobx-react-lite';
import type { InputProps } from 'antd';
import { useModel, useFormItemInfo } from '../Context';
import { useFinalProps } from '../hooks';
import { Modify, DoniFormComponentPropFunc } from '../types'

import './index.scss'

const delegateProps = [
    'value',
    'placeholder',
    'disabled',
    'allowClear',
    'addonBefore',
    'addonAfter',
    'bordered',
    'maxLength',
    'prefix',
    'size',
    'suffix',
    'type',
] as const;

type DelegateProps = typeof delegateProps[number];

export interface DoniInputProps extends Modify<InputProps, {
    [K in DelegateProps]?: InputProps[DelegateProps] | DoniFormComponentPropFunc;
}> {}

const DoniInput = observer(function DoniInput(props: DoniInputProps) {
    const { ...antdInputProps } = props;

    const doniFormModel = useModel();

    const formItemInfo = useFormItemInfo();

    const handleInputChange = useCallback((e) => {
        const newValue = e.target.value;

        doniFormModel.setFieldValue(formData => {
            formData[formItemInfo.name] = newValue;
        });
    }, []);

    const finalProps = useFinalProps(antdInputProps, delegateProps);

    console.log(`DoniInput（${formItemInfo.name}） render`)

    return (
        <Input
            { ...finalProps }
            onChange={ handleInputChange }
        />
    );
});

export default DoniInput;
