import React, { Component } from 'react'
import { Card, Button, Table, Divider, Popconfirm } from 'antd';
import { connect } from 'dva'
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SearchForm from './components/SearchForm.jsx'
import StandardTable from '@/components/StandardTable'

const mapStateToProps = ({ template, loading }) => {
  return {
    template,
    loading: loading.models.template,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetch: (params, callback) => {
      dispatch({
        type: 'template/fetch',
        payload: {
          ...params
        },
        callback,
      })
    },
    remove: (id, callback) => {
      dispatch({
        type: 'template/remove',
        payload: { id },
        callback,
      })
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)

export default class Advanced extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValues: {},
    }
  }
  componentDidMount() {
    this.props.fetch()
  }
  saveSearchFormRef = searchFormRef => {
    this.searchFormRef = searchFormRef
  }
  handleSearch = e => {
    e.preventDefault()
    const { form } = this.searchFormRef.props
    form.validateFields((err, values) => {
      if (err) return;
      console.log('Received values of form: ', values)
      this.setState({
        searchValues: values
      })
      this.props.fetch(values)
    })
  }
  handleReset = () => {
    const { form } = this.searchFormRef.props
    form.resetFields()
    this.setState({
      searchValues: {},
    })
    this.props.fetch()
  }
  handleStandardTableChange = pagination => {
    const { searchValues } = this.state
    const params = {
      ...searchValues,
      page: pagination.current,
      page_size: pagination.pageSize,
    }
    this.props.fetch(params)
  }
  render() {
    const { template, loading, remove, fetch } = this.props
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render: (text) => text === 1 ? '男' : '女'
      },
      {
        title: '教育背景',
        dataIndex: 'education',
        key: 'education',
      },
      {
        title: '所属行业',
        dataIndex: 'industry',
        key: 'industry',
      },
      {
        title: '职称/职位',
        dataIndex: 'position',
        key: 'position',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => router.push(`/boilerplate/templates/advanced/update/${record.id}`)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除？"
              onConfirm={() => {
                remove(record.id, fetch)
              }}
              okText="删除"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ]
    return (
      <PageHeaderWrapper hiddenBreadcrumb={false}>
        <Card bordered={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <SearchForm
              wrappedComponentRef={this.saveSearchFormRef}
              onSearch={this.handleSearch}
              onReset={this.handleReset}
            />
            <Button type="primary" icon="plus" onClick={() => router.push('/boilerplate/templates/advanced/create')}>
              新增
            </Button>
          </div>
          <StandardTable
            columns={columns}
            loading={loading}
            data={template.data}
            rowKey="id"
            onChange={this.handleStandardTableChange}
            scroll={{ x: 0 }}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}