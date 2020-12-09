import React from 'react';
import { connect } from 'dva';
// import { Spin, Alert } from 'antd';
import Loading from '../layouts/Loading';

const App = WrappedComponent => {
  @connect(state => ({
    global: state.global,
    // status: state.status,
  }))
  class Apps extends React.Component {
    componentDidMount() {
      if (localStorage.getItem('token') && this.props.global.menuses.length === 0) {
        this.props.dispatch({
          type: 'global/query',
        });
      } else {
        this.props.dispatch({
          type: 'global/redirect',
          // payload: this.props.global.status,
        });
      }
    }
    
    render() {
      const {menus} = this.props;

      return menus.length === 0 ? (
        <Loading {...this.props} />
      ) : (
        <WrappedComponent {...this.props} menus={menus} />
      );
    }
  }

  return Apps;
};
export default App;
