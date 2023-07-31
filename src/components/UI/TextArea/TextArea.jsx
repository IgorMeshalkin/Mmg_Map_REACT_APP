import React, {useEffect, useState} from 'react';
import SmallLoader from "../../Loaders/SmallLoader/SmallLoader";
import "./TextArea.css"

const TextArea = ({string, setString, isLoading}) => {
    //количество оставшихся символов
    const [charactersLeft, setCharactersLeft] = useState(500)
    //изменяет родительскую строку и количество оставшихся символов при каждом изменении текста
    const changeText = (text) => {
        setString(text)
        setCharactersLeft(500 - text.length)
    }
    //при изменении родительской строки изменяет количество оставшихся символов
    useEffect(() => {
        setCharactersLeft(500 - string.length)
    }, [string])

    return (
        <div className="textaMain">
            <div className="textaBorder">
                {
                    isLoading ?
                        <SmallLoader/> :
                        <textarea className="textArea"
                                  maxLength='500'
                                  defaultValue={string}
                                  onChange={(event) => {
                                      changeText(event.target.value)
                                  }}
                        />
                }
            </div>
            <div className="textaCharactersLeft">{charactersLeft}</div>
        </div>
    );
};

export default TextArea;