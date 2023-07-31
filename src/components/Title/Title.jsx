import React from 'react';
import './Title.css'
import emblem from '../../images/Герб.png'

const Title = () => {
    return (
        <div className="headerContainer">
            <div className="headerBlock">
                <img src={emblem} className="emblem"/>
                <div className="headerText">Маммографический скрининг в Хабаровском крае</div>
            </div>
        </div>
    );
};

export default Title;