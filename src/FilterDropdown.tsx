import React, { PropsWithChildren, ReactNode, useCallback, useState } from 'react';
import { Menu, Checkbox, Dropdown, Button } from 'antd';
import {
    FilterFilled,
} from '@ant-design/icons';
import classNames from 'classnames';

import './FilterDropdown.scss';

type FilterDropdownProps = PropsWithChildren<{
    className?: string;
    data: {
        text: ReactNode,
        value: string;
    }[];
    dropdownProps?: {

    };
    menuProps?: {
        multiple?: boolean;
        className?: string;
        [key: string]: any;
    };
    onFinish: (selectedKeys: string[]) => void;
    [key: string]: any;
}>

const FilterDropdown = (props: FilterDropdownProps) => {
    const {
        className,
        data,
        dropdownProps = {},
        menuProps = {},
        children,
        onFinish,
        ...restProps
    } = props;

    const [ dropdownVisible, setDropdownVisible ] = useState(false);

    const [ selectedKeys, setSelectedKeys ] = useState<string[]>([]);

    const handleMenuSelect = useCallback(({ selectedKeys }) => {
        setSelectedKeys(selectedKeys);
    }, []);

    const handleDropdownVisibleChange = useCallback(visible => {
        setDropdownVisible(visible);
    }, []);

    const handleClickReset = useCallback(() => {
        setSelectedKeys([]);
    }, []);

    const handleClickSubmit = useCallback(() => {
        onFinish(selectedKeys);
    }, [ onFinish, selectedKeys ]);

    const {
        multiple = true,
        ...restMenuProps
    } = menuProps;

    return (
        <div
            className={classNames(
                [
                    'doni-filter-dropdown',
                    className,
                ],
            )}
            { ...restProps }
        >
            <Dropdown
                overlay={(
                    <div className='doni-filter-dropdown-overlay'>
                        <Menu
                            multiple={ multiple }
                            onSelect={ handleMenuSelect }
                            onDeselect={ handleMenuSelect }
                            selectedKeys={ selectedKeys }
                            { ...restMenuProps }
                        >
                            {
                                data.map(({ text, value }, index) => {
                                    const key = String(value || index);

                                    return (
                                        <Menu.Item key={ key } className='filter-item'>
                                            <Checkbox checked={ selectedKeys.includes(key) } />

                                            <span className='filter-item-text'>{ text }</span>
                                        </Menu.Item>
                                    );
                                })
                            }
                        </Menu>

                        <div className='actions'>
                            <Button type='link' size='small' disabled={ selectedKeys.length === 0 } onClick={ handleClickReset }>
                                Reset
                            </Button>

                            <Button type='primary' size='small' onClick={ handleClickSubmit }>
                                Submit
                            </Button>
                        </div>
                    </div>
                )}
                trigger={[ 'click' ]}
                visible={ dropdownVisible }
                onVisibleChange={ handleDropdownVisibleChange }
                placement='bottomRight'
                { ...dropdownProps }
            >
                <span className='icon' onClick={ e => e.stopPropagation() }>
                    <FilterFilled />
                </span>
            </Dropdown>
        </div>
    );
};

export default FilterDropdown;
