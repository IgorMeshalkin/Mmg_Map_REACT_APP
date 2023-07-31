import React, {useEffect, useRef} from 'react';
import './RatingBoard.css'

const RatingItem = ({item, isSuccessful}) => {
    const percentLineRef = useRef()
    const percentLineValueRef = useRef()

    useEffect(() => {
        percentLineRef.current.setAttribute("style", "background-color: " + (isSuccessful ? "#6dbc74" : "#E04A4B") + "; width: " + (item.PartialData.PercentageOfCompletion * 0.9) + "%;")
        percentLineValueRef.current.setAttribute("style", "color:" + (isSuccessful ? "#6dbc74" : "#E04A4B") + ";")
    }, [])

    return (
        <div className="riMain">
            <div className="riMOName">
                {item.Name}
            </div>
            <div className="riPercentLineContainer">
                <div className='riPercentLine' ref={percentLineRef}/>
                <div className='riPercentLineValue' ref={percentLineValueRef}>{item.PartialData.PercentageOfCompletion.toFixed(2)}</div>
            </div>
        </div>
    );
};

export default RatingItem;