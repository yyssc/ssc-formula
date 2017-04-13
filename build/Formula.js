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
function getConfig() {
    var serverUrl = 'https://fi.yonyoucloud.com/ficloud';
    // 本地调试环境不进行auth
    if (process.env.NODE_ENV === 'development') {
        serverUrl = 'http://10.3.14.240/ficloud';
    }
    // var serverUrl = "http://127.0.0.1:8080/ficloud";
    return {
        workechart: {
            metatree: serverUrl + '/echart/metatree'
        },
        refer: {
            referDataUrl: serverUrl + '/refbase_ctr/queryRefJSON', //refer 其他参照，调用refbase_ctr/queryRefJSON 10.3.14.240
            referDataUserUrl: serverUrl + '/refbase_ctr/queryRefUserJSON' //人员参照API
        }
    };
}
var Config = getConfig();


var inittree = false;

var Formula = function (_React$Component) {
    _inherits(Formula, _React$Component);

    function Formula(props) {
        _classCallCheck(this, Formula);

        var _this2 = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this2.close = function () {
            inittree = false;
            _this2.setState({ showModal: false });
        };

        _this2.showAlert = function (para) {
            var _this = _this2;
            _this.setState({
                showModal: true
            }, function () {
                var _dialog = $(".static-modal .modal-dialog");
                var _scrollTop = $(top.document).scrollTop();
                var _marginTop = _scrollTop === 0 ? 30 : _scrollTop;
                _dialog.css({ "margin-top": _marginTop + "px" });
                _this.showEnv('1');
            });
        };

        _this2.sureFn = function () {
            //begin在此处写逻辑
            var data = document.getElementById('textarea').value; //"formula";
            var list = that.state.list;
            _this2.props.backFormula(data, list);
            //end在此处写逻辑
            _this2.close();
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

        _this2.moveEnd = function () {
            var obj = document.getElementById('textarea');
            obj.focus();
            var len = obj.value.length;
            if (document.selection) {
                var sel = obj.createTextRange();
                sel.moveStart('character', len);
                sel.collapse();
                sel.select();
            } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                obj.selectionStart = obj.selectionEnd = len;
            }
        };

        _this2.showEnv = function (tid) {
            for (var index = 1; index <= 2; index++) {
                var obj = $('#env' + index);
                var title = $('#envtitle' + index);
                if (!obj.hasClass('none')) {
                    obj.addClass('none');
                }
                if (tid != index) {
                    if (!title.hasClass('btn-default')) {
                        title.addClass('btn-default');
                    }
                    if (title.hasClass('btn-primary')) {
                        title.removeClass('btn-primary');
                    }
                }
            }

            var obj = $('#env' + tid);
            if (obj.hasClass('none')) {
                obj.removeClass('none');
            }
            var title = $('#envtitle' + tid);
            if (title.hasClass('btn-default')) {
                title.removeClass('btn-default');
            }
            if (!title.hasClass('btn-primary')) {
                title.addClass('btn-primary');
            }

            var that = _this2;

            if (!inittree) {
                inittree = true;
                var eid = _this2.props.eid;
                $.get(Config.workechart.metatree, { eid: eid }, function (data) {
                    if (!data.success) {
                        return;
                    }
                    var ret = that.buildTree(data.data);
                    $("#mytree").append(ret);
                    $("#mytree").treeview();
                    $(".formula-tree-leaf").each(function (i, o) {
                        $(o).click(function () {
                            var text = $(o).find('span').text();
                            that.insertText(' ' + text + ' ');
                        });
                    });
                });
            }
        };

        _this2.showContent = function (tid) {
            for (var index = 1; index <= 3; index++) {
                var obj = $('#content' + index);
                var title = $('#title' + index);
                if (!obj.hasClass('none')) {
                    obj.addClass('none');
                }
                if (tid != index) {
                    if (!title.hasClass('btn-default')) {
                        title.addClass('btn-default');
                    }
                    if (title.hasClass('btn-primary')) {
                        title.removeClass('btn-primary');
                    }
                }
            }

            var obj = $('#content' + tid);
            if (obj.hasClass('none')) {
                obj.removeClass('none');
            }
            var title = $('#title' + tid);
            if (title.hasClass('btn-default')) {
                title.removeClass('btn-default');
            }
            if (!title.hasClass('btn-primary')) {
                title.addClass('btn-primary');
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

    Formula.prototype.componentDidMount = function componentDidMount() {};

    Formula.prototype.handleChange = function handleChange(item, selected, event) {
        // console.log(arguments);
        // console.log(selected[0]);
        if (selected && selected.length > 0) {
            var _that = this;
            var selecteditem = selected[0];
            var _refItem = this.props.refItem;
            console.log(selecteditem);
            this.insertText(" getID('" + _refItem + "','" + selecteditem.name + "','" + selecteditem.id + "') ");
        }
    };

    Formula.prototype.render = function render() {
        var _this = this;
        var _textArea = this.props.formulaText;
        var _refText = this.props.refText;
        var _refItem = this.props.refItem;
        var defaultSelected = this.props.refSelected ? Object.assign([], [this.props.refSelected]) : [];
        return _react2["default"].createElement(
            _reactBootstrap.Modal,
            { show: this.state.showModal, onHide: this.close, className: 'static-modal' },
            _react2["default"].createElement(
                _reactBootstrap.Modal.Header,
                { closeButton: true },
                _react2["default"].createElement(
                    _reactBootstrap.Modal.Title,
                    null,
                    this.state.title
                )
            ),
            _react2["default"].createElement(
                _reactBootstrap.Modal.Body,
                null,
                _react2["default"].createElement(
                    'table',
                    null,
                    _react2["default"].createElement(
                        'tr',
                        null,
                        _react2["default"].createElement(
                            'td',
                            { colSpan: '2' },
                            _react2["default"].createElement(
                                'textarea',
                                { id: 'textarea', rows: '8', cols: '70', className: 'formula-resizenone' },
                                _textArea
                            )
                        )
                    ),
                    _react2["default"].createElement(
                        'tr',
                        null,
                        _react2["default"].createElement(
                            'td',
                            { colSpan: '2' },
                            _react2["default"].createElement(
                                'table',
                                { className: 'formula-table' },
                                _react2["default"].createElement(
                                    'tr',
                                    null,
                                    _react2["default"].createElement(
                                        'td',
                                        { width: '50px' },
                                        '  ',
                                        _react2["default"].createElement(
                                            'a',
                                            { id: 'envtitle1', className: 'btn  btn-primary', onClick: _this.showEnv.bind(_this, '1') },
                                            '\u5143\u7D20'
                                        ),
                                        ' '
                                    ),
                                    _react2["default"].createElement(
                                        'td',
                                        { width: '50px' },
                                        '  ',
                                        _react2["default"].createElement(
                                            'a',
                                            { id: 'envtitle2', className: 'btn btn-default ', onClick: _this.showEnv.bind(_this, '2') },
                                            '\u56FA\u5B9A\u503C'
                                        ),
                                        ' '
                                    ),
                                    _react2["default"].createElement(
                                        'td',
                                        null,
                                        '  \xA0 '
                                    )
                                ),
                                _react2["default"].createElement(
                                    'tr',
                                    null,
                                    _react2["default"].createElement(
                                        'td',
                                        { colSpan: '3' },
                                        _react2["default"].createElement(
                                            'table',
                                            { className: 'formula-table-inner' },
                                            _react2["default"].createElement(
                                                'tr',
                                                null,
                                                _react2["default"].createElement(
                                                    'td',
                                                    null,
                                                    _react2["default"].createElement(
                                                        'div',
                                                        { id: 'env1', className: 'formula-div' },
                                                        _react2["default"].createElement('ul', { id: 'mytree', className: 'filetree' })
                                                    ),
                                                    _react2["default"].createElement(
                                                        'div',
                                                        { id: 'env2', className: 'formula-div none' },
                                                        _react2["default"].createElement(_sscRefer.Refers, {
                                                            emptyLabel: ' ',
                                                            labelKey: 'name',
                                                            onChange: this.handleChange.bind(this, _refItem),
                                                            placeholder: _refText,
                                                            referConditions: { "refCode": _refItem, "refType": "table", "displayFields": ["code", "name", "email"] },
                                                            referDataUrl: _refItem == 'user' ? Config.refer.referDataUserUrl : Config.refer.referDataUrl,
                                                            referType: 'list',
                                                            ref: _refItem,
                                                            defaultSelected: defaultSelected
                                                        })
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            ),
            _react2["default"].createElement(
                _reactBootstrap.Modal.Footer,
                null,
                _react2["default"].createElement(
                    _reactBootstrap.Button,
                    { bsStyle: 'primary', onClick: _this.close },
                    _this.state.cancelTxt
                ),
                _react2["default"].createElement(
                    _reactBootstrap.Button,
                    { bsStyle: 'primary', onClick: _this.sureFn },
                    _this.state.sureTxt
                )
            )
        );
    };

    return Formula;
}(_react2["default"].Component);

exports["default"] = Formula;
module.exports = exports['default'];