import { useMemo } from 'react';
import { useModel } from '../Context';
import { FixedType } from '../types';

type UseColumnStickStyle = (fixed: FixedType | undefined, index: number) => { [key: string]: any };

export const useColumnStickStyle: UseColumnStickStyle = (fixed, index) => {
    const { headSizes } = useModel();

    const style: any = useMemo(() => {
            const style: any = {};

            if (fixed) {
                style.position = 'sticky';
                style.zIndex = '2';

                // 固定某一列列在表格左边时，计算被固定的列到表格左边的距离
                if(fixed === 'left') {
                    style.left = headSizes.slice(0, index).reduce(
                        (totalWidth, { width }) => {
                            totalWidth += width;

                            return totalWidth;
                        },
                        0,
                    ) + 'px';
                }
                // 固定某一列列在表格右边时，计算被固定的列到表格右边的距离
                else if (fixed === 'right') {
                    style.right = headSizes.slice(index + 1).reduce(
                        (totalWidth, { width }) => {
                            totalWidth += width;

                            return totalWidth;
                        },
                        0,
                    ) + 'px';
                }
            }

            return style;
        },
        // 这里的 deps 如果直接填 headSizes 的话，虽然由于我们使用了 slice 使得这里 headSizes 能被 observe 到
        // 但是 useMemo 的 deps 本身校验的引用相等，而 headSizes 的引用是不会变的，所以 useMemo 也就不会执行了。
        // 参考 https://github.com/mobxjs/mobx/discussions/3224
        // 所以这里的 deps 不是写的 headSizes，而是写的 JSON.stringify(headSizes)
        [ index, fixed, JSON.stringify(headSizes) ],
    );

    return style;
};