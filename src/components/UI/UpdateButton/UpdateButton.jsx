import React from 'react';
import './UpdateButton.css'

const UpdateButton = ({onClick}) => {
    return (
        <div className="upButMain" title="Редактировать" onClick={onClick}>
            <div className="pencilRotateAndPositionElement">
                <div className="pencilBody">
                    <div className="washingGum"/>
                    <div className="kernel"/>
                </div>
            </div>
        </div>
    );
};

export default UpdateButton;