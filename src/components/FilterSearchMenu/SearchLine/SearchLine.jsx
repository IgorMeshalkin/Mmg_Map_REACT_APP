import React, {useEffect, useRef} from 'react';
import './SearchLine.css'
import magnifier from '../../../images/magnifier.png'

const SearchLine = ({searchLineRef, isFocused, setFocused, setSearchLineText}) => {
    const inputRef = useRef()
    const onFocus = () => setFocused(true)

    function setInputText() {
        setSearchLineText(inputRef.current.value)
    }

    return (
        <div className={isFocused ? 'slMain active' : 'slMain'} ref={searchLineRef}>
            <input type="text" className="slInput" placeholder="Название или адрес..." onFocus={onFocus}
                   onChange={setInputText} ref={inputRef}/>

            <div className="slMagnifierContainer">
                <img src={magnifier} className="slMagnifier"/>
            </div>
        </div>
    );
};

export default SearchLine;