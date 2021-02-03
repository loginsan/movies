import React from 'react';
import { PropTypes}  from 'prop-types';
import { Input } from 'antd';

const SearchField = ({ onChange, value }) => (
  <form className="search-form" action="/">
    <Input placeholder="Type to search…" className="search-field" value={value} onChange={(event) => onChange(event)} />
  </form>
);

SearchField.defaultProps = {
  onChange: () => {},
  value: '',
};

SearchField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default SearchField;