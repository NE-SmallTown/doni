import React from 'react';
import { observer } from 'mobx-react-lite';
import BodyCell from './BodyCell';
import { DoniTableColumn } from './types';

import './BodyItem.scss';

interface BodyItemProps<RecordType> {
    record: RecordType;
    rowKey: string;
    columns: DoniTableColumn<RecordType>[];
    index: number;
}

const BodyItem = observer(function BodyItem<RecordType>(props: BodyItemProps<RecordType>) {
    const { record, columns, rowKey } = props;

    // Q：为什么要用传给 column.render 的 record 是 getSnapshot 之后的，而不是直接传 record？
    // A：由于在 column.render 那边会怎么使用 record 是不确定的，如果直接传 record 的话，在那边由直接将这个 record 赋值给它自己的 model 层
    //    就会报错（因为一个 mobx node 是不能直接在 model tree 里面进行移动的），另外直接让业务方拿到 Table 内部的 model node 也不太好
    //    所以这里选择了传 record 的 snapshot 过去，由于用 snapshot 进行 .x.x.x 这样的访问的时候，一样是响应式地可以触发 observer re-render
    //    所以就没啥问题啦
    //    这是我一开始的想法。。。。
    //    然而，事情并没有这么简单！
    //    getSnapshot(modelA) 会导致使用 getSnapshot(modelA) 的那个组件完全依赖 modelA 对象里的任何字段
    //    可以简单地理解为 getSnapshot(modelA) 进行了一次 deepClone 或者 JSON.parse(JSON.stringify(modelA))
    //    假设 modelA 是 { foo: number; bar: number} 然后这里用了 getSnapshot(modelA) 并把这个传给子组件
    //    子组件只依赖 modelA.bar，然后更新 modelA.bar 之后，本组件也会重新渲染。。。因为前面说了，由于本组件用了 getSnapshot(modelA)
    //    相当于本组件就依赖了 modelA 的所有字段（不过有多深），即，在这里就是依赖了 foo 和 bar。所以哪怕只更新了 bar，本组件也会 re-render
    //    辣鸡 mbox。。。

    return (
        <tr className='doni-table-tr'>
            {
                columns.map((column, index) => (
                    <BodyCell
                        key={ index }
                        index={ index }
                        record={ record }
                        column={ column }
                        rowKey={ rowKey }
                    />
                ))
            }
        </tr>
    );
});

export default BodyItem;