
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Formula from '../src';

class Demo extends Component {
  constructor(props) {
    super(props);
  }
  showFormula() {
    this.refs.formula.showAlert();
  }
  handleDataBack(data) {
    alert(data);
  }
  render(){
    return(
      <div>
        <h1>公式编辑器演示</h1>
        <button
          className="btn btn-default"
          onClick={this.showFormula.bind(this)}
        >
          弹出公式编辑器
        </button>
        <Formula
          config={{
            workechart: {
              metatree: 'http://127.0.0.1:3009/ficloud/echart/metatree'
            },
            refer: {
              // refer 其他参照，调用refbase_ctr/queryRefJSON 10.3.14.240
              referDataUrl: 'http://127.0.0.1:3009/ficloud/refbase_ctr/queryRefJSON',
              // 人员参照API
              referDataUserUrl: 'http://127.0.0.1:3009/ficloud/refbase_ctr/queryRefUserJSON'
            }
          }}
          ref="formula"
          formulaText="abc"
          refItem="dept"
          refText="xxxx"
          eid="fier_bxd"
          backFormula={this.handleDataBack.bind(this)}
        />
      </div>
    )
  }
}

export default Demo;
