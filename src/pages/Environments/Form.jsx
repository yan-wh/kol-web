import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  // Radio,
  Select,
  Modal,
  // DatePicker,
  // InputNumber,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import moment from 'moment';
import {company} from '@/pages/CommonModelFunc/company';
import debounce from 'lodash/debounce';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const Option = Select.Option;
const confirm = Modal.confirm;
// const RadioGroup = Radio.Group;

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

// const formSplitItemLayout = {
//   labelCol: {
//     span: 10,
//   },
//   wrapperCol: {
//     span: 14,
//   },
// };

const mapStateToProps = ({ company, environment, options, loading }) => {
  return {
    companyList: company.data.list,
    values: environment.detail,
    options: options.list,
    loading: loading.models.environment,
  };
};
const mapDispatchToProps = dispatch => ({
    create: (values, callback) => {
      dispatch({
        type: 'environment/create',
        payload: {
          ...values,
        },
        callback,
      });
    },
    detail: (id, callback) => {
      dispatch({
        type: 'environment/detail',
        payload: { id },
        callback,
      });
    },
    update: (values, callback) => {
      dispatch({
        type: 'environment/update',
        payload: {
          ...values,
        },
        callback,
      });
    },
    clearDetail: () => {
      dispatch({
        type: 'environment/clearDetail',
      });
    },
    dispatch,
  });

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

    this.search = debounce(this.search, 800);
  }
  componentDidMount() {
    if (this.props.route.path.match('update')) {
      const { id } = this.props.match.params;
      this.setState({ isUpdate: true });
      this.props.detail(id);
    }
    const {dispatch} = this.props;
    company(undefined, dispatch, () => {})
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
        if (typeof values.company_id === 'string') {
          values.company_id = oldvalues.company_id;
        }
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

  search = (values = '') => {
    const {dispatch} = this.props;
    company({name: values}, dispatch, () => {});
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { values, location, companyList } = this.props;
    const title = location.pathname.match('/update/') ? '编辑环境样本' : '创建环境样本';
    const titleType = location.pathname.match('/update/') ? '编辑' : '创建';
    const breadcrumbList = [
      {
        title: 'Home',
        href: '/home',
      },
      {
        title: '新冠检测',
      },
      {
        title: '环境样本',
        href: '/ncov/environments/list',
      },
      {
        title,
      },
    ];
    // console.log(values)
    return (
      <PageHeaderWrapper hiddenBreadcrumb={false} breadcrumbList={breadcrumbList}>
        <Form onSubmit={this.handleSubmit}>
          <Card title={titleType} bordered={false}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="商店">
                  {getFieldDecorator('shop_id', {
                    initialValue: values && values.shop && values.shop.name,
                    rules: [{ required: true, message: '必填项' }],
                  })(
                    <Select
                      placeholder="请选择"
                      showSearch
                      filterOption={false}
                      onSearch={this.search}
                    >
                      {companyList.map(item => {
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
                <Form.Item {...formItemLayout} label="Code">
                  {getFieldDecorator('code', {
                    initialValue: values && values.code,
                    rules: [{ required: true, message: '必填项' }],
                  })(<Input style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item {...formItemLayout} label="地点">
                  {getFieldDecorator('location', {
                    initialValue: values && values.location,
                    rules: [{ required: true, message: '必填项' }],
                  })(<Select
                    placeholder="请选择"
                  >
                    <Option value="门把手">冷库</Option>
                    <Option value="货架">冷柜</Option>
                    <Option value="贴板">工作台</Option>
                    <Option value="其他">其他</Option>
                  </Select>)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item {...formItemLayout} label="位置">
                  {getFieldDecorator('position', {
                    initialValue: values && values.position,
                    rules: [{ required: true, message: '必填项' }],
                  })(<Select
                    placeholder="请选择"
                  >
                    <Option value="门把手">门把手</Option>
                    <Option value="货架">货架</Option>
                    <Option value="贴板">贴板</Option>
                    <Option value="冰柜">冰柜</Option>
                    <Option value="其他">其他</Option>
                  </Select>)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item {...formItemLayout} label="备注">
                  {getFieldDecorator('remark', {
                    initialValue: values && values.remark,
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
