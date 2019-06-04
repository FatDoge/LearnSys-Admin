import React, { Fragment } from 'react';
import { Card, Button, Table, Modal, Divider, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import withSearchAndPaging from '@/components/withSearchAndPaging';
import Filter from './Filter';
import NoticeForm from './NoticeForm';
import { Link } from 'dva/router';
import { deleteType } from '@/services/type';

@connect(({ type, user }) => ({
  type,
  user
}))
@withSearchAndPaging(Filter, async (props, searchCondition) => {
  console.log(searchCondition)
  const res = {};
  await props.dispatch({
    type: 'type/fetch',
    payload: searchCondition,
    callback: result => {
      res.items = result.items;
      // res.pageBean = result.pageBean;
    },
  });
  return res;
})
export default class List extends React.Component {
  state = {
    visible: false,
    detail: {},
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = payload => {
    console.log(payload)
    this.props.dispatch({
      type: 'type/addType',
      payload,
      callback: () =>
        this.setState(
          {
            visible: false,
          },
          this.props.fetchData
        ),
    });
  };

  handleDelete = async id => {
    const res = await deleteType({id})
    if(res.success) {
      message.success('删除成功')
      this.props.fetchData();
    }
  }

  // 渲染更改税法信息Modal
  renderNoticeModal = () => {
    const { detail } = this.state;
    return (
      <Modal
        title='编辑课程信息'
        visible={this.state.visible}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={null}
      >
        <NoticeForm
          handleCancel={this.handleCancel}
          onSubmit={this.handleSubmit}
          detail={this.state.detail}
        />
      </Modal>
    );
  };

  render() {
    const columns = [
      {
        title: '类别ID',
        dataIndex: 'id',
      },
      {
        title: '类别名称',
        dataIndex: 'typename',
      },
      {
        title: '操作',
        dataIndex: 'handle',
        render: (text, item) => {
          return (
            <Fragment>
              <a onClick={() => this.setState({ visible: true, detail: item })}>
                编辑
              </a>
              <Divider type="vertical"/>
              <Popconfirm
                title="是否删除该类别?"
                onConfirm={()=>this.handleDelete(item.id)}
                okText="是"
                cancelText="否"
              >
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            </Fragment>
            );
          },
        },
      ];
    const { loading, itemsData: items } = this.props;
    return (
      <Card
        title="类别管理"
        extra={
          <Button type="primary" onClick={() => this.setState({ visible: true, detail: {} })}>
            新增
          </Button>
        }
      >
        {this.renderNoticeModal()}
        <Table
          dataSource={items}
          columns={columns}
          loading={loading}
          pagination={false}
          rowKey="id"
          scroll={{ x: 1000, y: 0 }}
        />
      </Card>
    );
  }
}
