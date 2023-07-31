import React from 'react';
import './Modal.css'
import CloseButton from "../../UI/CloseButton/CloseButton";

//Модальное окно
const Modal = ({active, setActive, children}) => {
    return (
        <div className={active ? 'background active' : 'background'} onClick={() => setActive(false)}>
            <div className={active ? 'window active' : 'window'} onClick={event => event.stopPropagation()}>
                {children}
                <div className="modCloseButtonContainer">
                    <CloseButton onClick={() => setActive(false)}/>
                </div>
            </div>
        </div>
    );
};

export default Modal;