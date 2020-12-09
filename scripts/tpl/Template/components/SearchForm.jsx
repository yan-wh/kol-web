import React from 'react';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class Search extends React.Component {
  render() {
    const { onSearch, onReset } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={onSearch}>
        <FormItem label="客户姓名">
          {getFieldDecorator('name')(<Input placeholder="请输入客户姓名" />)}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </FormItem>
        <FormItem>
          <Button onClick={onReset}>重置</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedSearch = Form.create()(Search);

export default WrappedSearch;
