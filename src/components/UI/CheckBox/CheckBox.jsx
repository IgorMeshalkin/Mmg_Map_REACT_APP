import React, {useEffect, useMemo, useState} from 'react';
import "./CheckBox.css"
const CheckBox = ({value, defaultValue, onChange}) => {
    //состояние чекбокса
    const [isSelected, setIsSelected] = useState(defaultValue)
    //данный чекбокс загружается первый раз?
    const [isFirstLoading, setIsFirstLoading] = useState(true)

    //при нажатии на чекбокс меняет состояние на противоположное
    const click = () => {
        setIsSelected(!isSelected)
    }
    //при каждом изменении состояния передаёт новое состояние родителю
    useEffect(() => {
        if (!isFirstLoading) {
            onChange(isSelected)
        }
        setIsFirstLoading(false)
    }, [isSelected])

    //при каждом изменении value изменяет состояние чекбокса
    useEffect(() => {
        if (!isFirstLoading) {
            setIsSelected(value)
        }
    }, [value])

    return (
        <div className={isSelected ? "cbMain shadow" : "cbMain"} onClick={click}>
            {
                isSelected &&
                <div className="cbMarker">✔</div>
            }
        </div>
    );
};

export default CheckBox;