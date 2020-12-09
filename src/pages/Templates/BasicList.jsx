import React, { Component } from 'react'
import { Card, Button, Divider, Popconfirm } from 'antd'
import { connect } from 'dva'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SearchForm from './components/SearchForm.jsx'
import StandardTable from '@/components/StandardTable'
import BasicForm from './BasicForm.jsx'

const mapStateToProps = ({ template, options, loading }) => {
  return {
    template,
    options: options.list,
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
    create: (values, callback) => {
      dispatch({
        type: 'template/create',
        payload: {
          ...values
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
    update: (values, callback) => {
      dispatch({
        type: 'template/update',
        payload: {
          ...values
        },
        callback,
      })
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)

export default class Basic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValues: {},
      modalVisible: false,
      selected: undefined,
    }
  }
  componentDidMount() {
    this.props.fetch()
  }
  saveSearchFormRef = searchFormRef => {
    this.searchFormRef = searchFormRef
  }
  saveBasicFormRef = basicFormRef => {
    this.basicFormRef = basicFormRef
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
  showModal = () => {
    this.setState({ modalVisible: true })
  }
  hideModal = () => {
    this.setState({
      modalVisible: false,
      selected: undefined,
    })
    this.basicFormRef.props.form.resetFields()
  }
  handleCreate = () => {
    const { form } = this.basicFormRef.props
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      console.log('Received values of form: ', values)
      this.props.create(values, () => {
        this.props.fetch()
        this.hideModal
      })
    })
  }
  handleUpdate = () => {
    const { form } = this.basicFormRef.props
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      console.log('Received values of form: ', values)
      this.props.update({
        ...this.state.selected,
        ...values,
      }, () => {
        this.props.fetch()
        this.hideModal()
      })
    })
  }
  render() {
    const { template, options, loading, remove, fetch } = this.props
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
            <a onClick={() => {
              this.setState({
                selected: record,
                modalVisible: true
              })
            }}>
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
            <Button type="primary" icon="plus" onClick={this.showModal}>
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
        <BasicForm
          wrappedComponentRef={this.saveBasicFormRef}
          visible={this.state.modalVisible}
          values={this.state.selected}
          options={options}
          onCancel={this.hideModal}
          onCreate={this.handleCreate}
          onUpdate={this.handleUpdate}
        />
      </PageHeaderWrapper>
    )
  }
}