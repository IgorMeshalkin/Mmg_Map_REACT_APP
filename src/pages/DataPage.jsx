import React, {useContext, useEffect, useState} from 'react';
import Loader from "../components/Loaders/Loader/Loader";
import MosAPI from "../API/MoAPI";
import WeekAPI from "../API/WeekAPI";
import DataBoard from "../components/DataBoard/DataBoard";
import AuthAndNavigationBar from "../components/AuthAndNavigationBar/AuthAndNavigationBar";
import {AuthContext} from "../context/context";
import {useNavigate} from "react-router-dom";

const DataPage = () => {
        const navigator = useNavigate()
        const {isAuth, currentUser} = useContext(AuthContext)
        //список лет для которых существуют отчётные недели
        const [years, setYears] = useState()
        //список медицинских организаций
        const [mos, setMos] = useState()
        //загружаются данные в настоящий момент или нет
        const [isLoading, setIsLoading] = useState(true)

        //при загрузке страницы загружаются списки лет и медицинских организаций
        useEffect(() => {
                WeekAPI.getYears().then(res => {
                    setYears(res.data)
                })
                if (isAuth) {
                    if (currentUser.Role === 1) {
                        MosAPI.getAll().then(res => {
                            setMos(res.data)
                        })
                    } else {
                        MosAPI.getByUserId(currentUser.Id).then(res => {
                            if (res.data.length > 0) {
                                setMos(res.data)
                            } else {
                                alert("Вам пока недоступна ни одна медицинская организация для которой вы могли бы заполнять сведения. Обратитесь к администратору.")
                                navigator("/")
                            }
                        })
                    }
                }
            }, [currentUser])

//при успешной загрузке списков лет и медицинских организаций убирает флажок, что загружается страница (пропадает Loader появляется DataBoard)
        useEffect(() => {
            if (years && mos) {
                setIsLoading(false)
            }
        }, [years, mos])

        return (
            <div className="lightGreyBackground">
                {
                    isLoading ?
                        <Loader/> :
                        <>
                            {(years && mos) &&
                                <DataBoard
                                    years={years}
                                    setYears={setYears}
                                    mos={mos}
                                    setMos={setMos}
                                />
                            }
                        </>
                }
                <AuthAndNavigationBar/>
            </div>
        );
    }
;

export default DataPage;