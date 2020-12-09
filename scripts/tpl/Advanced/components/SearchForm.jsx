import React from 'react';
import { Form, Input, Button } from 'antd';
import {getSession} from '@/utils/utils';

const FormItem = Form.Item;

class Search extends React.Component {
  render() {
    const { onSearch, onReset } = this.props;
    const { getFieldDecorator } = this.props.form;
    const session = getSession('gene') || {};
    return (
      <Form layout="inline" onSubmit={onSearch}>
        <FormItem label="名称">
          {getFieldDecorator('name', {
            initialValue: session.name,
          })(<Input placeholder="请输入名称" />)}
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
