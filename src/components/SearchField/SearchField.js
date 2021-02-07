import React from 'react';
import { PropTypes}  from 'prop-types';
import { Input } from 'antd';

const SearchField = ({ onChange, query }) => (
  <form className="search-form" action="/">
    <Input placeholder="Type to search…" value={query} className="search-field" onChange={(event) => onChange(event)} />
  </form>
);

SearchField.defaultProps = {
  onChange: () => {},
  query: '',
};

SearchField.propTypes = {
  onChange: PropTypes.func,
  query: PropTypes.string,
};

export default SearchField;
