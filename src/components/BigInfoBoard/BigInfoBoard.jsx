import React, {useEffect, useState} from 'react';
import './BigInfoBoard.css'
import MiniMap from "../MiniMap/MiniMap";
import DataAPI from "../../API/DataAPI";
import Loader from "../Loaders/Loader/Loader";
import InfoBlock from "./InfoBlock/InfoBlock";

const BigInfoBoard = ({mo, week, modalIsOpen}) => {
    //загружаются ли данные в настоящий момент
    const [dataIsLoading, setDataIsLoading] = useState(true)
    //данные
    const [data, setData] = useState()
    //работает ли организация по самостоятельному тарифу
    const [isIndependentTariff, setIsIndependentTariff] = useState(false);

    //при каждом открытии модального окна, содержащего данный компонент делает запрос к API и присваивает результаты запроса вышестоящим полям.
    useEffect(() => {
        if (modalIsOpen) {
            setDataIsLoading(true)
            DataAPI.get(mo, week).then(res => {
                setData(res.data)
                setIsIndependentTariff(res.data.length > 1)
            })
            setDataIsLoading(false)
        }
    }, [modalIsOpen])


    return (
        <div className="bibMain">
            <div className="bibTextSide">
                <div className="bibName">{mo.Name}</div>
                <div className="bibAddress">{mo.Address}</div>
                <div className="bibInfoBlocksContainer">
                    {
                        dataIsLoading ?
                            <div className="bibLoaderContainer">
                                <Loader/>
                            </div>
                            :
                            <>
                                {
                                    data &&
                                    <>
                                        <InfoBlock
                                            data={data[0]}
                                            week={week}
                                        />
                                        {
                                            isIndependentTariff &&
                                            <InfoBlock
                                                data={data[1]}
                                                week={week}
                                            />
                                        }
                                        {
                                            (mo.ResponsibleEmployeeFIO !== '' || mo.ResponsibleEmployeePhoneNumber !== '' || mo.ResponsibleEmployeeEmail !== '') &&
                                            <>
                                                <div className="bibEmployeeInfoHeader">Сотрудник ответственный за
                                                    предоставление сведений:
                                                </div>
                                                {mo.ResponsibleEmployeeFIO !== '' &&
                                                    <>
                                                        <div className="bibEmployeeInfoTitle">ФИО:</div>
                                                        <div
                                                            className="bibEmployeeInfoValue">{mo.ResponsibleEmployeeFIO}</div>
                                                    </>
                                                }

                                                {mo.ResponsibleEmployeePhoneNumber !== '' &&
                                                    <>
                                                        <div className="bibEmployeeInfoTitle">Телефон:</div>
                                                        <div
                                                            className="bibEmployeeInfoValue">{mo.ResponsibleEmployeePhoneNumber}</div>
                                                    </>
                                                }

                                                {mo.ResponsibleEmployeeEmail !== '' &&
                                                    <>
                                                        <div className="bibEmployeeInfoTitle">Email:</div>
                                                        <div
                                                            className="bibEmployeeInfoValue">{mo.ResponsibleEmployeeEmail}</div>
                                                    </>
                                                }
                                            </>
                                        }
                                    </>
                                }
                            </>
                    }
                </div>
            </div>
            <div className="bibMapSide">
                <MiniMap
                    mo={mo}
                    modalIsOpen={modalIsOpen}
                />
            </div>
        </div>
    );
};

export default BigInfoBoard;