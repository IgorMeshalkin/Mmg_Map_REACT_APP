import React, {useState} from 'react';
import "./PeriodChanger.css"
import {getFormattedDataWithoutYear, getWeekStringsForDropDown} from "../../utils/otherUsefullFunctions";
import Modal from "../Modals/Modal/Modal";
import DropDownList from "../UI/DropDownList/DropDownList";

const PeriodChanger = ({currentWeek, weeks, setWeeks, years}) => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const setCurrentWeek = (item) => {
        setWeeks([weeks.filter(w => w.NumberInYear === Number.parseInt(item.split(" ")[0]))[0], ...weeks.filter(w => w.NumberInYear !== Number.parseInt(item.split(" ")[0]))])
    }

    return (
        <div className="pchMain" onClick={() => setIsModalOpen(true)}>
            <div className="pchYearAndWeekContainer">
                <div className="pchWeekNumber">{currentWeek.NumberInYear} неделя {currentWeek.Year} года.</div>
                <div>{getFormattedDataWithoutYear(currentWeek.FirstDay)} - {getFormattedDataWithoutYear(currentWeek.EndDay)}</div>
            </div>

            <Modal
                active={isModalOpen}
                setActive={setIsModalOpen}
            >
                <div className="pchMenu">
                    <div className="pchMenuTitle">Выбрать период</div>
                    <div className="pchMenuDropDownsContainer">
                        <div className="pchMenuDropDownContainer">
                            <DropDownList
                                list={years}
                            />
                        </div>
                        <div className="pchMenuDropDownContainer">
                            <DropDownList
                                list={getWeekStringsForDropDown(weeks)}
                                setSelectedItem={(item) => setCurrentWeek(item)}
                            />
                        </div>
                    </div>
                    <div className="pchMenuSubmitButtonContainer">

                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PeriodChanger;