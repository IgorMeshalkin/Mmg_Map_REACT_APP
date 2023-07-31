import React from 'react';
import "./ActionButton.css"

const ActionButton = ({isOpen}) => {
    return (
        <div className={isOpen ? "acbMain" : "acbMain notActive"}>
            <div className="acbHalfButton">
                Меню
            </div>
            <div className="acbHalfButton">
                <div className={isOpen ? "acbArrowContainer" : "acbArrowContainer open"}>
                    <div className="acbArrow"/>
                </div>
            </div>
        </div>
    );
};

export default ActionButton;