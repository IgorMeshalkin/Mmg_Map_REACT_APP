import React, {useContext, useEffect, useState} from 'react';
import "./DataBoard.css"
import YearPlanAPI from "../../API/YearPlanAPI";
import Loader from "../Loaders/Loader/Loader";
import WeekAPI from "../../API/WeekAPI";
import DropDownList from "../UI/DropDownList/DropDownList";
import {getWeekStringsForDropDown, prepareDataForSend, validateDataInputs} from "../../utils/otherUsefullFunctions";
import SmallLoader from "../Loaders/SmallLoader/SmallLoader";
import DataForm from "./DataForm/DataForm";
import DataAPI from "../../API/DataAPI";
import LineLoader from "../Loaders/LineLoader/LineLoader";
import {logDOM} from "@testing-library/react";
import {AuthContext} from "../../context/context";

const DataBoard = ({years, setYears, mos, setMos}) => {
    const {currentUser} = useContext(AuthContext)
    //отчётные недели доступные для текущего года
    const [weeks, setWeeks] = useState([])
    //текущая отчётная неделя
    const [currentWeek, setCurrentWeek] = useState()
    //текущий год (по умолчанию последний из списка)
    const [currentYear, setCurrentYear] = useState(years[0])
    //текущая медицинская организация
    const [currentMo, setCurrentMo] = useState(mos[0])
    //годовые планы доступные для текущей медицинской организации
    const [yearPlans, setYearPlans] = useState([])

    //загружаются ли данные в настоящий момент
    const [isDataLoading, setIsDataLoading] = useState(true)
    //загружаются ли недели в данный момент
    const [isWeeksLoading, setIsWeeksLoading] = useState(true)

    //при каждом изменении текущего года загружаются отчётные недели сортируются в обратном порядке
    useEffect(() => {
        setIsWeeksLoading(true)
        WeekAPI.getAll(currentYear).then(res => {
            const sortedWeeks = res.data.sort((x, y) => {
                if (x.NumberInYear > y.NumberInYear) {
                    return -1
                } else {
                    return 1
                }
            })
            setWeeks(sortedWeeks)
            setCurrentWeek(sortedWeeks[0])
            setIsWeeksLoading(false)
        })
    }, [currentYear])

    //при каждом изменении текущей отчётной недели или медицинской организации загружаются годовые планы
    useEffect(() => {
        setIsDataLoading(true)
        YearPlanAPI.getAll(currentYear, currentMo.Id).then(res => {
            const sortedYearPlans = res.data.sort((x, y) => {
                if (x.Type.Id > y.Type.Id) {
                    return 1
                } else {
                    return -1
                }
            });
            setYearPlans(sortedYearPlans)
        }).catch(() => {
            setYearPlans([])
        }).finally(() => {
            setIsDataLoading(false)
        })
    }, [currentWeek, currentMo])

    //ставит выбранный год первым для отображения в выпадающем списке.
    useEffect(() => {
        setYears([currentYear, ...years.filter(year => year !== currentYear)])
    }, [currentYear])

    //ставит выбранную неделю первой для отображения в выпадающем списке.
    useEffect(() => {
        setWeeks([currentWeek, ...weeks.filter(w => w.Id !== currentWeek.Id)])
    }, [currentWeek])

    //ставит выбранную медицинскую организацию первой для отображения в выпадающем списке.
    useEffect(() => {
        setMos([currentMo, ...mos.filter(mo => mo.Id !== currentMo.Id)])
    }, [currentMo])

    //обрабатывается ли содержимое формы сервером в настоящий момент
    const [isSubmitting, setIsSubmitting] = useState(false)
    //была ли уже предпринята попытка сохранения данных (если да, то демонстрируется сообщение, а не кнопка "Сохранить")
    const [isTriedToSave, setIsTriedToSave] = useState(false)
    //объект хранит информацию о том успешно или нет прошло сохранение на сервере и сообщение для пользователя
    const [submitStatus, setSubmitStatus] = useState({status: false, message: ''})
    // //прошла ли форма валидацию
    // const [isValidated, setIsValidated] = useState(false)

    //объект содержащий данные для сохранения в БД по типу 1 (с прикреплённым населением)
    const [dataForSaveType1, setDataForSaveType1] = useState({})
    //объект содержащий данные для сохранения в БД по типу 2 (по самостоятельному тарифу)
    const [dataForSaveType2, setDataForSaveType2] = useState({})

    const submit = () => {
        setIsSubmitting(true)
        setIsTriedToSave(true)

        yearPlans.forEach(yp => {
            if (yp.Type.Id === 1) {
                if (!validateDataInputs(dataForSaveType1, setSubmitStatus, setIsSubmitting)) {
                    return
                }
            } else {
                if (!validateDataInputs(dataForSaveType2, setSubmitStatus, setIsSubmitting)) {
                    return
                }
            }
        })

        let dataArray = [];
        yearPlans.forEach(yp => {
            if (yp.Type.Id === 1) {
                dataArray.push(prepareDataForSend(dataForSaveType1))
            } else if (yp.Type.Id === 2) {
                dataArray.push(prepareDataForSend(dataForSaveType2))
            }
        })

        if (dataArray.length > 0) {
            DataAPI.save(dataArray, currentMo, currentWeek, currentUser.Username, currentUser.Password).then(res => {
                if (res.status === 200) {
                    setSubmitStatus({status: true, message: "Сведения успешно сохранены"})
                } else {
                    setSubmitStatus({
                        status: false,
                        message: "При сохранении сведений возникла ошибка, пожалуйста повторите попытку позже"
                    })
                }
            }).catch(() => {
                setSubmitStatus({
                    status: false,
                    message: "При сохранении сведений возникла ошибка, пожалуйста повторите попытку позже"
                })
            }).finally(() => {
                setIsSubmitting(false)
            })
        }
    }

    return (
        <div className="datbMain">
            <div className="datbTitle">Форма для заполнения сведений</div>
            <div className="datbLayoutLine">
                <div className="datbLayoutContainer grey">Год</div>
                <div className="datbLayoutContainer grey">Отчётная неделя</div>
                <div className="datbLayoutContainer grey">Медицинская организация</div>
            </div>
            <div className="datbLayoutLine">
                <div className="datbLayoutContainer">
                    <DropDownList
                        list={years}
                        setSelectedItem={(item) => setCurrentYear(item)}
                    />
                </div>
                <div className="datbLayoutContainer">
                    {
                        isWeeksLoading ?
                            <SmallLoader/> :
                            <>
                                {weeks &&
                                    <DropDownList
                                        list={getWeekStringsForDropDown(weeks)}
                                        setSelectedItem={(item) => setCurrentWeek(weeks.filter(w => w.NumberInYear === Number.parseInt(item.split(" ")[0]))[0])}
                                    />
                                }
                            </>
                    }
                </div>
                <div className="datbLayoutContainer">
                    <DropDownList
                        list={mos.map((mo) => {
                            return mo.Name
                        })}
                        setSelectedItem={(item) => setCurrentMo(mos.filter(mo => mo.Name === item)[0])}
                    />
                </div>
            </div>
            <br/><br/>
            {
                isDataLoading ?
                    <div className="datbFormContainer center">
                        <Loader/>
                    </div> :
                    <>
                        {
                            yearPlans.length > 0 ?
                                <div className="datbFormContainer">
                                    <DataForm
                                        mo={currentMo}
                                        week={currentWeek}
                                        yearPlan={yearPlans[0]}
                                        setIsTriedToSave={setIsTriedToSave}
                                        dataForSave={yearPlans[0].Type.Id === 1 ? dataForSaveType1 : dataForSaveType2}
                                        setDataForSave={yearPlans[0].Type.Id === 1 ? setDataForSaveType1 : setDataForSaveType2}
                                    />
                                    {
                                        yearPlans.length > 1 &&
                                        <>
                                            <br/><br/><br/>
                                            <DataForm
                                                mo={currentMo}
                                                week={currentWeek}
                                                yearPlan={yearPlans[1]}
                                                setIsTriedToSave={setIsTriedToSave}
                                                dataForSave={dataForSaveType2}
                                                setDataForSave={setDataForSaveType2}
                                            />
                                        </>
                                    }
                                </div> :
                                <div className="datbFormContainer center">
                                    <div
                                        className="datbSubmitMessage red">{"Для \"" + currentMo.Name + "\" не задан план на " + currentYear + " год.\nОбратитесь к администратору."}</div>
                                </div>
                        }
                        {
                            yearPlans.length !== 0 &&
                            <div className="datbSubmitContainer">
                                {
                                    isSubmitting ?
                                        <LineLoader/> :
                                        <>
                                            {
                                                isTriedToSave ?
                                                    <div
                                                        className={submitStatus.status ? "datbSubmitMessage green" : "datbSubmitMessage red"}>{submitStatus.message}</div> :
                                                    <div className="datbSubmitButton" onClick={submit}>Сохранить</div>
                                            }
                                        </>
                                }
                            </div>
                        }
                    </>
            }
        </div>
    );
};

export default DataBoard;