import React, { Component } from 'react'
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Radio,
  Select,
  Modal,
} from 'antd'
import { connect } from 'dva'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import FooterToolbar from '@/components/FooterToolbar'

const Option = Select.Option
const confirm = Modal.confirm
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

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

const mapStateToProps = ({ template, options, loading }) => {
  return {
    values: template.detail,
    options: options.list,
    loading: loading.models.template,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    create: (values, callback) => {
      dispatch({
        type: 'template/create',
        payload: {
          ...values
        },
        callback,
      })
    },
    detail: (id, callback) => {
      dispatch({
        type: 'template/detail',
        payload: { id },
        callback,
      })
    },
    update: (values, callback) => {
      dispatch({
        type: 'template/update',
        payload: {
          ...values
        },
        callback,
      })
    },
    clearDetail: () => {
      dispatch({
        type: 'template/clearDetail',
      })
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)

class FormPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isUpdate: false,
    }
  }
  componentDidMount() {
    if (this.props.route.path.match('update')) {
      const { id } = this.props.match.params
      this.setState({ isUpdate: true })
      this.props.detail(id)
    }
  }
  componentWillUnmount() {
    this.props.clearDetail();
  }
  handleSubmit = e => {
    const { form, create, update } = this.props
    const oldValues = this.props.values
    const { isUpdate } = this.state;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        confirm({
          title: '确定提交？',
          onOk() {
            if (isUpdate) {
              update({
                ...oldValues,
                ...values,
              });
            } else {
              create(values, () => { form.resetFields() })
            }
          },
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { values, options, location } = this.props
    const title = location.pathname.match('/update/') ? '编辑客户' : '创建客户'
    const breadcrumbList = [
      {
        title: 'Home',
        href: '/home'
      },
      {
        title: '开发模板',
      },
      {
        title: '高级模板',
        href: '/boilerplate/templates/advanced/list',
      },
      {
        title,
      },
    ]
    return (
      <PageHeaderWrapper hiddenBreadcrumb={false} breadcrumbList={breadcrumbList}>
        <Form onSubmit={this.handleSubmit}>
          <Card title="基本信息" bordered={false}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="姓名">
                  {getFieldDecorator('name', {
                    initialValue: values && values.name,
                    rules: [{ required: true, message: '必填项' }],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="性别">
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
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="教育背景">
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
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="所属行业">
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
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="单位">
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
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="职称/职位">
                  {getFieldDecorator('position', {
                    initialValue: values && values.position,
                    rules: [{ required: true, message: '必填项' }],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <FooterToolbar>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </FooterToolbar>
        </Form>
      </PageHeaderWrapper>
    )
  }
}

const WrappedForm = Form.create()(FormPage)

export default WrappedForm