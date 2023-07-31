import React, {useState} from 'react';
import './OpenCloseButton.css'

const OpenCloseButton = ({isOpen, setIsOpen}) => {

    return (
        <div className={isOpen ? 'ocbMain open' : 'ocbMain'}>
            <div className="ocbCircle">
                <div className="orbBackground">
                    <div className={isOpen ? 'orbButtonContainer open' : 'orbButtonContainer'}>
                        <div className={isOpen ? 'triangle open' : 'triangle'} onClick={() => setIsOpen(!isOpen)}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenCloseButton;