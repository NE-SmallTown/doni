import React, { useCallback } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import type { CheckboxGroupProps } from 'antd/lib/checkbox/Group';
import { observer } from 'mobx-react-lite';
import { useModel, useFormItemInfo } from '../Context';
import { useFinalProps } from '../hooks';
import { Modify, DoniFormComponentPropFunc } from '../types';

import './index.scss'

const checkboxDelegateProps = [
    'checked',
    'disabled',
    'autoFocus',
    'indeterminate',
] as const;

type DelegateCheckboxProps = typeof checkboxDelegateProps[number];

interface DoniCheckBoxProps extends Modify<CheckboxProps, {
    [K in DelegateCheckboxProps]?: CheckboxProps[DelegateCheckboxProps] | DoniFormComponentPropFunc;
}> {}

const DoniCheckBox = observer(function DoniCheckBox(props: DoniCheckBoxProps) {
    const { ...antdCheckBoxProps } = props;

    const doniFormModel = useModel();

    const formItemInfo = useFormItemInfo();

    const handleCheckedChange = useCallback((e) => {
        const newValue = e.target.checked;

        doniFormModel.setFieldValue(formData => {
            formData[formItemInfo.name] = newValue;
        });
    }, []);

    const finalProps = useFinalProps(antdCheckBoxProps, checkboxDelegateProps);

    return (
        <Checkbox
            { ...finalProps }
            onChange={ handleCheckedChange }
        />
    );
});

const checkboxGroupDelegateProps = [
    'disabled',
] as const;

type DelegateCheckboxGroupProps = typeof checkboxGroupDelegateProps[number];

interface DoniCheckBoxGroupProps extends Modify<CheckboxGroupProps, {
    [K in DelegateCheckboxGroupProps]?: CheckboxGroupProps[DelegateCheckboxGroupProps] | DoniFormComponentPropFunc;
}> {}

export const DoniCheckBoxGroup = observer(function DoniCheckBoxGroup(props: DoniCheckBoxGroupProps) {
    const { ...antdCheckBoxGroupProps } = props;

    const doniFormModel = useModel();

    const formItemInfo = useFormItemInfo();

    const handleCheckListChange = useCallback(list => {
        doniFormModel.setFieldValue(formData => {
            formData[formItemInfo.name] = list;
        });
    }, []);

    const finalProps = useFinalProps(antdCheckBoxGroupProps, checkboxDelegateProps);

    return (
        <Checkbox.Group
            { ...finalProps }
            onChange={ handleCheckListChange }
        />
    );
});

(DoniCheckBox as any).Group = DoniCheckBoxGroup;

interface CompoundedComponent extends React.ForwardRefExoticComponent<DoniCheckBoxProps> {
    Group: typeof DoniCheckBoxGroup;
}

const ExportDoniCheckBox: CompoundedComponent = DoniCheckBox as CompoundedComponent;

export default ExportDoniCheckBox;