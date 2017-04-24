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
import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
// import Config from '../../config';
import { Refers } from 'ssc-refer';

export default class Formula extends React.Component{
  static propTypes = {
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
    config: PropTypes.object.isRequired
  }
    constructor(props) {
        super(props);
        props;
        this.state = {
            showModal:false,
            title:"公式编辑器",
            cancelTxt:'取消',
            sureTxt:'确定'    // 确认按钮文字
        }
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
        $.get(Config.workechart.metatree,{eid:eid},function (data) {
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
	
	handleChange(item,selected,event){
    	if(selected && selected.length>0){
    		 let that = this;
    	     let selecteditem =selected[0];
    	     let _refItem= this.props.refItem ;
    	     that.insertText(`getID("${_refItem}","${selecteditem.name}","${selecteditem.id}") `);
    	}    		
    }
	
	renderMenuItemChildren(option,props,index) {    // 参照的显示 { code name }
        return (
            <div>
                <span>{option.code}{option.name}</span>
            </div>
        );
    }
	
    componentDidMount() {
    	
    }
    
    render () {
        let _this = this;
        let _textArea = this.props.formulaText;
        let _refText = this.props.refText;
        let _refItem = this.props.refItem;
        let defaultSelected = this.props.refSelected ? Object.assign([], [this.props.refSelected]) : [];
        return (
            <Modal show={_this.state.showModal} onHide={_this.close} className="static-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{_this.state.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea id='textarea' rows="8" cols="70"
                              className="form-control formula-resizenone">{_textArea}</textarea>
                    <ul className="nav nav-tabs" role="tablist">
                        <li role="presentation" className="active"><a href="#home" aria-controls="home" role="tab"
                                                                      data-toggle="tab">元素</a></li>
                        <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">固定值</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane fade in active" id="home">
                            <ul id="mytree" className="filetree">
                            </ul>
                        </div>
                        <div role="tabpanel" className="tab-pane fade" id="profile">
                            <div className="filerefer">
                                <Refers
                                    emptyLabel=' '
                                    labelKey="name"
                                    onChange={_this.handleChange.bind(this,_refItem)}
                                    placeholder={_refText}
                                    referConditions={{"refCode":_refItem,"refType":"table","displayFields":["code","name","email"]}}
                                    referDataUrl={_refItem=='user'? this.props.config.refer.referDataUserUrl: this.props.config.refer.referDataUrl}
                                    referType="list"
                                    ref={_refItem}
                                    defaultSelected={defaultSelected}
                                    renderMenuItemChildren={_this.renderMenuItemChildren}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" onClick={_this.close.bind(this)}>{_this.state.cancelTxt}</Button>
                    <Button bsStyle="primary" onClick={_this.sureFn.bind(this)}>{_this.state.sureTxt}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
