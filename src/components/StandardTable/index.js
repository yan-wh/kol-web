import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  // static getDerivedStateFromProps(nextProps) {
  //   // clean state
  //   if (nextProps.selectedRows.length === 0) {
  //     const needTotalList = initTotalList(nextProps.columns);
  //     return {
  //       selectedRowKeys: [],
  //       needTotalList,
  //     };
  //   }
  //   return null;
  // }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    // const { selectedRowKeys } = this.state;
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      scroll = { x: 800 },
      onChange,
      size='middle',
      onSelectRow= undefined,
    } = this.props;
    const paginationProps = pagination ? {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      // total: pagination.total || pagination.meta.total || 0,
      // onChange(current, pageSize) {
      //   onChange({ current, pageSize });
      // },
      onShowSizeChange(current, pageSize) {
        onChange({ current, pageSize });
      },
      ...pagination,
      showTotal: total => `总共有 ${total} 条`,
    } : false;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={onSelectRow && rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={scroll}
          size={size}
        />
      </div>
    );
  }
}

export default StandardTable;
