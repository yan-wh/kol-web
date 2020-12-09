import { Modal, Form, Input, Select, Radio, Cascader } from 'antd'

const Option = Select.Option
const RadioGroup = Radio.Group

const units = [
  {
    id: 23,
    name: '上海晶能生物科技有限公司',
  },
  {
    id: 22,
    name: '上海吉凯生物科技股份有限公司',
  },
  {
    id: 21,
    name: '深圳裕策生物科技有限公司',
  },
  {
    id: 20,
    name: '上海美吉生物医药科技有限公司',
  }
]

const FormModal = Form.create()(
  class extends React.Component {
    render() {
      const { visible, values, options, onCancel, onCreate, onUpdate, form } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={visible}
          title="客户信息"
          okText="提交"
          onCancel={onCancel}
          onOk={values ? onUpdate : onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                initialValue: values && values.name,
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="性别">
              {getFieldDecorator('gender', {
                initialValue: values && values.gender,
                rules: [{ required: true, message: '必填项' }],
              })(
                <RadioGroup>
                  <Radio value={1}>男</Radio>
                  <Radio value={0}>女</Radio>
                </RadioGroup>
              )}
            </Form.Item>
            <Form.Item label="教育背景">
              {getFieldDecorator('education', {
                initialValue: values && values.education,
                rules: [{ required: true, message: '必填项' }],
              })(
                <Select placeholder="请选择">
                  {options.education && options.education.map((item) => {
                    return <Option value={item} key={item}>{item}</Option>
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="所属行业">
              {getFieldDecorator('industry', {
                initialValue: values && values.industry,
                rules: [{ required: true, message: '必填项' }],
              })(
                <Select placeholder="请选择">
                  {options.industry && options.industry.map((item) => {
                    return <Option value={item} key={item}>{item}</Option>
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="单位">
              {getFieldDecorator('company_ids', {
                initialValue: values && values.company_ids,
                rules: [{ required: true, message: '必填项' }],
              })(
                <Select mode="multiple" placeholder="请选择">
                  {units.map((item) => {
                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="职称/职位">
              {getFieldDecorator('position', {
                initialValue: values && values.position,
                rules: [{ required: true, message: '必填项' }],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            {/* <Form.Item label="手机号码">
              {getFieldDecorator('phone', {
                initialValue: values && values.phone,
                rules: [
                  { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入正确的手机号码' },
                  { required: true, message: '必填项' }
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="邮箱地址">
              {getFieldDecorator('email', {
                initialValue: values && values.email,
                rules: [
                  { type: 'email', message: '请输入正确的邮箱' },
                  { required: true, message: '必填项' }
                ],
              })(<Input />)}
            </Form.Item> */}
          </Form>
        </Modal>
      );
    }
  },
);

export default FormModal