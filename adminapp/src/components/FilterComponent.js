import React from 'react'

const FilterComponent = ({ filterText, onFilter, onClear }) => (
   <>
      <div className='d-flex user-details-search'>
         <input
            id="search"
            type="text"
            className='form-control'
            placeholder="Search here..."
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
         />
         <button type="button" className='btn btn-default' onClick={onClear}>Clear</button>
      </div>
   </>
);

export default FilterComponent