import React, {useEffect, useState} from 'react';
import "./DataForm.css"
import Input from "../../UI/Input/Input";
import CheckBox from "../../UI/CheckBox/CheckBox";
import DataAPI from "../../../API/DataAPI";
import TextArea from "../../UI/TextArea/TextArea";
import MoSelector from "./MoSelector/MoSelector";
import MosListRedactor from "../../MosListRedactor/MosListRedactor";
import {logDOM} from "@testing-library/react";

const DataForm = ({yearPlan, mo, week, setIsTriedToSave, dataForSave, setDataForSave}) => {
    //загружаются ли данные в форму в настоящий момент
    const [isDataLoading, setIsDataLoading] = useState(true)
    //объект содержащий данные полученные от API
    const [dataFromDB, setDataFromDB] = useState([])

    //число выполненных маммографий
    const [performedNumber, setPerformedNumber] = useState('')
    //при каждом изменении числа выполненных маммографий обновляет объект dataForSave
    useEffect(() => {
        setDataForSave({...dataForSave, NumberOfPerformedMammography: performedNumber})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [performedNumber])

    //число выявленных патологий
    const [detectedNumber, setDetectedNumber] = useState('')
    //при каждом изменении числа выявленных патологий обновляет объект dataForSave
    useEffect(() => {
        setDataForSave({...dataForSave, NumberOfDetectedPathology: detectedNumber})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [detectedNumber])

    //был ли маммограф доступен в отчётную неделю
    const [isAvailable, setIsAvailable] = useState(false)
    //состояние дублирующее isAvailable необходимое для корректной работы чекбокса
    const [checkboxValueAvailable, setCheckboxValueAvailable] = useState(false)
    //при каждом изменении состояния обновляет объект dataForSave
    useEffect(() => {
        setDataForSave({...dataForSave, IsMammographAvaliable: isAvailable})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [isAvailable])

    //работал ли маммограф в отчётную неделю
    const [isWasWorking, setIsWasWorking] = useState(false)
    //состояние дублирующее isWasWorking необходимое для корректной работы чекбокса
    const [checkboxValueWasWorking, setCheckboxValueWasWorking] = useState(false)
    //при каждом изменении состояния обновляет объект dataForSave
    useEffect(() => {
        setDataForSave({...dataForSave, IsMammographWasWorking: isWasWorking})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [isWasWorking])

    //строка содержащая комментарий
    const [comment, setComment] = useState('')
    //при каждом изменении комментария обновляет объект dataForSave
    useEffect(() => {
        setDataForSave({...dataForSave, Comment: comment})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [comment])

    //медицинская организация выполняющая маммографию
    const [performedMo, setPerformedMo] = useState()
    //при каждом изменении МО выполняющей маммографию обновляет объект dataForSave
    useEffect(() => {
        setDataForSave({...dataForSave, MoPerformedMammography: performedMo})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [performedMo])

    //список медицинских организаций для которых выполняется маммография
    const [wasWitchMosList, setWasWitchMosList] = useState()
    //при каждом изменении списка МО для которых выполняется маммография, обновляет объект dataForSave
    useEffect(() => {
        setDataForSave({...dataForSave, MosForWhichMammographyWasPerformed: wasWitchMosList})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [wasWitchMosList])

    //при изменении медицинской организации или недели загружает данные, если они есть
    useEffect(() => {
        setIsDataLoading(true)
        DataAPI.get(mo, week).then(res => {
            if (res.data.length > 0) {
                setDataFromDB(res.data)
            } else {
                setDataFromDB([])
            }
        }).catch(() => {
            setDataFromDB([])
        }).finally(() => {
            setIsDataLoading(false)
        })
    }, [mo, week])

    //при каждой загрузке данных, если они есть присваивает их всем состояниям, если нет присваивает состояниям дефолтные значения.
    useEffect(() => {
        if (dataFromDB.length === 2) {
            const data = yearPlan.Type.Id === 1 ? dataFromDB[0] : dataFromDB[1]
            fillWithData(data)
        } else if (dataFromDB.length === 1) {
            const data = yearPlan.Type.Id === dataFromDB[0].Type.Id ? dataFromDB[0] : null;
            if (data) {
                fillWithData(data)
            } else {
                fillEmpty()
            }
        } else {
            fillEmpty()
        }
    }, [dataFromDB])

    //наполняет поля формы и объект dataForSave полученными сведениями
    const fillWithData = (data) => {
        setDataForSave(data)
        setPerformedNumber(data.NumberOfPerformedMammography)
        setDetectedNumber(data.NumberOfDetectedPathology)
        setIsAvailable(data.IsMammographAvaliable)
        setCheckboxValueAvailable(data.IsMammographAvaliable)
        setIsWasWorking(data.IsMammographWasWorking)
        setCheckboxValueWasWorking(data.IsMammographWasWorking)
        setComment(data.Comment)
        setPerformedMo(yearPlan.Type.Id === 1 ? data.MoPerformedMammography : null)
        setWasWitchMosList(yearPlan.Type.Id === 2 ? data.MosForWhichMammographyWasPerformed : null)
    }

    //наполняет поля формы и объект dataForSave пустой структурой данных
    const fillEmpty = () => {
        setDataForSave({
            Type: yearPlan.Type
            , Week: week
            , YearPlan: yearPlan
            , MoPerformedMammography: yearPlan.Type.Id === 1 ? {} : null
            , MosForWhichMammographyWasPerformed: yearPlan.Type.Id === 2 ? [] : null
            , Comment: ''
            , IsMammographAvaliable: false
            , IsMammographWasWorking: false
            , MoWithAttachedPopulation: mo
            , NumberOfPerformedMammography: ''
            , NumberOfDetectedPathology: ''
        })
        setPerformedNumber('')
        setDetectedNumber('')
        setIsAvailable(false)
        setCheckboxValueAvailable(false)
        setIsWasWorking(false)
        setCheckboxValueWasWorking(false)
        setComment('')
        setPerformedMo(yearPlan.Type.Id === 1 ? {} : null)
        setWasWitchMosList(yearPlan.Type.Id === 2 ? [] : null)
    }

    return (
        <div className="datfMain">
            <div
                onClick={() => console.log(dataFromDB)}
                className="datfTitle">{yearPlan.Type.Id === 1 ? "Работа с прикреплённым населением (за неделю)" : "Работа по самостоятельному тарифу (за неделю)"}</div>
            <table>
                <thead>
                <tr>
                    <th>Число выполненных маммографий</th>
                    <th>Число случаев с выявлением патологии (по BI-RADS 3 и выше)</th>
                    <th>Маммограф был в наличии в отчётную неделю?</th>
                    <th>Маммограф работал в отчётную неделю?</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <div className="datfInTheCellContainer">
                            <Input
                                string={performedNumber}
                                setString={setPerformedNumber}
                                isLoading={isDataLoading}
                            />
                        </div>
                    </td>
                    <td>
                        <div className="datfInTheCellContainer">
                            <Input
                                string={detectedNumber}
                                setString={setDetectedNumber}
                                isLoading={isDataLoading}
                            />
                        </div>
                    </td>
                    <td>
                        <div className="datfInTheCellContainer">
                            <CheckBox
                                value={checkboxValueAvailable}
                                onChange={setIsAvailable}
                            />
                        </div>
                    </td>
                    <td>
                        <div className="datfInTheCellContainer">
                            <CheckBox
                                value={checkboxValueWasWorking}
                                onChange={setIsWasWorking}
                            />
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <table>
                <thead>
                <tr>
                    <th>{yearPlan.Type.Id === 1 ? "Медицинская организация, выполняющая маммографию" : "Медицинские организации для которых выполняется маммография"}</th>
                    <th>Комментарий</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        {
                            yearPlan.Type.Id === 1 ?
                                <>
                                    {
                                        dataFromDB.length > 0 &&
                                        <MoSelector
                                            week={week}
                                            currentMo={mo}
                                            selectedMo={performedMo}
                                            defaultMo={dataFromDB[0].MoPerformedMammography}
                                            setSelectedMo={setPerformedMo}
                                        />
                                    }
                                    {
                                        dataFromDB.length === 0 &&
                                        <MoSelector
                                            week={week}
                                            currentMo={mo}
                                            selectedMo={performedMo}
                                            setSelectedMo={setPerformedMo}
                                        />
                                    }
                                </> :
                                <>
                                    {wasWitchMosList &&
                                        <>
                                            <br/><br/>
                                            <MosListRedactor
                                                mosList={wasWitchMosList}
                                                setMosList={setWasWitchMosList}
                                            />
                                        </>
                                    }
                                </>
                        }
                    </td>
                    <td>
                        <div className={yearPlan.Type.Id === 1 ? "datfCommentContainer" : "datfCommentContainer big"}>
                            <TextArea
                                isLoading={isDataLoading}
                                string={comment}
                                setString={setComment}
                            />
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DataForm;