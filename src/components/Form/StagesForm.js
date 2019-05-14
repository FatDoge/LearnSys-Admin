import React, { Fragment } from 'react';
import _ from 'lodash';
import { Form, Button, Select } from 'antd';
import CustomFormItem from '../../components/Form/CustomFormItem';

const { Option } = Select;

const FormItem = ({ children }) => {
  return <CustomFormItem style={{ marginRight: '10px' }}>{children}</CustomFormItem>;
};

class StagesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeSpecify = (key, value, index) => {
    const [type] = key.split('-');
    const { setFieldsValue, getFieldsValue } = this.props.form;
    const formValues = getFieldsValue();
    const oldStages = formValues.stages || [];
    // const specifyStage = oldStages[index];

    /*
    if (type === 'weekBegin') {
      const newDays =  value * 7 + formValues[`weekDaysBegin-${index}`];
      const { daysEnd = 0 } = specifyStage;

      Object.assign(specifyStage, {
        daysBegin: newDays,
        daysEnd: newDays > daysEnd ? newDays : daysEnd,
      });
    } else if (type === 'weekDaysBegin') {
      const newDays =  formValues[`weekBegin-${index}`] * 7 + value;
      const { daysEnd = 0 } = specifyStage;

      Object.assign(specifyStage, {
        daysBegin: newDays,
        daysEnd: newDays > daysEnd ? newDays : daysEnd,
      });
    } else if (type === 'weekEnd') {
      const newDaysEnd =  value * 7 + formValues[`weekDaysBegin-${index}`];
      const { daysBegin = 0 } = specifyStage;

      Object.assign(specifyStage, {
        daysBegin: newDaysEnd < daysBegin ? newDaysEnd : daysBegin,
        daysEnd: newDaysEnd,
      });
    } else if (type === 'weekDaysEnd') {
      const newDaysEnd =  formValues[`weekEnd-${index}`] * 7 + value;
      const { daysBegin = 0 } = specifyStage;

      Object.assign(specifyStage, {
        daysBegin: newDaysEnd < daysBegin ? newDaysEnd : daysBegin,
        daysEnd: newDaysEnd,
      });
    } else if (type === 'type') {
      oldStages[index] = {
        type: value,
        days: 0,
      };
    }
    */

    if (type === 'type') {
      const initialValue = { 1: 0, 2: 0, 3: 12, 4: 36 }[value];

      oldStages[index] = {
        type: value,
        days: value === 5 ? 2160 : 0,
        daysBegin: initialValue * 30,
        daysEnd: initialValue * 30,
      };
    }

    setFieldsValue({
      stages: oldStages.map(stage => ({ ...stage })),
    });
    setTimeout(() => {
      this.props.handleStages(this.unMergeStages(getFieldsValue()));
    }, 1e2);
  };

  unMergeStages = formValues => {
    const result = [];

    formValues.stages.forEach((stage, index) => {
      const { type } = stage;

      if (type === 0 || type === 5) {
        result.push({
          type,
          days: stage.days,
        });
      } else if (type === 1) {
        const begin = formValues[`weekBegin-${index}`] * 7;
        const end = formValues[`weekEnd-${index}`] * 7;

        for (let days = begin; days <= end; days += 7) {
          result.push({
            type: 1,
            days,
          });
        }
      } else {
        const begin = formValues[`monthBegin-${index}`] * 30;
        const end = formValues[`monthEnd-${index}`] * 30;

        for (let days = begin; days <= end; days += 30) {
          result.push({
            type,
            days,
          });
        }
      }
    });

    return result;
  };

  remove = i => {
    const { setFieldsValue, getFieldValue, getFieldsValue } = this.props.form;
    const a = getFieldValue('stages').filter((item, index) => index !== i);
    setFieldsValue({
      stages: a,
    });
    setTimeout(() => {
      this.props.handleStages(this.unMergeStages(getFieldsValue()));
    }, 1e2);
  };

  addStages = () => {
    const { form: { setFieldsValue, getFieldValue, getFieldsValue } } = this.props;

    setFieldsValue({
      stages: [
        ...getFieldValue('stages'),
        {
          type: 0,
          days: 0,
        },
      ],
    });
    setTimeout(() => {
      this.props.handleStages(this.unMergeStages(getFieldsValue()));
    }, 1e2);
  };

  mergeStages = (stages = []) => {
    // 按类分组
    const groupStages = _.groupBy(stages, e => e.type);
    const groupStagesGen = Object.entries(groupStages);
    const result = [];

    groupStagesGen.forEach(([type, group]) => {
      if (type === '0' || type === '5') return [].push.apply(result, group);

      const step = type === '1' ? 7 : 30;

      if (group.length < 2) {
        return [].push.call(result, {
          type: +type,
          daysBegin: group[0].days,
          daysEnd: group[0].days,
          stageId: group[0].stageId,
        });
      }
      const sortGroup = group.sort((a, b) => a.days - b.days);

      const leftLast = sortGroup.reduce((prev, next) => {
        if (prev.length === 0) return [next];

        const last = prev[prev.length - 1];

        if (next.days - last.days === step) {
          prev.push(next);
          return prev;
        }

        result.push({
          type: +type,
          daysBegin: prev[0].days,
          daysEnd: last.days,
          stageId: true,
        });
        return [next];
      }, []);

      if (leftLast.length > 0) {
        [].push.call(result, {
          type: +type,
          daysBegin: leftLast[0].days,
          daysEnd: leftLast[leftLast.length - 1].days,
          stageId: true,
        });
      }
    });

    return result;
  };

  renderMonthOptions = type => {
    const [begin, end] = { 2: [0, 12], 3: [12, 36], 4: [36, 72] }[type];
    const options = [];

    for (let i = begin; i < end; i += 1) {
      options.push(
        <Option key={i} value={i}>
          {i}个月
        </Option>
      );
    }

    return options;
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      single = false,
      stagesType = [],
    } = this.props;

    const rules = [
      {
        required: true,
        message: '此信息为必填项',
      },
    ];

    getFieldDecorator('stages', { initialValue: this.mergeStages(this.props.stages) });
    const stages = getFieldValue('stages');

    return (
      <Fragment>
        {stages.map((item, index) => (
          // eslint-disable-next-line
          <div key={index} style={{ display: 'flex' }}>
            <FormItem>
              {getFieldDecorator(`type-${index}`, {
                initialValue: item.type,
                rules,
              })(
                <Select
                  disabled={!!item.stageId}
                  style={{ width: 100 }}
                  placeholder="请选择类型"
                  onChange={value => this.changeSpecify(`type-${index}`, value, index)}
                >
                  {stagesType.map(d => (
                    <Option key={d.value} value={d.value}>
                      {d.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            {item.type === 1 && (
              <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '10px' }}>开始</div>
                <FormItem>
                  {getFieldDecorator(`weekBegin-${index}`, {
                    initialValue: Math.floor(item.daysBegin / 7),
                    rules,
                  })(
                    <Select
                      style={{ width: 90 }}
                      onChange={value => this.changeSpecify(`weekBegin-${index}`, value, index)}
                      disabled={!!item.stageId}
                    >
                      {Array.from(new Array(42).keys()).map(d => (
                        <Option key={d} value={d}>
                          {d}周
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                <div style={{ marginRight: '10px' }}>结束</div>
                <FormItem>
                  {getFieldDecorator(`weekEnd-${index}`, {
                    initialValue: Math.floor(item.daysEnd / 7),
                    rules,
                  })(
                    <Select
                      style={{ width: 90 }}
                      onChange={value => this.changeSpecify(`weekEnd-${index}`, value, index)}
                      disabled={!!item.stageId}
                    >
                      {Array.from(new Array(42).keys()).map(d => (
                        <Option key={d} value={d}>
                          {d}周
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
            )}
            {[2, 3, 4].find(e => e === item.type) && (
              <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '10px' }}>开始</div>
                <FormItem>
                  {getFieldDecorator(`monthBegin-${index}`, {
                    initialValue: Math.floor(item.daysBegin / 30),
                    rules,
                  })(
                    <Select
                      style={{ width: 90 }}
                      onChange={value => this.changeSpecify(`monthBegin-${index}`, value, index)}
                      disabled={!!item.stageId}
                    >
                      {this.renderMonthOptions(item.type)}
                    </Select>
                  )}
                </FormItem>
                <div style={{ marginRight: '10px' }}>结束</div>
                <FormItem>
                  {getFieldDecorator(`monthEnd-${index}`, {
                    initialValue: Math.floor(item.daysEnd / 30),
                    rules,
                  })(
                    <Select
                      style={{ width: 90 }}
                      onChange={value => this.changeSpecify(`monthEnd-${index}`, value, index)}
                      disabled={!!item.stageId}
                    >
                      {this.renderMonthOptions(item.type)}
                    </Select>
                  )}
                </FormItem>
              </div>
            )}
            <FormItem style={{ marginLeft: 20 }}>
              <Button type="danger" onClick={() => this.remove(index)} ghost>
                删除
              </Button>
            </FormItem>
          </div>
        ))}
        {(!single || (single && stages.length < 1)) && (
          <FormItem>
            <Button type="primary" onClick={this.addStages}>
              添加阶段
            </Button>
          </FormItem>
        )}
      </Fragment>
    );
  }
}

export default Form.create()(StagesForm);
