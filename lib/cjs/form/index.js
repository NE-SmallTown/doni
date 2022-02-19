'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var antd = require('antd');
var mobxReactLite = require('mobx-react-lite');
var mobxStateTree = require('mobx-state-tree');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

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

var DoniFormRootStoreContext = React__default["default"].createContext(null);
DoniFormRootStoreContext.displayName = 'DoniFormRootStoreContext';
function useModel() {
    var store = React.useContext(DoniFormRootStoreContext);
    if (store === null) {
        throw new Error('Store cannot be null, please add a context provider.');
    }
    return store;
}
var DoniFormItemInfoContext = React__default["default"].createContext(null);
DoniFormRootStoreContext.displayName = 'DoniFormItemInfoContext';
function useFormItemInfo() {
    var store = React.useContext(DoniFormItemInfoContext);
    if (store === null) {
        throw new Error('Store cannot be null, please add a context provider.');
    }
    return store;
}

var formItemDelegateProps = [
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
];

var useFinalProps = function (originProps, delegateProps, itemInfo) {
    var doniFormModel = useModel();
    var formItemInfo = itemInfo || useFormItemInfo();
    var finalProps = __assign({}, originProps);
    React.useLayoutEffect(function () {
        delegateProps.forEach(function (key) {
            var propValue = originProps[key];
            if (typeof propValue !== 'undefined' && typeof propValue === 'function') {
                var getPropValueFunc_1 = propValue;
                var dependentFieldsNames_1 = [];
                var getComputedValue_1 = function () {
                    return getPropValueFunc_1(new Proxy({}, {
                        get: function (target, name) {
                            name = name;
                            if (dependentFieldsNames_1.indexOf(name) === -1) {
                                dependentFieldsNames_1.push(name);
                            }
                            return doniFormModel.getFieldValue(name);
                        },
                        set: function (obj, name, value) {
                            throw Error("You should not directly set the value of form field, please use form.setFieldValue instead.");
                        }
                    }));
                };
                var computedValue = getComputedValue_1();
                doniFormModel.setFieldComputeValue(formItemInfo.name, key, computedValue);
                // 获取了依赖哪些字段后监听这些字段
                doniFormModel.onFieldsValueChange(dependentFieldsNames_1, function () {
                    var computedValue = getComputedValue_1();
                    doniFormModel.setFieldComputeValue(formItemInfo.name, key, computedValue);
                });
            }
        });
    }, []);
    delegateProps.forEach(function (key) {
        var _a, _b;
        var propValue = originProps[key];
        if (typeof propValue !== 'undefined') {
            if (typeof propValue === 'function') {
                // 这里好像没有办法让调用 propValue() 返回的值不变组件就不渲染（即便把这里改成一个带参数的 computed，因为带参数的 computed 是不会被 cache 的）
                // https://github.com/mobxjs/mobx-state-tree/discussions/1742
                // 虽然乍一看是很难弄，不过经过我坚持不懈的不抛弃不放弃，想到了这种通过 types.map + onPatch 的方案来实现带缓存的 computed，完美！
                finalProps[key] = (_b = (_a = doniFormModel.fieldsMap.get(formItemInfo.name)) === null || _a === void 0 ? void 0 : _a.computedValueMap.get(key)) === null || _b === void 0 ? void 0 : _b.value;
            }
            else {
                finalProps[key] = propValue;
            }
        }
    });
    return finalProps;
};

var InternalDoniForm = mobxReactLite.observer(function DoniForm(props) {
    var antdFormProps = __rest(props, []);
    var antdForm = antd.Form.useForm()[0];
    var DoniFormRootModel = mobxStateTree.types
        .model({
        fieldsMap: mobxStateTree.types.map(mobxStateTree.types.model({
            // 表单项（Form.item）里的表单组件的值
            value: mobxStateTree.types.union(mobxStateTree.types.string, mobxStateTree.types.number, mobxStateTree.types.boolean, mobxStateTree.types.array(mobxStateTree.types.union(mobxStateTree.types.string, mobxStateTree.types.number, mobxStateTree.types.boolean))),
            // 表单项（Form.item）里的表单组件依赖的别的表单项的值
            computedValueMap: mobxStateTree.types.map(mobxStateTree.types.model({
                value: mobxStateTree.types.union(mobxStateTree.types.string, mobxStateTree.types.number, mobxStateTree.types.boolean, mobxStateTree.types.array(mobxStateTree.types.union(mobxStateTree.types.string, mobxStateTree.types.number, mobxStateTree.types.boolean))),
            })),
        })),
    })
        .volatile(function (self) { return ({
        antdForm: antdForm,
        doniFormAction: {
            getFieldValue: function (name) { },
            setFieldValue: function (setFunc) { },
        },
    }); })
        .actions(function (self) {
        var actions = {
            initField: function (name, value) {
                self.fieldsMap.set(name, {
                    value: value,
                    computedValueMap: {},
                });
            },
            setFieldComputeValue: function (name, prop, value) {
                var field = self.fieldsMap.get(name);
                if (field) {
                    var filedComputedValueMap = field.computedValueMap.get(prop);
                    if (filedComputedValueMap) {
                        filedComputedValueMap.value = value;
                    }
                    else {
                        field.computedValueMap.set(prop, { value: value });
                    }
                }
            },
            getFieldValue: function (name) {
                var field = self.fieldsMap.get(name);
                return field === null || field === void 0 ? void 0 : field.value;
            },
            setFieldValue: function (setFunc) {
                setFunc(new Proxy({}, {
                    get: function (target, name) {
                        return actions.getFieldValue(name);
                    },
                    set: function (obj, name, value) {
                        var _a;
                        var field = self.fieldsMap.get(name);
                        if (field) {
                            field.value = value;
                        }
                        else {
                            self.fieldsMap.set(name, {
                                value: value,
                            });
                        }
                        // 设置完了之后同步给 antd 的 Form
                        self.antdForm.setFieldsValue((_a = {},
                            _a[name] = value,
                            _a));
                        return true;
                    }
                }));
            },
            getAllFields: function () {
                return new Proxy({}, {
                    get: function (target, name) {
                        var field = self.fieldsMap.get(name);
                        return field === null || field === void 0 ? void 0 : field.value;
                    },
                    set: function (obj, name, value) {
                        throw Error("You should not directly set value of form field, please use form.setFieldValue instead.");
                    }
                });
            },
            onFieldsValueChange: function (dependentFieldsNames, callback) {
                mobxStateTree.onPatch(initialDoniFormRootState, function (patch) {
                    var path = patch.path;
                    if (dependentFieldsNames.findIndex(function (fieldName) { return path === "/fieldsMap/".concat(fieldName, "/value"); }) !== -1) {
                        callback();
                    }
                });
            },
        };
        self.doniFormAction = {
            getFieldValue: actions.getFieldValue,
            setFieldValue: actions.setFieldValue,
        };
        return actions;
    });
    var initialDoniFormRootState = React.useMemo(function () { return DoniFormRootModel.create({
        fieldsMap: {},
    }); }, []);
    React.useEffect(function () {
        mobxStateTree.onSnapshot(initialDoniFormRootState, function (snapshot) {
            // console.log("DoniForm Snapshot: ", snapshot);
        });
    }, []);
    return (jsxRuntime.jsx(DoniFormRootStoreContext.Provider, __assign({ value: initialDoniFormRootState }, { children: jsxRuntime.jsx(antd.Form, __assign({ form: antdForm }, antdFormProps), void 0) }), void 0));
});
var DoniFormItem = mobxReactLite.observer(function DoniFormItem(props) {
    var antdFormItemProps = __rest(props, []);
    var doniFormModel = useModel();
    var itemInfo = React.useMemo(function () {
        return {
            name: props.name || "no-name-form-item-".concat(Math.random().toString(36).slice(2)),
        };
    }, []);
    React.useLayoutEffect(function () {
        // 初始化
        doniFormModel.initField(itemInfo.name, '');
    }, []);
    var finalProps = useFinalProps(antdFormItemProps, formItemDelegateProps, itemInfo);
    return (jsxRuntime.jsx(DoniFormItemInfoContext.Provider, __assign({ value: itemInfo }, { children: jsxRuntime.jsx(antd.Form.Item, __assign({}, finalProps), void 0) }), void 0));
});
InternalDoniForm.FormItem = DoniFormItem;
var DoniForm = InternalDoniForm;

var delegateProps = [
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
];
var DoniInput = mobxReactLite.observer(function DoniInput(props) {
    var antdInputProps = __rest(props, []);
    var doniFormModel = useModel();
    var formItemInfo = useFormItemInfo();
    var handleInputChange = React.useCallback(function (e) {
        var newValue = e.target.value;
        doniFormModel.setFieldValue(function (formData) {
            formData[formItemInfo.name] = newValue;
        });
    }, []);
    var finalProps = useFinalProps(antdInputProps, delegateProps);
    console.log("DoniInput\uFF08".concat(formItemInfo.name, "\uFF09 render"));
    return (jsxRuntime.jsx(antd.Input, __assign({}, finalProps, { onChange: handleInputChange }), void 0));
});

var checkboxDelegateProps = [
    'checked',
    'disabled',
    'autoFocus',
    'indeterminate',
];
var DoniCheckBox = mobxReactLite.observer(function DoniCheckBox(props) {
    var antdCheckBoxProps = __rest(props, []);
    var doniFormModel = useModel();
    var formItemInfo = useFormItemInfo();
    var handleCheckedChange = React.useCallback(function (e) {
        var newValue = e.target.checked;
        doniFormModel.setFieldValue(function (formData) {
            formData[formItemInfo.name] = newValue;
        });
    }, []);
    var finalProps = useFinalProps(antdCheckBoxProps, checkboxDelegateProps);
    return (jsxRuntime.jsx(antd.Checkbox, __assign({}, finalProps, { onChange: handleCheckedChange }), void 0));
});
var DoniCheckBoxGroup = mobxReactLite.observer(function DoniCheckBoxGroup(props) {
    var antdCheckBoxGroupProps = __rest(props, []);
    var doniFormModel = useModel();
    var formItemInfo = useFormItemInfo();
    var handleCheckListChange = React.useCallback(function (list) {
        doniFormModel.setFieldValue(function (formData) {
            formData[formItemInfo.name] = list;
        });
    }, []);
    var finalProps = useFinalProps(antdCheckBoxGroupProps, checkboxDelegateProps);
    return (jsxRuntime.jsx(antd.Checkbox.Group, __assign({}, finalProps, { onChange: handleCheckListChange }), void 0));
});
DoniCheckBox.Group = DoniCheckBoxGroup;
var ExportDoniCheckBox = DoniCheckBox;

exports.CheckBox = ExportDoniCheckBox;
exports.Input = DoniInput;
exports["default"] = DoniForm;
exports.formItemDelegateProps = formItemDelegateProps;
