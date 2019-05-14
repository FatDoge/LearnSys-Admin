import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { deleteOneInList } from '../../utils/index';

const { Option } = Select;
@connect()
export default class SearchFilter extends React.Component {
  static defaultProps = {
    handleSearchResult: () => {}, // 对搜索结果的处理
    fetch: () => {}, // 对搜索结果的处理，需要返回格式：{value: xx, label: xx}
    defaultValue: [], // 默认值，格式：{key: xx, label: xx}
    isClear: true, // 是否可以清除
    multiple: false, // 是否可以多选
    disabled: false, // 是否禁用
    placeholder: '关键字搜索',
    style: { width: 200 },
  };

  static propTypes = {
    handleSearchResult: PropTypes.func,
    fetch: PropTypes.func,
    defaultValue: PropTypes.array, // eslint-disable-line
    isClear: PropTypes.bool,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.handleSearch = debounce(this.handleSearch, 800);
    this.state = {
      data: [],
      value: this.props.defaultValue,
      fetching: false,
    };
  }

  handleSearch = async keyword => {
    this.setState({ data: [], fetching: true });
    const res = await this.props.fetch(keyword);

    this.setState({
      data: res,
      fetching: false,
    });
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
      value: this.props.multiple ? [...this.state.value, value] : [value],
      fetching: false,
    });
    this.props.handleSearchResult(this.state.value, this.state.data);
  };

  render() {
    const { fetching, value, data } = this.state;
    const { style, disabled, placeholder } = this.props;

    return (
      <Select
        style={style}
        mode="multiple"
        labelInValue
        showSearch
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : '没有搜索结果'}
        filterOption={false}
        onSearch={this.handleSearch}
        onSelect={this.handleSelect}
        onDeselect={this.handleDelete}
        onFocus={this.handleSearch}
        allowClear
      >
        {data.map(d => <Option key={d.value}>{d.label}</Option>)}
      </Select>
    );
  }
}
