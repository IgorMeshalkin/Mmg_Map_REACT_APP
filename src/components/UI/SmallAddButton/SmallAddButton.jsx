import React from 'react';
import "./SmallAddButton.css"
import Arrow from "../Arrow/Arrow";

const SmallAddButton = ({notActiveTitle, activeTitle, onClick, isActive}) => {
    return (
        <div className="sabMain" title={isActive ? activeTitle : notActiveTitle} onClick={onClick}>
            {
                isActive ?
                    <>
                        <div className="sabArrowLine"/>
                        <div className="sabArrow"/>
                    </>:
                    <>
                        <div className="sabLeft"/>
                        <div className="sabRight"/>
                    </>
            }
        </div>
    );
};

export default SmallAddButton;