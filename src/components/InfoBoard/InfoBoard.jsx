import React from 'react';
import './InfoBoard.css'
import {setModalActive} from "../../utils/modalFunctions";

const InfoBoard = (props) => {
    return (
        <div className="ibContainer">
            <div ref={props.boardRef} className="ibBlock">
                <div ref={props.nameRef} className="ibName"/>
                <div ref={props.addressRef} className="ibAddress"/>

                <div>
                    <span className={props.mo.PartialData ? "ibRegularLine" : "ibHidden"}>План на год: </span>
                    <span className="ibRegularValue" ref={props.planRef}/>
                </div>
                <div>
                    <span className="ibRegularLine">Неделя: </span>
                    <span className="ibRegularValue">{props.currentWeek.NumberInYear}</span>
                </div>
                <div>
                    <span className="ibRegularLine">Цель недели: </span>
                    <span className="ibRegularValue">{props.currentWeek.Target.toFixed(2)}%</span>
                </div>
                <div>
                    <span className={props.mo.PartialData ? "ibRegularLine" : "ibHidden"}>Процент выполнения: </span>
                    <span ref={props.completePercentRef}/>
                </div>

                <div className={props.mo.PartialData ? "ibHidden" : "ibEmptyMessage"}>
                    Сведения о работе организации за данный период отсутствуют
                </div>

                <div className={props.mo.PartialData ? "ibMoreButtonContainer" : "ibHidden"}>
                    <div className="ibMoreButton" ref={props.moreButtonRef} onClick={() => {
                        setModalActive(props.modalBackgroundRef, props.modalWindowRef)
                        props.setModalIsOpen(true)
                    }}>Подробнее
                    </div>
                </div>

                <div className="ibCloseButton" onClick={() => props.boardRef.current.className = 'ibBlock'}>×</div>
            </div>
        </div>
    );
};

export default InfoBoard;