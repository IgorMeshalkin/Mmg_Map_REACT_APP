import React from 'react';
import "./ViewAndDeleteButton.css"

const ViewAndDeleteButton = ({mo, onDeleteClick}) => {
    return (
        <div className="vdbMain">
            <div className="vdbText">{mo.Name}</div>
            <div className="vdbButtonContainer">
                <div className="vdbButtonText" onClick={() => onDeleteClick(mo)}>Удалить</div>
            </div>
        </div>
    );
};

export default ViewAndDeleteButton;