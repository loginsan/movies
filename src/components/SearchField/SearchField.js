import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Input } from 'antd';

export default class SearchField extends Component {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
  }

  componentDidMount() {
    this.searchRef.current.focus();
  }

  render() {
    const { onChange, query } = this.props;
    return (
      <form className="search-form" action="/">
        <Input placeholder="Type to search…" value={query} className="search-field" onChange={(event) => onChange(event)} ref={this.searchRef} />
      </form>
    );
  }
}

SearchField.defaultProps = {
  onChange: () => {},
  query: '',
};

SearchField.propTypes = {
  onChange: PropTypes.func,
  query: PropTypes.string,
};
