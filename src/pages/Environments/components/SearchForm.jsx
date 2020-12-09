import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';

const FormItem = Form.Item;

class Search extends React.Component {
  render() {
    const { onSearch, onReset } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={onSearch}>
        <FormItem label="搜索">
          {getFieldDecorator('keyword')(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="区">
          {getFieldDecorator('region')(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="店铺">
          {getFieldDecorator('shop')(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="收样时间">
          {getFieldDecorator('confirm_date')(<DatePicker />)}
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
