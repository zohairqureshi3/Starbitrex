import React from 'react'
import Select from 'react-select';

var userTypeStatus = [{ label: 'New', value: 1 }, { label: 'Call Back', value: 2 }, { label: 'Follow Up', value: 3 }, { label: 'No Answer', value: 4 }, { label: 'Deposited', value: 5 }, { label: 'Not interested', value: 6 }];


const FilterStatusComponent = ({ filterUserTypeStatus, onFilterStatus }) => (
    <>
        <div className='d-flex user-details-search'>
            {/* <select className='form-control' value={filterStatus}
            onChange={onFilter}>
                <option value={'New'}>New</option>
                <option value={'Call Back'}>Call Back</option>
                <option value={'Follow Up'}>Follow Up</option>
                <option value={'No Answer'}>No Answer</option>
                <option value={'Deposited'}>Deposited</option>
                <option value={'Not Interested'}>Not Interested</option>
            </select> */}
            <Select
                isMulti
                isClearable
                value={filterUserTypeStatus}
                onChange={onFilterStatus}
                options={userTypeStatus}
            />
        </div>
    </>
);

export default FilterStatusComponent