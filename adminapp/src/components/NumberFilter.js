import React from 'react'

const NumberFilter = ({ filterNumber, onFilter }) => (
   <>
      <div >
         <input
            id="search"
            type="tel"
            className='form-control'
            placeholder="Search here..."
            aria-label="Search Input"
            value={filterNumber}
            onChange={onFilter}
         />
      </div>
   </>
);

export default NumberFilter