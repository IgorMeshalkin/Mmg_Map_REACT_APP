import React, {useEffect, useState} from 'react';
import "./MoSelector.css"
import Input from "../../../UI/Input/Input";
import CheckBox from "../../../UI/CheckBox/CheckBox";
import MoAPI from "../../../../API/MoAPI";
import SmallLoader from "../../../Loaders/SmallLoader/SmallLoader";
import DropDownList from "../../../UI/DropDownList/DropDownList";

const MoSelector = ({currentMo, defaultMo, week, selectedMo, setSelectedMo}) => {
    //строка содержащаяся в инпуте для поиска МО по названию
    const [searchString, setSearchString] = useState('')
    //выбрана ли текущая(своя) медицинская организация в качестве выполняющей маммографию
    const [isCurrentMoSelected, setIsCurrentMoSelected] = useState(false)
    //загружается ли список медицинских организаций в настоящий момент
    const [isMoListLoading, setIsMoListLoading] = useState(true)
    //список медицинских организаций для выбора
    const [moList, setMoList] = useState([])

    //при каждом изменении текущей медицинской организации или отчётной недели, список организаций для выбора обновляется
    useEffect(() => {
        setIsMoListLoading(true)
        MoAPI.getAll().then(res => {
            setMoList(res.data)
            if (defaultMo) {
                setSelectedMo(res.data.filter(mo => mo.Id === defaultMo.Id)[0])
            } else {
                setSelectedMo(res.data[0])
            }
        }).catch(() => {
            setMoList([])
        }).finally(() => {
            setIsMoListLoading(false)
        })
    }, [currentMo, week])

    //при выборе медицинской организации ставит её первой в списке (для выпадающего списка)
    useEffect(() => {
        if (selectedMo) {
            setMoList([selectedMo, ...moList.filter(mo => mo.Id !== selectedMo.Id)])
        }
    }, [selectedMo])

    //делает выбранной текущую(свою) медицинскую организацию
    const checkBoxClick = (value) => {
        setIsCurrentMoSelected(value)
        if (value) {
            setSelectedMo(currentMo)
        }
    }

    return (
        <div className="moselMain">
            <div className="moselLine">
                <div className="moselLine rightMargin">
                    <div className={isCurrentMoSelected ? 'moselCurMoShadow active' : 'moselCurMoShadow'}/>
                    <Input
                        string={searchString}
                        setString={setSearchString}
                        placeholder={"Поиск по названию"}
                    />
                </div>
                <div className="moselLine">
                    <CheckBox
                        defaultValue={false}
                        onChange={checkBoxClick}
                    />
                    <div className="moselCheckBoxTitle">Выполняется самостоятельно</div>
                </div>
            </div>
            <br/>
            <div className="moselLine">
                <div className={isCurrentMoSelected ? 'moselCurMoShadow active' : 'moselCurMoShadow'}/>
                {
                    isMoListLoading ?
                        <SmallLoader/> :
                        <>
                            {
                                moList &&
                                <DropDownList
                                    list={moList
                                        .filter(mo => mo.Name.toLowerCase().includes(searchString.toLowerCase()))
                                        .map((mo) => {
                                            return mo.Name
                                        })}
                                    setSelectedItem={(item) => setSelectedMo(moList.filter(mo => mo.Name === item)[0])}
                                    outCloseHandler={isCurrentMoSelected}
                                />
                            }
                        </>
                }
            </div>
        </div>
    );
};

export default MoSelector;