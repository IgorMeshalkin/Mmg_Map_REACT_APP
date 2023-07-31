import React, {useState} from 'react';
import './RatingBoard.css'
import {getMOsList, getRatingProperties} from "../../utils/MOsDictionary";
import RatingItem from "./RatingItem";
import {logDOM} from "@testing-library/react";

const RatingBoard = ({week, moList, isVisible}) => {
    return (
        <div className={isVisible ? 'rbMain isVisible' : 'rbMain'}>
            <div className="rbHeaderContainer">
                <h1 className="rbTitle">Рейтинг МО по выполнению плана маммографии в рамках диспансеризации населения
                    (%)</h1>
                <div className="rbPropsContainer">
                <span className="rbProp">
                    <span className="rbPropTitle">Неделя:</span>
                    <span className="rbPropValue">{week.NumberInYear}</span>
                </span>
                    <span className="rbProp">
                    <span className="rbPropTitle">Цель недели:</span>
                    <span className="rbPropValue">{week.Target}%</span>
                </span>
                </div>
            </div>
            <div className="rbScrollListContainer">
                {
                    moList
                        .filter(mo => mo.PartialData !== null)
                        .sort((a, b) => b.PartialData.PercentageOfCompletion - a.PartialData.PercentageOfCompletion)
                        .map(i =>
                        <RatingItem
                            key={i.Id}
                            item={i}
                            isSuccessful={i.PartialData.PercentageOfCompletion >= week.Target}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default RatingBoard;