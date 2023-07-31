import React from 'react';
import './SpetialForMapModal.css'
import {setModalActive} from "../../../utils/modalFunctions";

const SpetialForMapModal = ({modalBackgroundRef, modalWindowRef, setModalIsOpen, children}) => {
    return (
        <div ref={modalBackgroundRef} className="background" onClick={() => {
            setModalActive(modalBackgroundRef, modalWindowRef)
            setModalIsOpen(false)
        }}>
            <div ref={modalWindowRef} className="window" onClick={event => event.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default SpetialForMapModal;