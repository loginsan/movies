import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Alert } from 'antd';


export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const {error, errorInfo} = this.state;
    const {children} = this.props;

    if (errorInfo) {
      return (
        <Alert className="alert-box" message="Ошибка" description={`${error && error.toString()}. ${errorInfo.componentStack}`} type="error" showIcon />
      );
    }
    return children;
  }
}

ErrorBoundary.defaultProps = {
  children: ''
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};