import React, { Component } from 'react';
import { Card, Button, Table, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from './components/SearchForm.jsx';
import StandardTable from '@/components/StandardTable';

const mapStateToProps = ({ environment, loading }) => {
  return {
    environment,
    loading: loading.models.environment,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetch: (params, callback) => {
      dispatch({
        type: 'environment/fetch',
        payload: {
          ...params,
        },
        callback,
      });
    },
    remove: (id, callback) => {
      dispatch({
        type: 'environment/remove',
        payload: { id },
        callback,
      });
    },
  };
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class Advanced extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValues: {},
    };
  }
  componentDidMount() {
    this.props.fetch();
  }
  saveSearchFormRef = searchFormRef => {
    this.searchFormRef = searchFormRef;
  };
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.searchFormRef.props;
    form.validateFields((err, values) => {
      if (err) return;
      console.log('Received values of form: ', values);
      if (values.confirm_date) {
        values.confirm_date = values.confirm_date.format('YYYY-MM-DD');
      }
      this.setState({
        searchValues: values,
      });
      this.props.fetch(values);
    });
  };
  handleReset = () => {
    const { form } = this.searchFormRef.props;
    form.resetFields();
    this.setState({
      searchValues: {},
    });
    this.props.fetch();
  };
  handleStandardTableChange = pagination => {
    const { searchValues } = this.state;
    const params = {
      ...searchValues,
      page: pagination.current,
      page_size: pagination.pageSize,
    };
    this.props.fetch(params);
  };

  // ID  Name  Entrez Id Alias chrom Grch37_start  Grch37_end  Drug  Disease Ref Urls  Variant Evidence
  render() {
    const { environment, loading, remove, fetch } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '店信息',
        dataIndex: 'company.name',
        key: 'name',
      },
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        // : text => (text == 0 ? '-' : text),
        align: 'center',
      },
      // {
      //   title: '样本编号',
      //   dataIndex: 'alias',
      //   key: 'alias',
      //   align: 'left',
      // },
      {
        title: '位置',
        dataIndex: 'position',
        key: 'position',
        align: 'left',
      },
      {
        title: '收样时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'right',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        // : text => (text == 0 ? '-' : text),
        align: 'right',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => router.push(`/ncov/environments/update/${record.id}`)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除？"
              onConfirm={() => {
                remove(record.id, fetch);
              }}
              okText="删除"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderWrapper hiddenBreadcrumb={false}>
        <Card bordered={false}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <SearchForm
              wrappedComponentRef={this.saveSearchFormRef}
              onSearch={this.handleSearch}
              onReset={this.handleReset}
            />
            <Button
              type="primary"
              icon="plus"
              onClick={() => router.push('/ncov/environments/create')}
            >
              新增
            </Button>
          </div>
          <StandardTable
            columns={columns}
            loading={loading}
            data={environment.data}
            rowKey="id"
            onChange={this.handleStandardTableChange}
            scroll={{ x: 0 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
