import React, {useEffect, useRef, useState} from 'react';
import './DropDownList.css'
import DropDownOpenCloseButton from "./DropDownOpenCloseButton";
import DropDownListButton from "./DropDownListButton";

//Выпадающий список для формы заполнения данных
const DropDownList = ({list, setSelectedItem, outCloseHandler}) => {
    const leftSideRef = useRef();

    //Открыт ли список в настоящий момент
    const [isOpen, setIsOpen] = useState(false)

    //При каждом открытии/закрытии списка изменяется его размер.
    useEffect(() => {
        if (isOpen) {
            leftSideRef.current.setAttribute("style", "height: " + (list.length * 35) + "px; max-height: 40vh")
        } else {
            leftSideRef.current.setAttribute("style", "height: 35px; max-height: 40vh")
            leftSideRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [isOpen])

    //Открывает/закрывает выпадающий список.
    function openCloseList() {
        setIsOpen(!isOpen)
    }

    //Делает "выбранным" пункт из списка и закрывает лист.
    function selectItem(item) {
        setIsOpen(false)
        setSelectedItem(item)
    }

    //при каждом изменении внешнего состояния отвечающего за закрытие, закрывает выпадающий список
    useEffect(() => {
        setIsOpen(false)
    }, [outCloseHandler])

    return (
        <div className="ddlMain">
            <div className={isOpen ? "ddlLeftSide open" : "ddlLeftSide"} ref={leftSideRef}>
                {
                    list.map(item =>
                        <DropDownListButton
                            key={item}
                            text={item}
                            isOpen={isOpen}
                            onClick={selectItem}
                        />
                    )
                }
            </div>
            <div className="ddlRightSide">
                <DropDownOpenCloseButton
                    onClick={openCloseList}
                    isOpen={isOpen}
                />
            </div>
        </div>
    );
};

export default DropDownList;