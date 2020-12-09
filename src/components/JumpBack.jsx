import React, {Component} from 'react';
import {Spin} from 'antd';
import {deleteSession} from '@/utils/utils';
import router from 'umi/router';

class JumpBack extends Component {
	constructor(props) {
		super(props);
	};

	componentDidMount() {
		deleteSession();
		const {match: { url }} = this.props;
		router.push({
			pathname: `${url}/list`,
		});
	};

	render() {

		return (
			<Spin size="large" />
		);
	};
}