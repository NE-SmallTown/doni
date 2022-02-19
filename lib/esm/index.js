import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useContext, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Pagination, Spin, Dropdown, Menu, Checkbox, Button, Modal } from 'antd';
import { types, getSnapshot, cast } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import { CheckOutlined, CopyOutlined, FilterFilled } from '@ant-design/icons';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function () {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __rest(s, e) {
    var t = {};
    for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var classnames = {exports: {}};

(function (module) {
    /* global define */
    (function () {
        var hasOwn = {}.hasOwnProperty;
        function classNames() {
            var classes = [];
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (!arg)
                    continue;
                var argType = typeof arg;
                if (argType === 'string' || argType === 'number') {
                    classes.push(arg);
                }
                else if (Array.isArray(arg)) {
                    if (arg.length) {
                        var inner = classNames.apply(null, arg);
                        if (inner) {
                            classes.push(inner);
                        }
                    }
                }
                else if (argType === 'object') {
                    if (arg.toString === Object.prototype.toString) {
                        for (var key in arg) {
                            if (hasOwn.call(arg, key) && arg[key]) {
                                classes.push(key);
                            }
                        }
                    }
                    else {
                        classes.push(arg.toString());
                    }
                }
            }
            return classes.join(' ');
        }
        if (module.exports) {
            classNames.default = classNames;
            module.exports = classNames;
        }
        else {
            window.classNames = classNames;
        }
    }());
}(classnames));
var classNames = classnames.exports;

var DoniTableRootStoreContext = React.createContext(null);
DoniTableRootStoreContext.displayName = 'DoniTableRootStoreContext';
function useModel() {
    var store = useContext(DoniTableRootStoreContext);
    if (store === null) {
        throw new Error('Store cannot be null, please add a context provider.');
    }
    return store;
}

var ColGroup = observer(function ColGroup(props) {
    var headSizes = useModel().headSizes;
    // console.log('ColGroup render')
    return (jsx("colgroup", { children: headSizes.map(function (_a, index) {
            var width = _a.width;
            return (jsx("col", { style: { width: width + 'px' } }, index));
        }) }, void 0));
});

var HeadUnit = observer(function HeadUnit(_a) {
    _a.maxLine; var className = _a.className, children = _a.children, restProps = __rest(_a, ["maxLine", "className", "children"]);
    return (jsx("div", __assign({ className: classNames([
            'doni-table-th-cell',
            className,
        ]) }, restProps, { children: children }), void 0));
});

var useColumnStickStyle = function (fixed, index) {
    var headSizes = useModel().headSizes;
    var style = useMemo(function () {
        var style = {};
        if (fixed) {
            style.position = 'sticky';
            style.zIndex = '2';
            // 固定某一列列在表格左边时，计算被固定的列到表格左边的距离
            if (fixed === 'left') {
                style.left = headSizes.slice(0, index).reduce(function (totalWidth, _a) {
                    var width = _a.width;
                    totalWidth += width;
                    return totalWidth;
                }, 0) + 'px';
            }
            // 固定某一列列在表格右边时，计算被固定的列到表格右边的距离
            else if (fixed === 'right') {
                style.right = headSizes.slice(index + 1).reduce(function (totalWidth, _a) {
                    var width = _a.width;
                    totalWidth += width;
                    return totalWidth;
                }, 0) + 'px';
            }
        }
        return style;
    }, 
    // 这里的 deps 如果直接填 headSizes 的话，虽然由于我们使用了 slice 使得这里 headSizes 能被 observe 到
    // 但是 useMemo 的 deps 本身校验的引用相等，而 headSizes 的引用是不会变的，所以 useMemo 也就不会执行了。
    // 参考 https://github.com/mobxjs/mobx/discussions/3224
    // 所以这里的 deps 不是写的 headSizes，而是写的 JSON.stringify(headSizes)
    [index, fixed, JSON.stringify(headSizes)]);
    return style;
};

var HeadCell = observer(function HeadCell(props) {
    var column = props.column, index = props.index, scroll = props.scroll;
    var childElement = column.title;
    var isHeaderTopFixed = Boolean(scroll === null || scroll === void 0 ? void 0 : scroll.y);
    var doniTableAction = useModel().doniTableAction;
    var paramsRef = useRef({
        index: index,
        tableAction: doniTableAction,
    });
    var style = useColumnStickStyle(column.fixed, index);
    if (typeof column.title === 'function') {
        childElement = column.title(paramsRef.current);
    }
    var className = classNames(['doni-table-th'], {
        'doni-table-th-top-fixed': isHeaderTopFixed,
    });
    if (typeof childElement === 'object') {
        // @ts-ignore
        var type = childElement.type;
        if (type !== HeadUnit) {
            throw Error("The column.render returns must be wrapped by a HeadCell component, but now get: ".concat(type.toString() || type.$$typeof.toString()));
        }
        return (jsx("th", __assign({ className: className, style: style }, { children: childElement }), void 0));
    }
    return (jsx("th", __assign({ className: className, style: style }, { children: jsx(HeadUnit, { children: childElement }, void 0) }), void 0));
});

var HeadItem = observer(function HeadItem(props) {
    var column = props.column, index = props.index, rowKey = props.rowKey, scroll = props.scroll;
    // console.log('HeadItem render')
    return (jsx(HeadCell, { index: index, column: column, rowKey: rowKey, scroll: scroll }, index));
});

var BodyUnit = observer(function BodyUnit(_a) {
    _a.maxLine; var className = _a.className, children = _a.children, restProps = __rest(_a, ["maxLine", "className", "children"]);
    return (jsx("div", __assign({ className: classNames([
            'doni-table-td-cell',
            className,
        ]) }, restProps, { children: children }), void 0));
});

var noop = function () { };
var useForceUpdate = function () {
    var _a = useState({}); _a[0]; var set = _a[1];
    var forceUpdate = useCallback(function () {
        set({});
    }, []);
    return forceUpdate;
};
var MODAL_LIMIT_AMOUNT = 5; // 默认最多提供 5 个 modal 对象
var BodyCell = observer(function BodyCell(props) {
    var record = props.record, column = props.column, index = props.index, rowKey = props.rowKey;
    var doniTableModel = useModel();
    var forceUpdate = useForceUpdate();
    var paramsRef = useRef({
        index: index,
        action: {
            setRecord: noop,
        },
        tableAction: doniTableModel.doniTableAction,
        modals: Array.from({ length: MODAL_LIMIT_AMOUNT }).map(function () { return ({
            visible: false,
            openModal: noop,
            closeModal: noop,
            toggleModal: noop,
        }); }),
    });
    useEffect(function () {
        paramsRef.current.modals.forEach(function (modal) {
            var setVisible = function (visible) {
                modal.visible = visible;
                forceUpdate();
            };
            modal.openModal = function () {
                setVisible(true);
            };
            modal.closeModal = function () {
                setVisible(false);
            };
            modal.toggleModal = function () {
                setVisible(!modal.visible);
            };
        });
        // 由于 record 的引用对应固定的某一行是永远不会变的，而 recordId 是会改变的
        // 所以可以通过下面的方式在不 re-render 组件的情况下动态的获取到最新的 recordId
        paramsRef.current.action.setRecord = function (setFunc) {
            var recordId = record[rowKey];
            doniTableModel.doniTableAction.setRowValue(recordId, setFunc);
        };
    }, []);
    var style = useColumnStickStyle(column.fixed, index);
    // console.log(`Doni Cell(${typeof column.title === 'function' ? column.title.name : column.title}) render`);
    console.log("Doni Cell render");
    var childElement = column.render(record, paramsRef.current);
    if (typeof childElement === 'object') {
        // @ts-ignore
        var type = childElement.type;
        if (type !== BodyUnit) {
            throw Error("The column.render returns must be wrapped by a BodyCell component, but now get: ".concat(type.toString() || type.$$typeof.toString()));
        }
        return (jsx("td", __assign({ className: 'doni-table-td', style: style }, { children: childElement }), void 0));
    }
    return (jsx("td", __assign({ className: 'doni-table-td', style: style }, { children: jsx(BodyUnit, { children: childElement }, void 0) }), void 0));
});

var BodyItem = observer(function BodyItem(props) {
    var record = props.record, columns = props.columns, rowKey = props.rowKey;
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
    return (jsx("tr", __assign({ className: 'doni-table-tr' }, { children: columns.map(function (column, index) { return (jsx(BodyCell, { index: index, record: record, column: column, rowKey: rowKey }, index)); }) }), void 0));
});

var doniResizeObserver = (function () {
    var callbacksMap = new Map();
    var observer = new ResizeObserver(function (entries) {
        var _loop_1 = function (entry) {
            var sizeInfo = entry.contentRect;
            var callbacks = callbacksMap.get(entry.target);
            if (callbacks) {
                callbacks.forEach(function (callback) { return callback({
                    width: sizeInfo.width,
                    height: sizeInfo.height,
                }); });
            }
        };
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            _loop_1(entry);
        }
    });
    return {
        observe: function (dom, callback) {
            if (callbacksMap.get(dom)) {
                callbacksMap.set(dom, callbacksMap.get(dom).concat(callback));
            }
            else {
                callbacksMap.set(dom, [callback]);
            }
        },
        unobserve: function (dom) {
            observer.unobserve(dom);
        },
    };
})();
// 先用一个空的 div 来获取宽度，渲染之后就改成 ResizeObserver 来获取宽度
var DoniResizeObserver = function DoniResizeObserver(props) {
    var children = props.children, onSize = props.onSize;
    var _a = useState(false), isFirstMeasured = _a[0], setIsFirstMeasured = _a[1];
    var helperDIVRef = useRef(null);
    var initialHelperDIVRef = useRef(null);
    useEffect(function () {
        var _a = initialHelperDIVRef.current.getBoundingClientRect(), width = _a.width, height = _a.height;
        var info = {
            width: width,
            height: height,
        };
        onSize(info);
        setIsFirstMeasured(true);
    }, []);
    useEffect(function () {
        if (helperDIVRef.current) {
            doniResizeObserver.observe(helperDIVRef.current, function (sizeInfo) {
                onSize(sizeInfo);
            });
        }
        return function () {
            helperDIVRef.current && doniResizeObserver.unobserve(helperDIVRef.current);
        };
    }, [helperDIVRef.current]);
    if (!isFirstMeasured) {
        return (jsx("div", { className: 'resize-helper-div', ref: initialHelperDIVRef }, void 0));
    }
    return (jsxs(Fragment, { children: [jsx("div", { className: 'resize-helper-div', ref: helperDIVRef }, void 0), children && React.Children.only(children)] }, void 0));
};

var DetectTableInfo = observer(function DetectTableInfo(props) {
    var columns = props.columns;
    var setHeadSizes = useModel().setHeadSizes;
    var handleOnSize = useCallback(function (info) {
        var rowWidth = info.width; // 表格里的一行所占的宽度
        // 用户希望设置的每一列的宽度
        var columnsWidths = columns.map(function (column) {
            var columnWidth = column.width;
            var width = columnWidth;
            // 百分百
            if (typeof columnWidth === 'string') {
                var ratio = Number(columnWidth.replace('%', '')) / 100;
                if (!Number.isFinite(ratio)) {
                    throw Error("Parse column.width error: ".concat(columnWidth, " is not a valid width."));
                }
                width = rowWidth * ratio;
            }
            return width;
        });
        // 根据传入的 column.width 计算得出的期望的总宽度
        var calculatedOptionsColumnWidthSum = columnsWidths.reduce(function (width, total) {
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
        var extraWidth = Math.abs(rowWidth - calculatedOptionsColumnWidthSum);
        // TODO 这样算了之后可能最后会少几 px（Math.floor 的关系），看看需不需要做偏差修正使总和始终与 rowWidth 相等
        var finalColumnsWidths = columnsWidths.map(function (width, index) {
            var _a = columns[index], _b = _a.shrink, shrink = _b === void 0 ? true : _b, _c = _a.grow, grow = _c === void 0 ? true : _c;
            // 如果该列设置了不压缩或者不膨胀，则直接返回设置的宽度
            if (!shrink || !grow) {
                return width;
            }
            // 如果会超出，那超出的那部分宽度按照 column.width 占整个 width 的比例对每一列进行压缩
            if (calculatedOptionsColumnWidthSum > rowWidth) {
                // 计算出所有设置了不压缩的列的宽度之和，把不压缩的列的这些宽度按照必须分摊到那些设置了可以压缩的列的宽度上
                var wontShrinkWidthSum = columnsWidths.reduce(function (ret, width, index) {
                    var _a = columns[index].shrink, shrink = _a === void 0 ? true : _a;
                    if (!shrink) {
                        ret += width;
                    }
                    return ret;
                }, 0);
                // 如果没有列都设置不允许压缩
                if (wontShrinkWidthSum === 0) {
                    var ratio = width / calculatedOptionsColumnWidthSum;
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
                    var shrinkWidthSum = calculatedOptionsColumnWidthSum - wontShrinkWidthSum;
                    var offset = wontShrinkWidthSum * (width / shrinkWidthSum);
                    var ratio = (width + offset) / calculatedOptionsColumnWidthSum;
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
                var wontGrowWidthSum = columnsWidths.reduce(function (ret, width, index) {
                    var _a = columns[index].grow, grow = _a === void 0 ? true : _a;
                    if (!grow) {
                        ret += width;
                    }
                    return ret;
                }, 0);
                // 如果没有列都设置不允许膨胀
                if (wontGrowWidthSum === 0) {
                    var ratio = width / calculatedOptionsColumnWidthSum;
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
                    var growWidthSum = calculatedOptionsColumnWidthSum - wontGrowWidthSum;
                    var offset = wontGrowWidthSum * (width / growWidthSum);
                    var ratio = (width + offset) / calculatedOptionsColumnWidthSum;
                    // 如表格总宽度是 1000（未超出情况下一整行的宽度），column.width 分别设置的 100, 200, '30%'
                    // 换算后即为 100, 200, 300，即 600，则多余的宽度为 1000 - 600 = 400
                    // 假设 100 的那一列设置了不允许膨胀，此时不允许膨胀的列的宽度和为 100，允许膨胀的列的宽度和为 600 - 100 = 500
                    // 按照 column.width 所占总 width 的比例进行膨胀，即：
                    // 100 那列最后的 width 为：100（因为设置了不允许膨胀）
                    // 200 那列最后的 width 为：200 + 400 * ((200 + 100 * (200 / 500)) / 500) = 392
                    // 30% 那列最后的 width 为：300 + 400 * ((300 + 100 * (300 / 500)) / 500) = 588
                    return Math.floor(width + extraWidth * ratio);
                }
            }
            else {
                return width;
            }
        });
        setHeadSizes(finalColumnsWidths.map(function (width) { return ({ width: width }); }));
    }, []);
    return (jsx(DoniResizeObserver, { onSize: handleOnSize }, void 0));
});

var DoniTablePagination = observer(function DoniTablePagination(props) {
    var pagination = props.pagination;
    var _a = useModel(), currentPage = _a.currentPage, list = _a.list, setCurrentPage = _a.setCurrentPage;
    var paginationProps = __assign(__assign({}, pagination), { current: currentPage, total: list.length });
    var handlePageChange = useCallback(function (page, pageSize) {
        setCurrentPage(page, pageSize);
    }, []);
    return (jsx("div", __assign({ className: 'doni-table-pagination' }, { children: jsx(Pagination, __assign({ onChange: handlePageChange }, paginationProps), void 0) }), void 0));
});

var DoniTableActionMobxType = {
    setRowValue: function (rowId, fieldKey, fieldValue) { },
    filterRow: function (isNeedFilter, options) { },
    getTableData: function () { },
};

// Q: recordMobxType 能否去掉？
// A: 很难，几乎做不到。recordMobxType 存在的原因是，无论 mobx 还是 mobx-state-tree，对于要被 observer 的数据都是要求「先定义，后使用」。
//    对于完全无法确定长什么样子的数据，是没有办法去 observe 的。
//    有两种可能的方案（假设传入的数据为 initDate = [{ name: 'hello', author: { name: 'bar' }}] ）：
//                  1. 将 record 定义为 types.map(XXX)，然后遍历 initDate，拿到第一层的 key，然后调用 map 的 set 方法设置进去
//                     但是这里的 XXX 是必须要填的，填什么呢？没有办法知道。所以这种方案走不通。
//
//                  2. 仍然定义一个 list: types.array(types.model(XXX))，这里的 XXX 可以通过 deep 遍历 initData 来手动构造一个 model 出来
//                     但是有一个问题，就是在面对数组的时候，没有办法保证数组里的每一个元素的数据结构都是一样的。
//                     比如 users: [ { name: '1', age: 40 }, { name: '2', car: 'none' } ]
//                     如果 users 里面的所有元素的数据结构是一样的（都只有 name 和 age 这两个字段）
//                     那么我们可以通过遍历得到 types 为 types.array(types.model({ name: types.string, age: types.number }))
//                     但实际上这是很难的，数组里的元素很容易会有多了一个字段或者少了一个字段的情况。（如上面的就多了 car 字段，少了 age 字段）
//                     所以只有先求出数组所有元素的字段的最大集合，然后将共有的设置为必须，将非共有的都设置为 types.maybe()，这样才不会报错
//                     types.array(types.model({ name: types.string, age: types.maybe(types.number), car: types.maybe(types.string) }))
//                     这似乎是理论上看起来还可行的方案。。。不过也太复杂了，还是算了 ：）
var ExportDoniTable = function ExportDoniTable(props) {
    var recordMobxType = props.recordMobxType;
    var Component = useMemo(function () {
        var tableId = Math.random().toString(36).slice(2);
        var rowKey = props.rowKey || 'id';
        var TableComponent = createDoniTable(tableId, recordMobxType, rowKey);
        return TableComponent;
    }, []);
    return jsx(Component, __assign({}, props), void 0);
};
var NEED_FILTER = '__doniTableNeedFilter';
var getSafeMobxValue = function (value) { return typeof value === 'object' ? getSnapshot(value) : value; };
var DoniTable = observer(function DoniTable(props) {
    var initData = props.initData, loading = props.loading, className = props.className, scroll = props.scroll, tableId = props.tableId, rowKey = props.rowKey, columns = props.columns, actionRef = props.actionRef, pagination = props.pagination; props.toolbar; props.expandable; props.components;
    var cacheScroll = useMemo(function () { return scroll; }, []);
    var cachePagination = useMemo(function () { return (__assign({ defaultPageSize: 10 }, pagination)); }, []);
    var tableProps = {
        tableId: tableId,
        rowKey: rowKey,
        columns: columns,
        actionRef: actionRef,
        scroll: cacheScroll,
        pagination: cachePagination,
    };
    var paginationProps = {
        pagination: cachePagination,
    };
    var initDataRef = useRef(initData);
    useEffect(function () {
        initDataRef.current = initData;
        if (!loading) {
            window.dispatchEvent(new CustomEvent("doni_table_init_".concat(tableId), { detail: initData }));
        }
    }, [initData, loading]);
    var _a = props.scroll || {}, scrollX = _a.x, scrollY = _a.y;
    var style = useMemo(function () {
        var style = { overflowX: 'hidden', overflowY: 'hidden' };
        if (scrollX) {
            style.overflowX = 'auto';
        }
        if (scrollY) {
            style.overflowY = 'auto';
            style.maxHeight = typeof scrollY === 'number' ? scrollY + 'px' : scrollY;
        }
        return style;
    }, [scrollX, scrollY]);
    // console.log('DoniTable render');
    return (jsxs(Fragment, { children: [jsxs("div", __assign({ style: style, className: classNames([
                    'doni-table-wrap',
                    className,
                ]) }, { children: [jsx(DetectTableInfo, { columns: props.columns }, void 0), jsx(DoniTableInner, __assign({}, tableProps), void 0), loading && jsx(Spin, { className: 'doni-table-loading-spin' }, void 0)] }), void 0), pagination !== false && jsx(DoniTablePagination, __assign({}, paginationProps), void 0)] }, void 0));
});
var createDoniTable = function (tableId, recordMobxType, rowKey) {
    var getListModel = function () {
        var _a;
        return types.array(types.compose(recordMobxType, types.model((_a = {},
            _a[NEED_FILTER] = types.optional(types.boolean, true),
            _a))));
    };
    var DoniTableRootModel = types
        .model({
        // Q: 假设目前表格是分页的，一共有两页，第一页有一条数据，第二页有两条数据，每一页都只有两列。初始时，在第一页。
        //    目前的表格组件，都面临下面的问题。假设第一页的数据是 { c1: 'foo', c2: 'bar1' }，第二页的数据也是 { c1: 'foo', c2: 'bar2' }
        //    那么，当我们从第 1 页切换到第 2 页的时候，表格的第一行涉及到的组件会重新渲染，即，我们提供的 column.render 方法会被重新执行
        //    但是这实际并不是我们期望的。我们期望的是：
        //          1. c1 涉及的组件不会 re-render（column.render 不被执行，因为 c1 列的值并没有发生变化，仍然是 'foo'）
        //          2. c2 涉及的组件会 re-render（column.render 被执行，因为 c2 列的值发生了变化，从 'bar1' 变成了 'bar2'）
        //
        // 这个问题的根本原因在于，第 1 页切换到第 2 页的时候，第一行背后对应的数据**的引用**发生了变化。
        // 所以为了解决这个问题，Table 内置了两种不同模式的数据流方案：
        //
        // ******** 方案一：displayList + list 模式（针对有分页的 Table，对应 'pagination' 这种 listMode）***********
        // 界面上展示的表格的数据来源是 displayList，displayList 的长度始终等于一页表格的展示条数，且里面的数据**的引用始终不变**。
        // 而真实的数据为 list，当有数据需要更新的时候，先更新 list，然后**同步**给 displayList(不改变引用，只改变引用里的值）。
        //
        // ******** 方案二：单一 list 模式（针对没有分页的 Table，对应 'scroll' 这种 listMode）*********
        // 和常规的方案差不多，只是会有一个 NEED_FILTER 的 flag 来阻止组件被卸载。
        listMode: types.enumeration('ListMode', ['scroll', 'pagination']),
        displayList: getListModel(),
        list: getListModel(),
        currentPage: types.number,
        pageSize: types.number,
        headSizes: types.array(types.model({
            width: types.number,
        })),
    })
        .volatile(function (self) { return ({
        doniTableAction: DoniTableActionMobxType,
    }); })
        .actions(function (self) {
        var actions = {
            initList: function (dataSource, pageSize) {
                // 先 deep clone 一下，以便表格里所有对表格数据的操作能够完全被 DoniTable 接管
                var list = JSON.parse(JSON.stringify(dataSource));
                self.listMode = typeof pageSize === 'undefined' ? 'scroll' : 'pagination';
                self.list = list;
                if (self.listMode === 'pagination') {
                    var displayList = JSON.parse(JSON.stringify(dataSource.slice(0, pageSize)));
                    self.displayList = displayList;
                }
                self.pageSize = pageSize || Infinity;
                actions.setCurrentPage(1, self.pageSize);
            },
            setRowValueByFunc: function (rowId, func) {
                var rowModel = self.list.find(function (item) { return item[rowKey] === rowId; });
                if (!rowModel) {
                    throw Error("Can't find rowId('".concat(rowId, "') in the data you pass into table."));
                }
                func(rowModel);
                // 修改 list 后，同步给 displayList
                if (self.listMode === 'pagination') {
                    var rowDisplayModel_1 = self.displayList.find(function (item) { return item[rowKey] === rowId; });
                    Object.keys(rowModel).forEach(function (key) {
                        var newValue = rowModel[key];
                        var displayValue = rowDisplayModel_1[key];
                        if (newValue !== displayValue) {
                            rowDisplayModel_1[key] = getSafeMobxValue(newValue);
                        }
                    });
                }
            },
            // 从表格的所有 items 中选择出某些 item
            filterRow: function (isNeedFilter, options) {
                if (options === void 0) { options = {}; }
                var _a = options.onlyCurrentPage, onlyCurrentPage = _a === void 0 ? true : _a;
                var newList = [];
                self.list.forEach(function (record, index) {
                    var needFilter;
                    // 如果只是对当前页的数据进行过滤，那么需要 check 一下 index 是否属于当前页
                    if (onlyCurrentPage) {
                        needFilter = (index >= self.pageSize * (self.currentPage - 1) && index < self.pageSize * self.currentPage) && isNeedFilter(record, index);
                    }
                    else {
                        needFilter = isNeedFilter(record, index);
                    }
                    if (needFilter) {
                        record[NEED_FILTER] = true;
                        newList.push(record);
                    }
                    else {
                        record[NEED_FILTER] = false;
                    }
                });
                var finalList = [];
                // 修改 list 后，同步给 displayList
                if (self.listMode === 'pagination') {
                    self.displayList.forEach(function (record, index) {
                        if (index <= newList.length - 1) {
                            Object.keys(record).forEach(function (key) {
                                var newValue = newList[index][key];
                                record[key] = getSafeMobxValue(newValue);
                            });
                            record[NEED_FILTER] = true;
                            finalList.push(record);
                        }
                        else {
                            record[NEED_FILTER] = false;
                        }
                    });
                }
                return finalList;
            },
            // TODO 更改页码后，还需要清除所有已经设置了的 filters 组件（如 FilterDropDown 和 sorter）
            setCurrentPage: function (page, pageSize) {
                self.currentPage = page;
                self.pageSize = pageSize;
                actions.filterRow(function (_, index) { return index >= pageSize * (page - 1) && index < pageSize * page; }, { onlyCurrentPage: false });
            },
            setHeadSizes: function (headSizes) {
                self.headSizes = cast(headSizes);
            },
            getListSnapshot: function () {
                return getSnapshot(self.list);
            },
        };
        self.doniTableAction = {
            // 修改某一行对应的数据
            // rowId 其实就是 item 的 id 字段对应的值
            setRowValue: function (rowId, fieldKey, fieldValue) {
                if (typeof fieldKey === 'function') {
                    var func = fieldKey;
                    actions.setRowValueByFunc(rowId, func);
                }
                else {
                    actions.setRowValueByFunc(rowId, function (rowModel) {
                        rowModel[fieldKey] = fieldValue;
                    });
                }
            },
            filterRow: function (isNeedFilterFunc) { return actions.filterRow(isNeedFilterFunc); },
            // 获取表格当前的数据
            getTableData: function () {
                return actions.getListSnapshot();
            },
        };
        return actions;
    });
    var initialDoniTableRootStoreState = DoniTableRootModel.create({
        listMode: 'scroll',
        displayList: [],
        list: [],
        currentPage: 1,
        pageSize: Infinity,
        headSizes: [],
    });
    return function CreateDoniTable(props) {
        return (jsx(DoniTableRootStoreContext.Provider, __assign({ value: initialDoniTableRootStoreState }, { children: jsx(DoniTable, __assign({}, props, { rowKey: rowKey, tableId: tableId }), void 0) }), void 0));
    };
};
var DoniTableInner = observer(function DoniTableInner(props) {
    var columns = props.columns, actionRef = props.actionRef, scroll = props.scroll, rowKey = props.rowKey, tableId = props.tableId, pagination = props.pagination;
    var doniTableModel = useModel();
    useEffect(function () {
        var onInit = function (_a) {
            var detail = _a.detail;
            doniTableModel.initList(detail, pagination ? pagination.defaultPageSize : undefined);
        };
        window.addEventListener("doni_table_init_".concat(tableId), onInit);
        return function () {
            window.removeEventListener("doni_table_init_".concat(tableId), onInit);
        };
    }, []);
    useEffect(function () {
        if (actionRef) {
            if (typeof actionRef === 'object') {
                actionRef.current = doniTableModel.doniTableAction;
            }
            else if (typeof actionRef === 'function') {
                actionRef(doniTableModel.doniTableAction);
            }
        }
    }, []);
    var style = useMemo(function () {
        var style = {};
        if (scroll === null || scroll === void 0 ? void 0 : scroll.x) {
            style.width = scroll.x + 'px';
        }
        return style;
    }, [scroll === null || scroll === void 0 ? void 0 : scroll.x]);
    var list;
    if (doniTableModel.listMode === 'pagination') {
        list = doniTableModel.displayList.filter(function (record) { return record[NEED_FILTER]; });
    }
    else {
        list = doniTableModel.list.filter(function (record) { return record[NEED_FILTER]; });
    }
    // console.log('DoniTableInner render');
    return (jsxs("table", __assign({ className: 'doni-table', style: style }, { children: [jsx(ColGroup, { columns: columns, scroll: scroll }, void 0), jsx("thead", { children: jsx("tr", { children: columns.map(function (column, index) { return (jsx(HeadItem, { index: index, rowKey: rowKey, column: column, scroll: scroll }, index)); }) }, void 0) }, void 0), jsx("tbody", { children: list.map(function (record, index) { return (jsx(BodyItem, { index: index, rowKey: rowKey, record: record, columns: columns }, index)); }) }, void 0)] }), void 0));
});

var Component = {};

var toggleSelection = function () {
    var selection = document.getSelection();
    if (!selection.rangeCount) {
        return function () { };
    }
    var active = document.activeElement;
    var ranges = [];
    for (var i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i));
    }
    switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
        case 'INPUT':
        case 'TEXTAREA':
            active.blur();
            break;
        default:
            active = null;
            break;
    }
    selection.removeAllRanges();
    return function () {
        selection.type === 'Caret' &&
            selection.removeAllRanges();
        if (!selection.rangeCount) {
            ranges.forEach(function (range) {
                selection.addRange(range);
            });
        }
        active &&
            active.focus();
    };
};

var deselectCurrent = toggleSelection;
var clipboardToIE11Formatting = {
    "text/plain": "Text",
    "text/html": "Url",
    "default": "Text"
};
var defaultMessage = "Copy to clipboard: #{key}, Enter";
function format(message) {
    var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
    return message.replace(/#{\s*key\s*}/g, copyKey);
}
function copy(text, options) {
    var debug, message, reselectPrevious, range, selection, mark, success = false;
    if (!options) {
        options = {};
    }
    debug = options.debug || false;
    try {
        reselectPrevious = deselectCurrent();
        range = document.createRange();
        selection = document.getSelection();
        mark = document.createElement("span");
        mark.textContent = text;
        // reset user styles for span element
        mark.style.all = "unset";
        // prevents scrolling to the end of the page
        mark.style.position = "fixed";
        mark.style.top = 0;
        mark.style.clip = "rect(0, 0, 0, 0)";
        // used to preserve spaces and line breaks
        mark.style.whiteSpace = "pre";
        // do not inherit user-select (it may be `none`)
        mark.style.webkitUserSelect = "text";
        mark.style.MozUserSelect = "text";
        mark.style.msUserSelect = "text";
        mark.style.userSelect = "text";
        mark.addEventListener("copy", function (e) {
            e.stopPropagation();
            if (options.format) {
                e.preventDefault();
                if (typeof e.clipboardData === "undefined") { // IE 11
                    debug && console.warn("unable to use e.clipboardData");
                    debug && console.warn("trying IE specific stuff");
                    window.clipboardData.clearData();
                    var format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"];
                    window.clipboardData.setData(format, text);
                }
                else { // all other browsers
                    e.clipboardData.clearData();
                    e.clipboardData.setData(options.format, text);
                }
            }
            if (options.onCopy) {
                e.preventDefault();
                options.onCopy(e.clipboardData);
            }
        });
        document.body.appendChild(mark);
        range.selectNodeContents(mark);
        selection.addRange(range);
        var successful = document.execCommand("copy");
        if (!successful) {
            throw new Error("copy command was unsuccessful");
        }
        success = true;
    }
    catch (err) {
        debug && console.error("unable to copy using execCommand: ", err);
        debug && console.warn("trying IE specific stuff");
        try {
            window.clipboardData.setData(options.format || "text", text);
            options.onCopy && options.onCopy(window.clipboardData);
            success = true;
        }
        catch (err) {
            debug && console.error("unable to copy using clipboardData: ", err);
            debug && console.error("falling back to prompt");
            message = format("message" in options ? options.message : defaultMessage);
            window.prompt(message, text);
        }
    }
    finally {
        if (selection) {
            if (typeof selection.removeRange == "function") {
                selection.removeRange(range);
            }
            else {
                selection.removeAllRanges();
            }
        }
        if (mark) {
            document.body.removeChild(mark);
        }
        reselectPrevious();
    }
    return success;
}
var copyToClipboard = copy;

Object.defineProperty(Component, "__esModule", {
    value: true
});
Component.CopyToClipboard = void 0;
var _react = _interopRequireDefault(React);
var _copyToClipboard = _interopRequireDefault(copyToClipboard);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) { return typeof obj; };
}
else {
    _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
} return _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
        symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; });
    keys.push.apply(keys, symbols);
} return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
        ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); });
    }
    else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    }
    else {
        ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); });
    }
} return target; }
function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
} }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
        descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
} }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps)
    _defineProperties(Constructor.prototype, protoProps); if (staticProps)
    _defineProperties(Constructor, staticProps); return Constructor; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
} return _assertThisInitialized(self); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _assertThisInitialized(self) { if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
} return self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
} subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass)
    _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }
var CopyToClipboard$2 = 
/*#__PURE__*/
function (_React$PureComponent) {
    _inherits(CopyToClipboard, _React$PureComponent);
    function CopyToClipboard() {
        var _getPrototypeOf2;
        var _this;
        _classCallCheck(this, CopyToClipboard);
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }
        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CopyToClipboard)).call.apply(_getPrototypeOf2, [this].concat(args)));
        _defineProperty(_assertThisInitialized(_this), "onClick", function (event) {
            var _this$props = _this.props, text = _this$props.text, onCopy = _this$props.onCopy, children = _this$props.children, options = _this$props.options;
            var elem = _react["default"].Children.only(children);
            var result = (0, _copyToClipboard["default"])(text, options);
            if (onCopy) {
                onCopy(text, result);
            } // Bypass onClick if it was present
            if (elem && elem.props && typeof elem.props.onClick === 'function') {
                elem.props.onClick(event);
            }
        });
        return _this;
    }
    _createClass(CopyToClipboard, [{
            key: "render",
            value: function render() {
                var _this$props2 = this.props; _this$props2.text; _this$props2.onCopy; _this$props2.options; var children = _this$props2.children, props = _objectWithoutProperties(_this$props2, ["text", "onCopy", "options", "children"]);
                var elem = _react["default"].Children.only(children);
                return _react["default"].cloneElement(elem, _objectSpread({}, props, {
                    onClick: this.onClick
                }));
            }
        }]);
    return CopyToClipboard;
}(_react["default"].PureComponent);
Component.CopyToClipboard = CopyToClipboard$2;
_defineProperty(CopyToClipboard$2, "defaultProps", {
    onCopy: undefined,
    options: undefined
});

var _require = Component, CopyToClipboard$1 = _require.CopyToClipboard;
CopyToClipboard$1.CopyToClipboard = CopyToClipboard$1;
var lib = CopyToClipboard$1;

var CopyToClipboard = function (_a) {
    var text = _a.text, _b = _a.resetDelay, resetDelay = _b === void 0 ? 2000 : _b, restProps = __rest(_a, ["text", "resetDelay"]);
    var _c = useState(false), hasCopy = _c[0], setHasCopy = _c[1];
    var handleOnCopy = useCallback(function () {
        setHasCopy(true);
        setTimeout(function () {
            setHasCopy(false);
        }, resetDelay);
    }, []);
    return (jsx(lib.CopyToClipboard, __assign({ text: text, onCopy: handleOnCopy }, restProps, { children: hasCopy
            ? jsx(CheckOutlined, { style: { color: '#52c41a' } }, void 0)
            : jsx(CopyOutlined, { style: { color: '#1890ff' } }, void 0) }), void 0));
};

var Ellipsis = function (_a) {
    _a.maxLine; var className = _a.className, children = _a.children, restProps = __rest(_a, ["maxLine", "className", "children"]);
    return (jsx("div", __assign({ className: classNames([
            'doni-table-ellipsis',
            className,
        ]) }, restProps, { children: children }), void 0));
};

var FilterDropdown = function (props) {
    var className = props.className, data = props.data, _a = props.dropdownProps, dropdownProps = _a === void 0 ? {} : _a, _b = props.menuProps, menuProps = _b === void 0 ? {} : _b; props.children; var onFinish = props.onFinish, restProps = __rest(props, ["className", "data", "dropdownProps", "menuProps", "children", "onFinish"]);
    var _c = useState(false), dropdownVisible = _c[0], setDropdownVisible = _c[1];
    var _d = useState([]), selectedKeys = _d[0], setSelectedKeys = _d[1];
    var handleMenuSelect = useCallback(function (_a) {
        var selectedKeys = _a.selectedKeys;
        setSelectedKeys(selectedKeys);
    }, []);
    var handleDropdownVisibleChange = useCallback(function (visible) {
        setDropdownVisible(visible);
    }, []);
    var handleClickReset = useCallback(function () {
        setSelectedKeys([]);
    }, []);
    var handleClickSubmit = useCallback(function () {
        onFinish(selectedKeys);
    }, [onFinish, selectedKeys]);
    var _e = menuProps.multiple, multiple = _e === void 0 ? true : _e, restMenuProps = __rest(menuProps, ["multiple"]);
    return (jsx("div", __assign({ className: classNames([
            'doni-filter-dropdown',
            className,
        ]) }, restProps, { children: jsx(Dropdown, __assign({ overlay: (jsxs("div", __assign({ className: 'doni-filter-dropdown-overlay' }, { children: [jsx(Menu, __assign({ multiple: multiple, onSelect: handleMenuSelect, onDeselect: handleMenuSelect, selectedKeys: selectedKeys }, restMenuProps, { children: data.map(function (_a, index) {
                            var text = _a.text, value = _a.value;
                            var key = String(value || index);
                            return (jsxs(Menu.Item, __assign({ className: 'filter-item' }, { children: [jsx(Checkbox, { checked: selectedKeys.includes(key) }, void 0), jsx("span", __assign({ className: 'filter-item-text' }, { children: text }), void 0)] }), key));
                        }) }), void 0), jsxs("div", __assign({ className: 'actions' }, { children: [jsx(Button, __assign({ type: 'link', size: 'small', disabled: selectedKeys.length === 0, onClick: handleClickReset }, { children: "Reset" }), void 0), jsx(Button, __assign({ type: 'primary', size: 'small', onClick: handleClickSubmit }, { children: "Submit" }), void 0)] }), void 0)] }), void 0)), trigger: ['click'], visible: dropdownVisible, onVisibleChange: handleDropdownVisibleChange, placement: 'bottomRight' }, dropdownProps, { children: jsx("span", __assign({ className: 'icon', onClick: function (e) { return e.stopPropagation(); } }, { children: jsx(FilterFilled, {}, void 0) }), void 0) }), void 0) }), void 0));
};

var ModalButton = observer(function ModalButton(props) {
    var button = props.button, children = props.children, className = props.className, modal = props.modal, modalProps = props.modalProps;
    var _a = useState(false), confirmLoading = _a[0], setConfirmLoading = _a[1];
    var handleClickButton = useCallback(function () {
        modal.openModal();
    }, []);
    var handleClickModalOk = useCallback(function () {
        setConfirmLoading(true);
    }, []);
    var handleClickModalCancel = useCallback(function () {
        modal.closeModal();
    }, []);
    return (jsxs(Fragment, { children: [jsx(Button, __assign({ type: 'primary', className: className, onClick: handleClickButton }, { children: button }), void 0), jsx(Modal, __assign({ visible: modal.visible, width: '50%', style: {
                    top: 150,
                }, footer: null, destroyOnClose: true, onOk: handleClickModalOk, onCancel: handleClickModalCancel, confirmLoading: confirmLoading }, modalProps, { children: children }), void 0)] }, void 0));
});

export { BodyUnit as BodyCell, CopyToClipboard, DoniTableActionMobxType, Ellipsis, FilterDropdown, HeadUnit as HeadCell, ModalButton, ExportDoniTable as Table };
