import React, { Component } from 'react';
import { PropTypes}  from 'prop-types';
import { Input } from 'antd';

export default class SearchField extends Component {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
    // console.log('constructor');
  }

  componentDidMount() {
    this.searchRef.current.focus();
    // console.log('did mount');
  }

  render() {
    const { onChange, query } = this.props;
    // console.log('render');
    return (
      <form className="search-form" action="/" onSubmit={(event) => event.preventDefault()}>
        <Input
          placeholder="Type to search…"
          value={query}
          className="search-field"
          onChange={onChange}
          ref={this.searchRef}
          // onFocus={() => console.log('focus')}
          // onBlur={() => console.log('blur')}
        />
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
