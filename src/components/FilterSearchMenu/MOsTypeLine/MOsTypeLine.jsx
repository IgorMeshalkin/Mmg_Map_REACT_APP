import React, {useEffect, useRef, useState} from 'react';
import './MOsTypeLine.css'
import {getIcon} from "../../../utils/mapFunctions";
import {getMOsList} from "../../../utils/MOsDictionary";


const MOsTypeLine = ({type, selectedTypes, setSelectedTypes, isSearchLineFocused}) => {
    const inputRef = useRef()

    const [isSelected, setIsSelected] = useState(true)
    const [isFirstRender, setIsFirstRender] = useState(true)

    useEffect(() => {
        if (!isFirstRender) {
            if (isSelected) {
                setSelectedTypes([...selectedTypes, type])
            } else {
                const index = selectedTypes.indexOf(type);
                setSelectedTypes(selectedTypes.filter(t => t !== type));
            }
        }
        setIsFirstRender(false)
    }, [isSelected])

    useEffect(() => {
        if (selectedTypes.filter(t => t === type).length > 0) {
            setIsSelected(true)
            inputRef.current.checked = true
        } else {
            setIsSelected(false)
            inputRef.current.checked = false
        }
    }, [selectedTypes])

    function getCount() {
        let count = getMOsList().filter(mo => mo.type === type).length;
        return "(" + count + ")";
    }

    return (
        <div className={isSearchLineFocused ? 'tlMain' : 'tlMain active'}>
            <img src={getIcon(type)} className="tlIcon"/>
            <div className="tlName">{type}</div>
            <div className="tlCount">{getCount()}</div>
            <input type="checkbox" defaultChecked onChange={() => setIsSelected(!isSelected)} ref={inputRef}
                   className="tlCheckBox"/>
        </div>
    );
};

export default MOsTypeLine;