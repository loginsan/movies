import React from 'react';
import { PropTypes}  from 'prop-types';

const SearchField = ({ heading }) => <h1>{heading}</h1>;

SearchField.defaultProps = {
  heading: 'Ready! Set! Action!',
};

SearchField.propTypes = {
  heading: PropTypes.string,
};

export default SearchField;