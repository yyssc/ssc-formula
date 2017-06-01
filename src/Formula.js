// Copy from http://git.yonyou.com/sscplatform/FC/blob/develop/src/containers/setting/Formula.js
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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import { Refers } from 'ssc-refer';

export default class Formula extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      title: '公式编辑器',
      cancelTxt: '取消',
      sureTxt: '确定'    // 确认按钮文字
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
  }

    close = () => {
        this.setState({ showModal: false });
    }
	
  sureFn = () => {
      let that = this;
      //begin在此处写逻辑
      let data = document.getElementById('textarea').value;//"formula";
      that.props.backFormula(data);
      //end在此处写逻辑
      that.close();
  }

    showAlert = ( ) => {
        let _this = this;
        _this.setState({
            showModal: true
        },function () {
            let _dialog = $(".static-modal .modal-dialog");
            let _scrollTop = $(top.document).scrollTop();
            let _marginTop = _scrollTop === 0 ? 30 : _scrollTop;
            _dialog.css({"margin-top":_marginTop+"px"});
        });

        var eid = _this.props.eid;
        $.get(this.props.config.workechart.metatree,{eid:eid},function (data) {
            if (!data.success) { return; }
            var ret =  _this.buildTree( data.data );
            $("#mytree").append( ret );
            $("#mytree").treeview() ;
            $(".formula-tree-leaf").each(function (i, o) {
                $(o).click(function(){
                    var text =  $(o).find('span').text();
                    _this.insertText( ' '+text +' ');
                });
            });
        });
    }
    
    insertText = (str)  => {
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
    }
    
    buildTree = (datas,parentKey) => {
    	var ret ='';
    	var that = this;
    	if(parentKey){
    		parentKey = parentKey+'.';
    	}else{
    		parentKey ='';
    	}
    	for(let index=0;index<datas.length;index++){
    		var data = datas[index];
    		var code = data['code'];
    		var name = data['name'];
    		var children = data['children'];
    		
    		if(children && children.length>0){
    			var childrenStr = that.buildTree(children, parentKey+code );
    			ret = ret +'<li><span class="folder">'+name+'</span> <ul>' +childrenStr+'</ul></li>'; 
    		}else{
    			ret = ret + '<li><span class="formula-tree-leaf"><span class="none">'+parentKey+code+'</span>'+name+'</span></li>';
    		}
        }
    	return ret ;
    }

  handleChange(selected, event) {
    if (selected && selected.length > 0) {
      let selectedItem = selected[0];
      let refCode = this.props.refCode ;
      this.insertText(`getID("${refCode}","${selectedItem.name}","${selectedItem.id}") `);
    }    		
  }

  /**
   * 参照的显示 { code name }
   * @param  {[type]} option [description]
   * @param  {[type]} props  [description]
   * @param  {[type]} index  [description]
   * @return {[type]}        [description]
   */
  renderMenuItemChildren(option, props, index) {    
    return (
      <div>
        <span>{option.code}{option.name}</span>
      </div>
    );
  }

  /**
   * {} => [{}]
   * @param  {[type]} selected [description]
   * @return {[type]}          [description]
   */
  refersEncode(selected) {
    return [selected];
  }

  /**
   * [] => null
   * [{}] => {}
   * @param  {[type]} selecteds [description]
   * @return {[type]}           [description]
   */
  refersDecode(selecteds) {
    if (selecteds && selecteds.length > 0) {
      return selecteds[0];
    }
    return null
  }

  /**
   * 根据是否传入refCode来决定实现显示“固定值”标签页
   * @param {number} eventKey Tab组件的eventKey参数
   */
  renderRefers(eventKey) {
    const { refCode, refSelected, refPlaceholder } = this.props;

    if (refCode === null) {
      return null;
    }

    const filterByFields = ['name', 'code'];
    const referConditions = {
      refCode,
      refType: 'table',
      displayFields: ['code', 'name', 'email'],
    };

    // http://git.yonyou.com/sscplatform/FC/issues/55
    // 郭老师说对于参照实体的应该特殊处理
    // 赵老师给出了特殊处理的方法就是添加`convertcol`参数
    if (refCode === 'entity') {
      referConditions.convertcol = '{name:displayName}';
    }

    return (
      <Tab eventKey={eventKey} title="固定值">
        <div className="filerefer">
          <Refers
            emptyLabel=" "
            labelKey="name"
            onChange={this.handleChange}
            placeholder={refPlaceholder}
            referConditions={referConditions}
            referDataUrl={
              refCode === 'user'
                ? this.props.config.refer.referDataUserUrl
                : this.props.config.refer.referDataUrl
            }
            referType="list"
            ref={refCode}
            defaultSelected={this.refersEncode(refSelected)}
            renderMenuItemChildren={this.renderMenuItemChildren}
            filterBy={filterByFields}
          />
        </div>
      </Tab>
    );
  }

  render () {
    let _this = this;
    let _textArea = this.props.formulaText;
    return (
      <Modal show={_this.state.showModal} onHide={_this.close} className="static-modal">
        <Modal.Header closeButton>
          <Modal.Title>{_this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea id='textarea' rows="8" cols="70" className="form-control formula-resizenone">
            {_textArea}
          </textarea>
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
            <Tab eventKey={1} title="元素">
              <ul id="mytree" className="filetree"></ul>
            </Tab>
            {this.renderRefers(2)}
          </Tabs>          
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="default" onClick={_this.close.bind(this)}>{_this.state.cancelTxt}</Button>
          <Button bsStyle="primary" onClick={_this.sureFn.bind(this)}>{_this.state.sureTxt}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

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
  config: PropTypes.object.isRequired,
  /**
   * 参照文本框中的placeholder
   * @type {[type]}
   */
  refPlaceholder: PropTypes.string,
  /**
   * 如果公式编辑器内需要显示参照，则需要传入这个属性
   * 当refCode为entity的时候有些特殊处理，参照代码实现
   */
  refCode: PropTypes.string,
};

Formula.defaultProps = {
  refPlaceholder: '',
  refCode: null,
}
