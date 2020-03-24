import React, { Component } from "react";
import { List, Button, Modal, Input } from "antd";
import "./todoList.css";

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      visible: false,
      modalTitle: "",
      modalText: "",
      addVisible: false,
      titleValue: "",
      textValue: "",
      reviseVisible: false,
      reviseTitle: "",
      reviseText: "",
      changeId: "",
      objRevise: { id: "", title: "", content: "" }
    };
  }

  //组件挂载前将localstorage中的数据赋给list
  componentWillMount() {
    this.setState({
      list: JSON.parse(localStorage.getItem("listData"))
    });
  }

  // 弹出框查看列表详情，根据id找到list中该对象，展示在modal中
  showModal(id) {
    var obj = this.state.list.find(function(obj) {
      return obj.id === id;
    });
    this.setState({
      visible: true,
      modalTitle: obj.title,
      modalText: obj.content
    });
  }

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  // 删除
  deleteList(ids) {
    var obj = this.state.list;
    let deleteIndex = obj.findIndex(item => {
      return item.id === ids;
    });
    obj.splice(deleteIndex, 1);
    this.setState({
      list: obj
    });
    localStorage.setItem("listData", JSON.stringify(this.state.list));
  }

  // 添加
  add = () => {
    this.setState({
      addVisible: true
    });
  };

  addhandleCancel = e => {
    this.setState({
      addVisible: false
    });
  };

  //在输入框发生变化的时候修改状态的值
  titleChange = event => {
    if (event && event.target && event.target.value) {
      let avalue = event.target.value;
      this.setState(() => ({ titleValue: avalue }));
    }
  };

  textChange = event => {
    if (event && event.target && event.target.value) {
      let bvalue = event.target.value;
      this.setState(() => ({ textValue: bvalue }));
    }
  };

  //点击确认添加的时候修改list
  addhandleOk = e => {
    if (this.state.titleValue && this.state.textValue) {
      this.setState({
        addVisible: false,
        list: [
          ...this.state.list,
          {
            title: this.state.titleValue,
            content: this.state.textValue,
            id: new Date().getTime()
          }
        ]
      });
      localStorage.setItem("listData", JSON.stringify(this.state.list));
      Modal.destroyAll();
    } else {
      alert("输入不能为空！");
    }
  };

  // 编辑待办事项
  reviseShowModal(id) {
    var obj = this.state.list.find(function(obj) {
      return obj.id === id;
    });
    this.setState({
      reviseVisible: true,
      reviseTitle: obj.title,
      reviseText: obj.content,
      changeId: obj.id,
      objRevise: obj
    });
  }

  //点击确认修改根据id匹配索引替换指定元素
  reviseHandleOk = e => {
    this.setState({
      reviseVisible: false
    });
    let deleteIndex = this.state.list.findIndex(item => {
      return item.id === this.state.changeId;
    });
    let listObj = this.state.list;
    listObj.splice(deleteIndex, 1, this.state.objRevise);
    this.setState({
      list: listObj
    });
    // 将更新后的list重新存入localstorage
    localStorage.setItem("listData", JSON.stringify(this.state.list));
  };

  reviseHandleCancel = e => {
    this.setState({
      reviseVisible: false
    });
  };

  //input变化时把input的value赋值给objRevise对象
  titleRevise = event => {
    if (event && event.target && event.target.value) {
      let avalue = event.target.value;
      let data = Object.assign({}, this.state.objRevise, { title: avalue });
      this.setState(() => ({
        reviseTitle: avalue,
        objRevise: data
      }));
    }
  };
  
  textRevise = event => {
    if (event && event.target && event.target.value) {
      let bvalue = event.target.value;
      let data = Object.assign({}, this.state.objRevise, { content: bvalue });
      this.setState(() => ({
        reviseText: bvalue,
        objRevise: data
      }));
    }
  };

  render() {
    return (
      <div>
        <List
          header={
            <div>
              <h1 className="title">代办事项列表</h1>
              <Button type="primary" onClick={this.add} className="insert">
                添加代办事项
              </Button>
            </div>
          }
          size="small"
          bordered="true"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 5
          }}
          dataSource={this.state.list}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="primary" onClick={() => this.showModal(item.id)}>
                  查看
                </Button>,
                <Button
                  type="primary"
                  onClick={() => this.reviseShowModal(item.id)}
                >
                  编辑
                </Button>,
                <Button type="primary" onClick={() => this.deleteList(item.id)}>
                  删除
                </Button>
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={item.content}
              ></List.Item.Meta>
            </List.Item>
          )}
        ></List>
        <Modal
          cancelText="取消"
          okText="确认"
          width="90%"
          title={this.state.modalTitle}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this.state.modalText}
        </Modal>
        <Modal
          cancelText="取消"
          okText="确认添加"
          width="90%"
          title="添加代办事项"
          visible={this.state.addVisible}
          onOk={this.addhandleOk}
          onCancel={this.addhandleCancel}
        >
          <label htmlFor="titleInput">标题：</label>
          <Input id="titleInput" onChange={event => this.titleChange(event)} />
          <label htmlFor="textInput">内容：</label>

          <Input.TextArea
            id="textInput"
            rows={8}
            onChange={event => this.textChange(event)}
          />
        </Modal>
        <Modal
          cancelText="取消"
          okText="确认"
          width="90%"
          title="编辑代办事项"
          visible={this.state.reviseVisible}
          onOk={this.reviseHandleOk}
          onCancel={this.reviseHandleCancel}
        >
          <label htmlFor="titleInput">标题：</label>
          <Input
            value={this.state.reviseTitle}
            onChange={event => this.titleRevise(event)}
          />
          <label htmlFor="textInput">内容：</label>
          <Input.TextArea
            value={this.state.reviseText}
            rows={8}
            onChange={event => this.textRevise(event)}
          />
        </Modal>
      </div>
    );
  }
}
export default TodoList;
