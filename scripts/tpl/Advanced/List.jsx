import React, { Component } from 'react';
import { Card, Button, Table, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from './components/SearchForm.jsx';
import StandardTable from '@/components/StandardTable';
import {deleteSession, getSession, setSession} from '@/utils/utils';

const mapStateToProps = ({ gene, loading }) => {
  return {
    gene,
    loading: loading.models.gene,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetch: (params, callback) => {
      dispatch({
        type: 'gene/fetch',
        payload: {
          ...params,
        },
        callback,
      });
    },
    remove: (id, callback) => {
      dispatch({
        type: 'gene/remove',
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
    const session = getSession('gene') || {};
    this.props.fetch(session);
  }
  saveSearchFormRef = searchFormRef => {
    this.searchFormRef = searchFormRef;
  };
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.searchFormRef.props;
    const {searchValues} = this.state;
    const session = getSession('gene') || {};
    form.validateFields((err, values) => {
      if (err) return;
      console.log('Received values of form: ', values);
      this.setState({
        searchValues: {...session, ...searchValues, ...values},
      });
      setSession('gene', {...session, ...searchValues, ...values});
      this.props.fetch({...session, ...searchValues, ...values});
    });
  };
  handleReset = () => {
    const { form } = this.searchFormRef.props;
    form.resetFields();
    this.setState({
      searchValues: {},
    });
    deleteSession('gene');
    this.props.fetch();
  };
  handleStandardTableChange = pagination => {
    const { searchValues } = this.state;
    const session = getSession('gene') || {};
    const params = {
      ...session,
      ...searchValues,
      page: pagination.current,
      page_size: pagination.pageSize,
    };

    this.setState(() => ({
      searchValues: params,
    }));
    setSession('gene', params)
    this.props.fetch(params);
  };

  // ID  Name  Entrez Id Alias chrom Grch37_start  Grch37_end  Drug  Disease Ref Urls  Variant Evidence
  render() {
    const { gene, loading, remove, fetch } = this.props;
    const session = getSession('gene') || {};
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '基因名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Entrez Id',
        dataIndex: 'entrez_id',
        key: 'entrez_id',
        render: text => (text == 0 ? '-' : text),
        align: 'right',
      },
      {
        title: 'Alias',
        dataIndex: 'alias',
        key: 'alias',
        align: 'left',
      },
      {
        title: 'chrom',
        dataIndex: 'chrom',
        key: 'chrom',
        align: 'right',
      },
      {
        title: 'Grch37_start',
        dataIndex: 'grch37_start',
        key: 'grch37_start',
        render: text => (text == 0 ? '-' : text),
        align: 'right',
      },
      {
        title: 'Grch37_end',
        dataIndex: 'grch37_end',
        key: 'grch37_end',
        render: text => (text == 0 ? '-' : text),
        align: 'right',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => router.push(`/report/setting/genes/update/${record.id}`)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除？"
              onConfirm={() => {
                remove(record.id, () => {fetch(session)});
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
              onClick={() => router.push('/report/setting/genes/create')}
            >
              新增
            </Button>
          </div>
          <StandardTable
            columns={columns}
            loading={loading}
            data={gene.data}
            rowKey="id"
            onChange={this.handleStandardTableChange}
            scroll={{ x: 0 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
