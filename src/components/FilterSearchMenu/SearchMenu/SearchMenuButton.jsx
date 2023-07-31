import React from 'react';
import './SearchMenu.css'
const SearchMenuButton = ({mo, zoomToMO}) => {
    return (
        <div className="smbMain" onClick={() => zoomToMO(mo)}>
            <div className="smbName">
                {mo.Name}
            </div>
            <div className="smbAddress">
                {mo.Address}
            </div>
        </div>
    );
};

export default SearchMenuButton;