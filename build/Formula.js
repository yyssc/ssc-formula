'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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


var Formula = function (_Component) {
  _inherits(Formula, _Component);

  function Formula(props) {
    _classCallCheck(this, Formula);

    var _this2 = _possibleConstructorReturn(this, _Component.call(this, props));

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
      $.get(_this2.props.config.workechart.metatree, { eid: eid }, function (data) {
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

    _this2.state = {
      showModal: false,
      title: '公式编辑器',
      cancelTxt: '取消',
      sureTxt: '确定' // 确认按钮文字
    };
    _this2.handleChange = _this2.handleChange.bind(_this2);
    return _this2;
  }

  Formula.prototype.componentDidMount = function componentDidMount() {};

  Formula.prototype.handleChange = function handleChange(selected, event) {
    if (selected && selected.length > 0) {
      var selectedItem = selected[0];
      var refCode = this.props.refCode;
      this.insertText('getID("' + refCode + '","' + selectedItem.name + '","' + selectedItem.id + '") ');
    }
  };

  /**
   * 参照的显示 { code name }
   * @param  {[type]} option [description]
   * @param  {[type]} props  [description]
   * @param  {[type]} index  [description]
   * @return {[type]}        [description]
   */


  Formula.prototype.renderMenuItemChildren = function renderMenuItemChildren(option, props, index) {
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

  /**
   * {} => [{}]
   * @param  {[type]} selected [description]
   * @return {[type]}          [description]
   */


  Formula.prototype.refersEncode = function refersEncode(selected) {
    return [selected];
  };

  /**
   * [] => null
   * [{}] => {}
   * @param  {[type]} selecteds [description]
   * @return {[type]}           [description]
   */


  Formula.prototype.refersDecode = function refersDecode(selecteds) {
    if (selecteds && selecteds.length > 0) {
      return selecteds[0];
    }
    return null;
  };

  /**
   * 根据是否传入refCode来决定实现显示“固定值”标签页
   * @param {number} eventKey Tab组件的eventKey参数
   */


  Formula.prototype.renderRefers = function renderRefers(eventKey) {
    var _props = this.props,
        refCode = _props.refCode,
        refSelected = _props.refSelected,
        refPlaceholder = _props.refPlaceholder;


    if (refCode === null) {
      return null;
    }

    var filterByFields = ['name', 'code'];
    var referConditions = {
      refCode: refCode,
      refType: 'table',
      displayFields: ['code', 'name', 'email']
    };

    // http://git.yonyou.com/sscplatform/FC/issues/55
    // 郭老师说对于参照实体的应该特殊处理
    // 赵老师给出了特殊处理的方法就是添加`convertcol`参数
    if (refCode === 'entity') {
      referConditions.convertcol = '{name:displayName}';
    }

    return _react2["default"].createElement(
      _reactBootstrap.Tab,
      { eventKey: eventKey, title: '\u56FA\u5B9A\u503C' },
      _react2["default"].createElement(
        'div',
        { className: 'filerefer' },
        _react2["default"].createElement(_sscRefer.Refers, {
          emptyLabel: ' ',
          labelKey: 'name',
          onChange: this.handleChange,
          placeholder: refPlaceholder,
          referConditions: referConditions,
          referDataUrl: refCode === 'user' ? this.props.config.refer.referDataUserUrl : this.props.config.refer.referDataUrl,
          referType: 'list',
          ref: refCode,
          defaultSelected: this.refersEncode(refSelected),
          renderMenuItemChildren: this.renderMenuItemChildren,
          filterBy: filterByFields
        })
      )
    );
  };

  Formula.prototype.render = function render() {
    var _this = this;
    var _textArea = this.props.formulaText;
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
          { id: 'textarea', rows: '8', cols: '70', className: 'form-control formula-resizenone' },
          _textArea
        ),
        _react2["default"].createElement(
          _reactBootstrap.Tabs,
          { defaultActiveKey: 1, id: 'uncontrolled-tab-example' },
          _react2["default"].createElement(
            _reactBootstrap.Tab,
            { eventKey: 1, title: '\u5143\u7D20' },
            _react2["default"].createElement('ul', { id: 'mytree', className: 'filetree' })
          ),
          this.renderRefers(2)
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
}(_react.Component);

exports["default"] = Formula;


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
  config: _propTypes2["default"].object.isRequired,
  /**
   * 参照文本框中的placeholder
   * @type {[type]}
   */
  refPlaceholder: _propTypes2["default"].string,
  /**
   * 如果公式编辑器内需要显示参照，则需要传入这个属性
   * 当refCode为entity的时候有些特殊处理，参照代码实现
   */
  refCode: _propTypes2["default"].string
};

Formula.defaultProps = {
  refPlaceholder: '',
  refCode: null
};
module.exports = exports['default'];