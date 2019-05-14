import React from 'react';
import { Select, Spin } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { deleteOneInList } from '../../utils/index';

const { Option } = Select;
@connect()
export default class SearchFilter extends React.Component {
  static defaultProps = {
    handleSearchResult: () => {}, // 对搜索结果的处理
    fetch: () => {}, // 对搜索结果的处理
    defaultValue: [],
    isClear: true,
  };

  static propTypes = {
    handleSearchResult: PropTypes.func,
    fetch: PropTypes.func,
    defaultValue: PropTypes.array, // eslint-disable-line
    isClear: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: this.props.defaultValue,
      fetching: false,
    };
  }

  handleSearch = async keyword => {
    if (keyword.length === 11) {
      this.setState({ data: [], fetching: true });
      const res = await this.props.fetch(keyword);

      this.setState({
        data: res,
        fetching: false,
      });
    }
  };

  /** 选择专栏 */
  handleDelete = async t => {
    if (this.props.isClear) {
      await this.setState({
        value: deleteOneInList(this.state.value, 'key', t.key),
      });
    }
    this.props.handleSearchResult(this.state.value);
  };

  /** 选择专栏 */
  handleSelect = async value => {
    await this.setState({
      value: [value],
      fetching: false,
    });
    this.props.handleSearchResult(this.state.value, this.state.data);
  };

  render() {
    const { fetching, value, data } = this.state;

    return (
      <Select
        style={{ width: 200 }}
        mode="multiple"
        labelInValue
        value={value}
        placeholder="请输入手机号"
        notFoundContent={fetching ? <Spin size="small" /> : '没有搜索结果'}
        filterOption={false}
        onSearch={this.handleSearch}
        onSelect={this.handleSelect}
        onDeselect={this.handleDelete}
      >
        {data.map(d => <Option key={d.value}>{d.label}</Option>)}
      </Select>
    );
  }
}
