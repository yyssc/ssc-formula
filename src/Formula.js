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

var inittree = false;
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
    	inittree = false;
        this.setState({ showModal: false });
    }

    showAlert = (para) =>{
        let _this = this;
        _this.setState({
            showModal: true
        },function () {
            let _dialog = $(".static-modal .modal-dialog");
            let _scrollTop = $(top.document).scrollTop();
            let _marginTop = _scrollTop === 0 ? 30 : _scrollTop;
            _dialog.css({"margin-top":_marginTop+"px"});
            _this.showEnv('1');
        });
    }
    sureFn = () => {
      let that = this;
        //begin在此处写逻辑
        let data = document.getElementById('textarea').value;//"formula";
        let list = that.state.list;
        this.props.backFormula(data,list);
        //end在此处写逻辑
        this.close();
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

    moveEnd = ()   => {
    	var obj = document.getElementById('textarea');
        obj.focus();
        var len = obj.value.length;
        if (document.selection) {
            var sel = obj.createTextRange();
            sel.moveStart('character',len);
            sel.collapse();
            sel.select();
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
            obj.selectionStart = obj.selectionEnd = len;
        }
    }
    
    showEnv = (tid)   => {
    	for(var index=1;index<=2;index++){
    		var obj = $('#env'+index);
    		var title = $('#envtitle'+index);
        	if(!obj.hasClass('none')){
        		obj.addClass('none');
        	}
        	if(tid!=index  ){
        		if(!title.hasClass('btn-default')){
            		title.addClass('btn-default');
            	}
            	if(title.hasClass('btn-primary')){
            		title.removeClass('btn-primary');
            	}
        	}
        	
    	}
    	
    	var obj = $('#env'+tid);
    	if(obj.hasClass('none')){
    		obj.removeClass('none');
    	}
    	var title = $('#envtitle'+tid);
    	if(title.hasClass('btn-default')){
    		title.removeClass('btn-default');
    	}
    	if(!title.hasClass('btn-primary')){
    		title.addClass('btn-primary');
    	}
    	
    	var that = this;
    	
    	if(!inittree ){
    		inittree = true;
    		var eid = this.props.eid ;
    		 $.get(this.props.config.workechart.metatree,{eid:eid},function (data) {
    	            if (!data.success) {
    	                return;
    	            }
    	            var ret =  that.buildTree( data.data );
    	            $("#mytree").append( ret );
    	            $("#mytree").treeview() ;
    	    		$(".formula-tree-leaf").each(function (i, o) {
    	    			$(o).click(function(){ 
    	    				var text =  $(o).find('span').text();
    	               	 	that.insertText( ' '+text +' ');
    	    			});
    	             });
    	            
    			 });
    		 
    	}
    }
    showContent = (tid)   => {
    	for(var index=1;index<=3;index++){
    		var obj = $('#content'+index);
    		var title = $('#title'+index);
        	if(!obj.hasClass('none')){
        		obj.addClass('none');
        	}
        	if(tid!=index  ){
        		if(!title.hasClass('btn-default')){
            		title.addClass('btn-default');
            	}
            	if(title.hasClass('btn-primary')){
            		title.removeClass('btn-primary');
            	}
        	}
        	
    	}
    	
    	var obj = $('#content'+tid);
    	if(obj.hasClass('none')){
    		obj.removeClass('none');
    	}
    	var title = $('#title'+tid);
    	if(title.hasClass('btn-default')){
    		title.removeClass('btn-default');
    	}
    	if(!title.hasClass('btn-primary')){
    		title.addClass('btn-primary');
    	}
    }
    
    buildTree = (datas,parentKey)   => {
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
    componentDidMount() {
    	
    }
    handleChange(item,selected,event){
        // console.log(arguments);
        // console.log(selected[0]);
    	if(selected && selected.length>0){
    		 let that = this;
    	     let selecteditem =selected[0];
    	     let _refItem= this.props.refItem ;
    	     console.log(selecteditem);
    	     this.insertText(`getID("${_refItem}","${selecteditem.name}","${selecteditem.id}") `);
    	}
        		
      }
    render () {
        let _this=this;
        let _textArea= this.props.formulaText ;
        let _refText= this.props.refText ;
        let _refItem= this.props.refItem ;
        let defaultSelected= this.props.refSelected ? Object.assign([],[this.props.refSelected]) : []
        return (
            <Modal show ={this.state.showModal} onHide={this.close} className ="static-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table> 
                    	<tr> 
                    		<td colSpan="2">
                    			<textarea  id = 'textarea'  rows="8" cols="70" className ="formula-resizenone">{_textArea}</textarea>
                    		</td>
                    	 </tr>
                    	 
                    	 <tr>
	        				<td colSpan="2">
		        				<table className="formula-table"> 
				        			<tr>
			        					<td width="50px">  <a id="envtitle1" className="btn  btn-primary"  onClick={_this.showEnv.bind(_this,'1')}>元素</a> </td>
			        					<td width="50px">  <a id="envtitle2"  className="btn btn-default "  onClick={_this.showEnv.bind(_this,'2')}>固定值</a> </td>
			        					<td>  &nbsp; </td>
			        				</tr>
			        				<tr>
			        					
			        					<td colSpan="3" > 
			        						<table className="formula-table-inner"> 
			        						<tr><td>
					        					<div id="env1" className="formula-div">
							        					<ul id="mytree" className="filetree">
						        					    </ul>
			        							</div> 
			        							
			        							<div id="env2" className="formula-div none">
				        							<Refers
				        							  emptyLabel=' '
				        							  labelKey="name"
				        							  onChange={this.handleChange.bind(this,_refItem)}
				        							  placeholder={_refText}
				        							  referConditions={{"refCode":_refItem,"refType":"table","displayFields":["code","name","email"]}}
				        							  referDataUrl={_refItem=='user'
                                  ? this.props.config.refer.referDataUserUrl
                                  : this.props.config.refer.referDataUrl
                                }
				        							  referType="list"
				        							  ref={_refItem}
				        							  defaultSelected={defaultSelected}
				        							/>
			        							</div> 
			        						</td></tr>
			        						</table>
		        						</td>
		        					</tr>
	        					</table>
	        				</td>
	        			 </tr>	
	        			 
                    </table>	 
                    		
                    		
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={_this.close}>{_this.state.cancelTxt}</Button>
                    <Button bsStyle="primary" onClick={_this.sureFn}>{_this.state.sureTxt}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
