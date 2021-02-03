import React from 'react';
import { PropTypes}  from 'prop-types';
import { Input } from 'antd';

const SearchField = ({ onChange }) => (
  <form className="search-form" action="/">
    <Input placeholder="Type to search…" className="search-field" onChange={(event) => onChange(event)} />
  </form>
);

SearchField.defaultProps = {
  onChange: () => {},
};

SearchField.propTypes = {
  onChange: PropTypes.func,
};

export default SearchField;
