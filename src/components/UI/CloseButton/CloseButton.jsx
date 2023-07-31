import React from 'react';
import "./CloseButton.css"

const CloseButton = ({onClick}) => {
    return (
        <div className="cbuttMain" onClick={onClick}>
            <div className="cbuttLeft"/>
            <div className="cbuttRight"/>
        </div>
    );
};

export default CloseButton;