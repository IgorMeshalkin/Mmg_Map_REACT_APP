import React from 'react';
import "./Input.css"
import LineLoader from "../../Loaders/LineLoader/LineLoader";
import SmallLoader from "../../Loaders/SmallLoader/SmallLoader";

const Input = ({placeholder, string, setString, isLoading, isPassword, isReadOnly}) => {
    return (
        <div className="inpMain">
            {
                isLoading ?
                    <SmallLoader/> :
                    <input className="input"
                           readOnly={isReadOnly}
                           type={isPassword ? "password" : "text"}
                           value={string}
                           placeholder={placeholder}
                           onChange={(event) => {
                               setString(event.target.value)
                           }}
                    />
            }
        </div>
    );
};

export default Input;