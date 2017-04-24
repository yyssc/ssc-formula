'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _sscRefer = require('ssc-refer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); } // Copy from http://git.yonyou.com/sscplatform/FC/blob/develop/src/containers/setting/Formula.js
// 测试页面 https://fi.yonyoucloud.com/#/setting/test?_k=vrhahl

/**
 * 公式编辑器
 * @param
 * showModal:false,   //是否显示
   title:"提示",    // 标题
   hasClose:true,   // 是否可以关闭
   hasSureFn:'',    // 确认按钮的回调函数
   hasCancelFn:'',  // 取消按钮的回调函数
   hasCancel:false,  // 是否显示取消按钮
   sureTxt:'确定',    // 确认按钮文字
   cancelTxt:'取消'   //取消按钮文字
 *
 */

// import Config from '../../config';


var Formula = function (_React$Component) {
    _inherits(Formula, _React$Component);

    function Formula(props) {
        _classCallCheck(this, Formula);

        var _this2 = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this2.close = function () {
            _this2.setState({ showModal: false });
        };

        _this2.sureFn = function () {
            var that = _this2;
            //begin在此处写逻辑
            var data = document.getElementById('textarea').value; //"formula";
            that.props.backFormula(data);
            //end在此处写逻辑
            that.close();
        };

        _this2.showAlert = function () {
            var _this = _this2;
            _this.setState({
                showModal: true
            }, function () {
                var _dialog = $(".static-modal .modal-dialog");
                var _scrollTop = $(top.document).scrollTop();
                var _marginTop = _scrollTop === 0 ? 30 : _scrollTop;
                _dialog.css({ "margin-top": _marginTop + "px" });
            });

            var eid = _this.props.eid;
            $.get(Config.workechart.metatree, { eid: eid }, function (data) {
                if (!data.success) {
                    return;
                }
                var ret = _this.buildTree(data.data);
                $("#mytree").append(ret);
                $("#mytree").treeview();
                $(".formula-tree-leaf").each(function (i, o) {
                    $(o).click(function () {
                        var text = $(o).find('span').text();
                        _this.insertText(' ' + text + ' ');
                    });
                });
            });
        };

        _this2.insertText = function (str) {
            var obj = document.getElementById('textarea');
            if (document.selection) {
                var sel = document.selection.createRange();
                sel.text = str;
            } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                var startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.value;
                obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
            } else {
                obj.value += str;
            }
        };

        _this2.buildTree = function (datas, parentKey) {
            var ret = '';
            var that = _this2;
            if (parentKey) {
                parentKey = parentKey + '.';
            } else {
                parentKey = '';
            }
            for (var index = 0; index < datas.length; index++) {
                var data = datas[index];
                var code = data['code'];
                var name = data['name'];
                var children = data['children'];

                if (children && children.length > 0) {
                    var childrenStr = that.buildTree(children, parentKey + code);
                    ret = ret + '<li><span class="folder">' + name + '</span> <ul>' + childrenStr + '</ul></li>';
                } else {
                    ret = ret + '<li><span class="formula-tree-leaf"><span class="none">' + parentKey + code + '</span>' + name + '</span></li>';
                }
            }
            return ret;
        };

        props;
        _this2.state = {
            showModal: false,
            title: "公式编辑器",
            cancelTxt: '取消',
            sureTxt: '确定' // 确认按钮文字
        };
        return _this2;
    }

    Formula.prototype.handleChange = function handleChange(item, selected, event) {
        if (selected && selected.length > 0) {
            var that = this;
            var selecteditem = selected[0];
            var _refItem = this.props.refItem;
            that.insertText('getID("' + _refItem + '","' + selecteditem.name + '","' + selecteditem.id + '") ');
        }
    };

    Formula.prototype.renderMenuItemChildren = function renderMenuItemChildren(option, props, index) {
        // 参照的显示 { code name }
        return _react2["default"].createElement(
            'div',
            null,
            _react2["default"].createElement(
                'span',
                null,
                option.code,
                option.name
            )
        );
    };

    Formula.prototype.componentDidMount = function componentDidMount() {};

    Formula.prototype.render = function render() {
        var _this = this;
        var _textArea = this.props.formulaText;
        var _refText = this.props.refText;
        var _refItem = this.props.refItem;
        var defaultSelected = this.props.refSelected ? Object.assign([], [this.props.refSelected]) : [];
        return _react2["default"].createElement(
            _reactBootstrap.Modal,
            { show: _this.state.showModal, onHide: _this.close, className: 'static-modal' },
            _react2["default"].createElement(
                _reactBootstrap.Modal.Header,
                { closeButton: true },
                _react2["default"].createElement(
                    _reactBootstrap.Modal.Title,
                    null,
                    _this.state.title
                )
            ),
            _react2["default"].createElement(
                _reactBootstrap.Modal.Body,
                null,
                _react2["default"].createElement(
                    'textarea',
                    { id: 'textarea', rows: '8', cols: '70',
                        className: 'form-control formula-resizenone' },
                    _textArea
                ),
                _react2["default"].createElement(
                    'ul',
                    { className: 'nav nav-tabs', role: 'tablist' },
                    _react2["default"].createElement(
                        'li',
                        { role: 'presentation', className: 'active' },
                        _react2["default"].createElement(
                            'a',
                            { href: '#home', 'aria-controls': 'home', role: 'tab',
                                'data-toggle': 'tab' },
                            '\u5143\u7D20'
                        )
                    ),
                    _react2["default"].createElement(
                        'li',
                        { role: 'presentation' },
                        _react2["default"].createElement(
                            'a',
                            { href: '#profile', 'aria-controls': 'profile', role: 'tab', 'data-toggle': 'tab' },
                            '\u56FA\u5B9A\u503C'
                        )
                    )
                ),
                _react2["default"].createElement(
                    'div',
                    { className: 'tab-content' },
                    _react2["default"].createElement(
                        'div',
                        { role: 'tabpanel', className: 'tab-pane fade in active', id: 'home' },
                        _react2["default"].createElement('ul', { id: 'mytree', className: 'filetree' })
                    ),
                    _react2["default"].createElement(
                        'div',
                        { role: 'tabpanel', className: 'tab-pane fade', id: 'profile' },
                        _react2["default"].createElement(
                            'div',
                            { className: 'filerefer' },
                            _react2["default"].createElement(_sscRefer.Refers, {
                                emptyLabel: ' ',
                                labelKey: 'name',
                                onChange: _this.handleChange.bind(this, _refItem),
                                placeholder: _refText,
                                referConditions: { "refCode": _refItem, "refType": "table", "displayFields": ["code", "name", "email"] },
                                referDataUrl: _refItem == 'user' ? this.props.config.refer.referDataUserUrl : this.props.config.refer.referDataUrl,
                                referType: 'list',
                                ref: _refItem,
                                defaultSelected: defaultSelected,
                                renderMenuItemChildren: _this.renderMenuItemChildren
                            })
                        )
                    )
                )
            ),
            _react2["default"].createElement(
                _reactBootstrap.Modal.Footer,
                null,
                _react2["default"].createElement(
                    _reactBootstrap.Button,
                    { bsStyle: 'default', onClick: _this.close.bind(this) },
                    _this.state.cancelTxt
                ),
                _react2["default"].createElement(
                    _reactBootstrap.Button,
                    { bsStyle: 'primary', onClick: _this.sureFn.bind(this) },
                    _this.state.sureTxt
                )
            )
        );
    };

    return Formula;
}(_react2["default"].Component);

Formula.propTypes = {
    /**
     * 示例数据
     * ```js
     * {
     *   workechart: {
     *     metatree: 'http://127.0.0.1:8080/ficloud/echart/metatree'
     *   },
     *   refer: {
     *     // refer 其他参照，调用refbase_ctr/queryRefJSON 10.3.14.240
     *     referDataUrl: 'http://10.3.14.240/ficloud/refbase_ctr/queryRefJSON',
     *     // 人员参照API
     *     referDataUserUrl: 'https://fi.yonyoucloud.com/ficloud/refbase_ctr/queryRefUserJSON'
     *   }
     * }
     * ```
     */
    config: _react.PropTypes.object.isRequired
};
exports["default"] = Formula;
module.exports = exports['default'];