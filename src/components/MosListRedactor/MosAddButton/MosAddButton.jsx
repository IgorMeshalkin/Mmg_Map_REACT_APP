import React, {useState} from 'react';
import "./MosAddButton.css"
import CheckBox from "../../UI/CheckBox/CheckBox";

const MosAddButton = ({mo, isSelected, addMo, removeMo}) => {
    //передаёт родителю информацию об установке или снятии флажка с МО
    const changeCheckBoxStatus = (status) => {
        if (status) {
            addMo(mo)
        } else {
            removeMo(mo)
        }
    }

    return (
        <div className="mabMain">
            <div className="mabTextSide">
                {mo.Name}
            </div>
            <div className="mapRadioButtonSide">
                <CheckBox
                    defaultValue={isSelected}
                    onChange={changeCheckBoxStatus}
                />
            </div>
        </div>
    );
};

export default MosAddButton;