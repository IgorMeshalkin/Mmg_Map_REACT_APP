import React from 'react';

//Кнопка выпадающего списка
const DropDownListButton = ({text, isOpen, onClick}) => {
    function action() {
        onClick(text)
    }

    return (
        <div className={isOpen ? 'ddlbMain open' : 'ddlbMain'} onClick={action}>
            {text}
        </div>
    );
};

export default DropDownListButton;