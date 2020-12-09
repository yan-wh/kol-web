import React, { Component } from 'react';
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
  DatePicker,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Option = Select.Option;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;

const products = [
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
];

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

const formSplitItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const mapStateToProps = ({ sample, options, loading }) => {
  return {
    values: sample.detail,
    options: options.list,
    loading: loading.models.sample,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    create: (values, callback) => {
      dispatch({
        type: 'sample/create',
        payload: {
          ...values,
        },
        callback,
      });
    },
    detail: (id, callback) => {
      dispatch({
        type: 'sample/detail',
        payload: { id },
        callback,
      });
    },
    update: (values, callback) => {
      dispatch({
        type: 'sample/update',
        payload: {
          ...values,
        },
        callback,
      });
    },
    clearDetail: () => {
      dispatch({
        type: 'sample/clearDetail',
      });
    },
  };
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class FormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdate: false,
    };
  }
  componentDidMount() {
    if (this.props.route.path.match('update')) {
      const { id } = this.props.match.params;
      this.setState({ isUpdate: true });
      this.props.detail(id);
    }
  }
  componentWillUnmount() {
    this.props.clearDetail();
  }
  handleSubmit = e => {
    const { form, create, update } = this.props;
    const oldValues = this.props.values;
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
              create(values, () => {
                form.resetFields();
              });
            }
          },
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { values, options, location } = this.props;
    const title = location.pathname.match('/update/') ? '编辑样本管理' : '创建样本管理';
    const breadcrumbList = [
      {
        title: 'Home',
        href: '/home',
      },
      {
        title: '知识库',
      },
      {
        title: '样本管理管理',
        href: '/sample/samples/list/list',
      },
      {
        title,
      },
    ];
    return (
      <PageHeaderWrapper hiddenBreadcrumb={false} breadcrumbList={breadcrumbList}>
        <Form onSubmit={this.handleSubmit}>
          <Card title="基本信息" bordered={false}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="优惠产品">
                  {getFieldDecorator('product_id', {
                    initialValue: values && values.product_id,
                    rules: [{ required: true, message: '必填项' }],
                  })(
                    <Select placeholder="请选择">
                      {products.map(item => {
                        return (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item {...formItemLayout} label="有效截止日期">
                  {getFieldDecorator('expiry_date', {
                    initialValue: values && moment(values.expiry_date, 'YYYY-MM-DD'),
                    rules: [{ required: true, message: '必填项' }],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item {...formItemLayout} label="优惠价">
                  {getFieldDecorator('sample_price', {
                    initialValue: values && values.sample_price,
                    rules: [{ required: true, message: '必填项' }],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item {...formItemLayout} label="优惠说明">
                  {getFieldDecorator('comments', {
                    initialValue: values && values.comments,
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
    );
  }
}

const WrappedForm = Form.create()(FormPage);

export default WrappedForm;
