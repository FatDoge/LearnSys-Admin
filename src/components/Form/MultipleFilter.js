import React from 'react';
import * as R from 'ramda';
import { Form, Select, Input, Radio, Button, Card, Col, Row, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { findOneInList } from '../../utils/index';
import SearchFilter from './SearchFilter';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class MultipleFilter extends React.Component {
  static defaultProps = {
    filterConditionOptions: [],
    searchSubmit: () => {},
  };
  static propTypes = {
    filterConditionOptions: PropTypes.array,
    searchSubmit: PropTypes.func,
  };
  state = {
    selectedCondition: [], // 已选的搜索条件
    filterCondition: {}, // 当前搜索条件
  };

  handleSelect(value) {
    const { filterConditionOptions } = this.props;
    const filterCondition = findOneInList(filterConditionOptions, 'key', value);
    this.setState({
      filterCondition,
    });
  }

  /**
   * 增加筛选条件
   */
  addCondition() {
    const { selectedCondition, filterCondition } = this.state;

    this.setState({
      selectedCondition: R.union(selectedCondition, [filterCondition]),
    });
  }

  /**
   * 删除已选
   */
  removeCondition(id) {
    const { selectedCondition } = this.state;
    this.setState({
      selectedCondition: selectedCondition.filter((item, index) => {
        return index !== id;
      }),
    });
  }

  /**
   * 搜索
   */
  handleSearch() {
    const { selectedCondition } = this.state;
    const pData = {};
    selectedCondition.forEach(item => {
      pData[item.key] = item.value;
    });
    this.props.searchSubmit(pData);
  }

  /**
   * component为filterSelect时对搜索结果的处理
   */
  handleSearchResult(res) {
    this.setState({
      filterCondition: {
        ...this.state.filterCondition,
        value: res.length ? res[0].key : '',
        valueDesc: res.length ? res[0].label : '',
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { filterConditionOptions } = this.props;
    const { filterCondition, selectedCondition } = this.state;
    const { component, selectOptions = [], key } = filterCondition;
    const that = this;

    return (
      <Row gutter={24} style={{ paddingBottom: 30 }}>
        <Form layout="inline" autoComplete="off">
          <Col span={24}>
            <FormItem label="搜索条件">
              <Select
                onSelect={this.handleSelect.bind(this)}
                style={{ width: 200 }}
                placeholder="请选择搜索条件"
                optionFilterProp="children"
              >
                {filterConditionOptions.map(d => <Option key={d.key}>{d.label}</Option>)}
              </Select>
            </FormItem>
            <FormItem>
              {component === 'input' &&
                getFieldDecorator(key, {
                  onChange(e) {
                    that.setState({
                      filterCondition: {
                        ...filterCondition,
                        value: e.target.value,
                      },
                    });
                  },
                })(<Input placeholder="请输入" />)}
              {component === 'select' &&
                getFieldDecorator(key, {
                  onChange(data) {
                    that.setState({
                      filterCondition: {
                        ...filterCondition,
                        value: data.key,
                        valueDesc: data.label,
                      },
                    });
                  },
                })(
                  <Select
                    style={{ width: 200 }}
                    placeholder="请选择"
                    optionFilterProp="children"
                    labelInValue
                  >
                    {selectOptions.map(d => <Option key={d.value}>{d.label}</Option>)}
                  </Select>
                )}
              {component === 'radio' &&
                getFieldDecorator(key, {
                  onChange(e) {
                    that.setState({
                      filterCondition: {
                        ...filterCondition,
                        value: e.target.value,
                      },
                    });
                  },
                })(
                  <RadioGroup>
                    {selectOptions.map(d => (
                      <Radio value={d.value} key={d.value}>
                        {d.label}
                      </Radio>
                    ))}
                  </RadioGroup>
                )}
              {component === 'date' &&
                getFieldDecorator(key, {
                  onChange(date, dateString) {
                    that.setState({
                      filterCondition: {
                        ...filterCondition,
                        value: moment(dateString).valueOf(),
                        valueDesc: dateString,
                      },
                    });
                  },
                })(<DatePicker showTime format="YYYY-MM-DD" />)}
              {component === 'filterSelect' && (
                <SearchFilter
                  fetch={this.props.fetch}
                  handleSearchResult={this.handleSearchResult.bind(this)}
                />
              )}
            </FormItem>
            <FormItem>
              <Button onClick={this.addCondition.bind(this)}>添加</Button>
            </FormItem>
          </Col>
          <Col span={12} style={{ marginTop: 20 }}>
            <FormItem label="已经选条件">
              <Card style={{ width: 300 }}>
                {selectedCondition.map((d, index) => (
                  /* eslint-disable */
                  <p key={index}>
                    {d.label} = {d.valueDesc || d.value}
                    <span
                      onClick={this.removeCondition.bind(this, index)}
                      type="text"
                      style={{ color: '#1890ff', marginLeft: 10, cursor: 'pointer' }}
                    >
                      删除
                    </span>
                  </p>
                ))}
              </Card>
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.handleSearch.bind(this)}>
                搜索
              </Button>
            </FormItem>
          </Col>
        </Form>
      </Row>
    );
  }
}

export default Form.create()(MultipleFilter);
