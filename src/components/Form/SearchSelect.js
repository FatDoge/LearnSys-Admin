import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

// 是当前目录下 SearchFilter 组件的改写版，采用受控组件模式，能够更好配合 Form 使用
export default class SearchSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = debounce(this.handleSearch, 800);
    this.state = {
      data: this.props.initialOptionData || [], // 初始 option 数组，可用于初始值回显
      fetching: false,
    };
  }

  handleSearch = keyword => {
    this.setState({ data: [], fetching: true }, async () => {
      const res = await this.props.fetch(keyword);

      this.setState({
        data: res,
        fetching: false,
      });
    });
  };

  handleChange = (v, option) => {
    // 如果需要在 Form 中获取完整的 option 对象，
    // 可以重写 getFieldDecorator 的 getValueFromEvent 方法
    this.props.onChange(v, option);
  };

  render() {
    const { fetching, data } = this.state;
    const {
      style,
      disabled,
      placeholder,
      mode = 'default',
      value,
      valueKey, // option 值 的 key
      titleKey, // option title 的 key
      focusSearch = true, // focus 时是否就开始搜素
    } = this.props;

    return (
      <Select
        style={style}
        mode={mode}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : '没有搜索结果'}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        onFocus={focusSearch ? this.handleSearch : null}
        showSearch
        allowClear
      >
        {data.map(d => (
          <Option key={d[valueKey]} value={d[valueKey]}>
            {d[titleKey]}
          </Option>
        ))}
      </Select>
    );
  }
}
