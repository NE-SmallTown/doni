import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import DoniResizeObserver, {SizeInfo} from './DoniResizeObserver';
import { useModel } from './Context';
import { DoniTableColumn } from './types';

interface DetectTableInfoProps<RecordType> {
    columns: DoniTableColumn<RecordType>[];
}

const DetectTableInfo = observer(function DetectTableInfo<RecordType>(props: DetectTableInfoProps<RecordType>) {
    const { columns } = props;

    const { setHeadSizes } = useModel();

    const handleOnSize = useCallback((info: SizeInfo) => {
        const rowWidth = info.width; // 表格里的一行所占的宽度
        // 用户希望设置的每一列的宽度
        const columnsWidths: number[] = columns.map(column => {
            const columnWidth = column.width;
            let width = columnWidth;

            // 百分百
            if (typeof columnWidth === 'string') {
                const ratio = Number(columnWidth.replace('%', '')) / 100;

                if (!Number.isFinite(ratio)) {
                    throw Error(`Parse column.width error: ${columnWidth} is not a valid width.`)
                }

                width = rowWidth * ratio;
            }

            return width as number;
        });

        // 根据传入的 column.width 计算得出的期望的总宽度
        const calculatedOptionsColumnWidthSum = columnsWidths.reduce((width, total) => {
            total += width;

            return total;
        }, 0);

        // if (calculatedOptionsColumnWidthSum > rowWidth && !scroll) {
        //     throw Error(
        //         `The total width(${calculatedOptionsColumnWidthSum}) of all columns is larger than table width(${rowWidth}) according to your column.width, ` +
        //         `please change your 'column.width' and make sure the sum of all column.width is less than the table width(<= 100%), ` +
        //         `or set scroll prop to make table scrollable.`
        //     );
        // }

        const extraWidth = Math.abs(rowWidth - calculatedOptionsColumnWidthSum);

        // TODO 这样算了之后可能最后会少几 px（Math.floor 的关系），看看需不需要做偏差修正使总和始终与 rowWidth 相等
        const finalColumnsWidths: number[] = columnsWidths.map((width, index) => {
            const { shrink = true, grow = true } = columns[index];

            // 如果该列设置了不压缩或者不膨胀，则直接返回设置的宽度
            if (!shrink || !grow) {
                return width;
            }

            // 如果会超出，那超出的那部分宽度按照 column.width 占整个 width 的比例对每一列进行压缩
            if (calculatedOptionsColumnWidthSum > rowWidth) {
                // 计算出所有设置了不压缩的列的宽度之和，把不压缩的列的这些宽度按照必须分摊到那些设置了可以压缩的列的宽度上
                const wontShrinkWidthSum = columnsWidths.reduce((ret, width, index) => {
                    const { shrink = true } = columns[index];

                    if (!shrink) {
                        ret += width;
                    }

                    return ret;
                }, 0);

                // 如果没有列都设置不允许压缩
                if (wontShrinkWidthSum === 0) {
                    const ratio = width / calculatedOptionsColumnWidthSum;

                    // 如表格总宽度是 1000（未超出情况下一整行的宽度），column.width 分别设置的 100, 200, '30%', '40%', '50%'
                    // 换算后即为 100, 200, 300, 400, 500，即 1500，则超出的宽度为 1500 - 1000 = 500
                    // 然后按照 column.width 所占总 width 的比例进行压缩，即：
                    // 100 那列最后的 width 为：100 - 500 * (100 / 1500) = 66.6
                    // 200 那列最后的 width 为：200 - 500 * (200 / 1500) = 133.3
                    // 30% 那列最后的 width 为：300 - 500 * (300 / 1500) = 200
                    // 40% 那列最后的 width 为：400 - 500 * (400 / 1500) = 266.6
                    // 50% 那列最后的 width 为：500 - 500 * (500 / 1500) = 333.3
                    return Math.floor(width - extraWidth * ratio);
                }
                // 如果有的列设置了不允许压缩
                else {
                    const shrinkWidthSum = calculatedOptionsColumnWidthSum - wontShrinkWidthSum;
                    const offset = wontShrinkWidthSum * (width / shrinkWidthSum);
                    const ratio = (width + offset) / calculatedOptionsColumnWidthSum;

                    // 如表格总宽度是 1000（未超出情况下一整行的宽度），column.width 分别设置的 100, 200, '30%', '40%', '50%'
                    // 换算后即为 100, 200, 300, 400, 500，即 1500，则超出的宽度为 1500 - 1000 = 500
                    // 假设 100 和 200 的那一列设置了不允许压缩，此时不允许压缩的列的宽度和为 100 + 200 = 300，允许压缩的列的宽度和为 1500 - 300 = 1200
                    // 按照 column.width 所占总 width 的比例进行压缩，即：
                    // 100 那列最后的 width 为：100（因为设置了不允许压缩）
                    // 200 那列最后的 width 为：200（因为设置了不允许压缩）
                    // 30% 那列最后的 width 为：300 - 500 * ((300 + 300 * (300 / 1200)) / 1500) = 175
                    // 40% 那列最后的 width 为：400 - 500 * ((400 + 300 * (400 / 1200)) / 1500) = 233.3
                    // 50% 那列最后的 width 为：500 - 500 * ((500 + 300 * (500 / 1200)) / 1500) = 291.6
                    return Math.floor(width - extraWidth * ratio);
                }
            }
            // 如果没超出还有多余的，那多余的那部分宽度按照 column.width 占整个 width 的比例对每一列进行膨胀
            else if (calculatedOptionsColumnWidthSum < rowWidth) {
                // 计算出所有设置了不膨胀的列的宽度之和，把不膨胀的列的这些宽度按照必须分摊到那些设置了可以膨胀的列的宽度上
                const wontGrowWidthSum = columnsWidths.reduce((ret, width, index) => {
                    const { grow = true } = columns[index];

                    if (!grow) {
                        ret += width;
                    }

                    return ret;
                }, 0);

                // 如果没有列都设置不允许膨胀
                if (wontGrowWidthSum === 0) {
                    const ratio = width / calculatedOptionsColumnWidthSum;

                    // 如表格总宽度是 1000（未超出情况下一整行的宽度），column.width 分别设置的 100, 200, '30%'
                    // 换算后即为 100, 200, 300，即 600，则多余的宽度为 1000 - 600 = 400
                    // 然后按照 column.width 所占总 width 的比例进行膨胀，即：
                    // 100 那列最后的 width 为：100 + 400 * (100 / 600) = 166.6
                    // 200 那列最后的 width 为：200 + 400 * (200 / 600) = 333.3
                    // 30% 那列最后的 width 为：300 + 400 * (300 / 600) = 500
                    return Math.floor(width + extraWidth * ratio);
                }
                // 如果有的列设置了不允许膨胀
                else {
                    const growWidthSum = calculatedOptionsColumnWidthSum - wontGrowWidthSum;
                    const offset = wontGrowWidthSum * (width / growWidthSum);
                    const ratio = (width + offset) / calculatedOptionsColumnWidthSum;

                    // 如表格总宽度是 1000（未超出情况下一整行的宽度），column.width 分别设置的 100, 200, '30%'
                    // 换算后即为 100, 200, 300，即 600，则多余的宽度为 1000 - 600 = 400
                    // 假设 100 的那一列设置了不允许膨胀，此时不允许膨胀的列的宽度和为 100，允许膨胀的列的宽度和为 600 - 100 = 500
                    // 按照 column.width 所占总 width 的比例进行膨胀，即：
                    // 100 那列最后的 width 为：100（因为设置了不允许膨胀）
                    // 200 那列最后的 width 为：200 + 400 * ((200 + 100 * (200 / 500)) / 500) = 392
                    // 30% 那列最后的 width 为：300 + 400 * ((300 + 100 * (300 / 500)) / 500) = 588
                    return Math.floor(width + extraWidth * ratio);
                }
            } else {
                return width;
            }
        });

        setHeadSizes(finalColumnsWidths.map(width => ({ width })));
    }, []);

    return (
        <DoniResizeObserver onSize={ handleOnSize } />
    );
});

export default DetectTableInfo;
