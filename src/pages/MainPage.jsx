import React, {useEffect, useRef, useState} from 'react';
import WeekAPI from "../API/WeekAPI";
import MoAPI from "../API/MoAPI";
import {getMosWithFormattedCoordinates} from "../utils/moListFunctions";
import {setSmallInfoBoard} from "../utils/mapFunctions";
import Loader from "../components/Loaders/Loader/Loader";
import Title from "../components/Title/Title";
import InfoBoard from "../components/InfoBoard/InfoBoard";
import SpetialForMapModal from "../components/Modals/SpetialForMapModal/SpetialForMapModal";
import BigInfoBoard from "../components/BigInfoBoard/BigInfoBoard";
import MainMap from "../components/MainMap/MainMap";
import AuthAndNavigationBar from "../components/AuthAndNavigationBar/AuthAndNavigationBar";
import PeriodChanger from "../components/PeriodChanger/PeriodChanger";

const MainPage = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [moList, setMoList] = useState()

    const [years, setYears] = useState()
    const [currentYear, setCurrentYear] = useState()

    const [weeks, setWeeks] = useState()
    const [currentWeek, setCurrentWeek] = useState()

    useEffect(() => {
        WeekAPI.getYears().then(res => {
            if (res.status === 200) {
                const yearsFromDB = res.data.sort((a, b) => {
                    if (a > b) {
                        return -1;
                    } else {
                        return 1
                    }
                })
                setYears(yearsFromDB)
                setCurrentYear(yearsFromDB[0])
                WeekAPI.getAll(yearsFromDB[0]).then(res => {
                    const weeksFromDB = res.data.sort((a, b) => {
                        if (a.NumberInYear > b.NumberInYear) {
                            return -1;
                        } else {
                            return 1
                        }
                    })
                    setWeeks(weeksFromDB)
                })
            }
        })
        MoAPI.getAll().then(res => {
            setMoList(getMosWithFormattedCoordinates(res.data))
        })
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if (weeks) {
            setCurrentWeek(weeks[0])
        }
    }, [weeks])

    //Поля малой панели информации о МО
    const boardRef = useRef()
    const nameRef = useRef()
    const addressRef = useRef()
    const planRef = useRef()
    const completePercentRef = useRef()
    const moreButtonRef = useRef()

    //Refs для управления модальным окном
    const modalBackgroundRef = useRef()
    const modalWindowRef = useRef()

    //Состояния для работы с модальным окном
    const [currentMO, setCurrentMO] = useState({})
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [modalIsOpen, setModalIsOpen] = useState(false);


    useEffect(() => {
        if (!isFirstLoad) {
            if (currentMO.PartialData === null) {

            } else {

            }
            setSmallInfoBoard(boardRef, nameRef, addressRef, planRef, completePercentRef, moreButtonRef, currentMO, currentWeek)
        }
        setIsFirstLoad(false)
    }, [currentMO])

    return (
        <div>
            {
                isLoading ?
                    <div className="mainLoaderContainer">
                        <Loader/>
                    </div> :
                    <>
                        <Title/>

                        {
                            currentWeek &&
                            <InfoBoard
                                currentWeek={currentWeek}
                                boardRef={boardRef}
                                nameRef={nameRef}
                                addressRef={addressRef}
                                planRef={planRef}
                                completePercentRef={completePercentRef}
                                moreButtonRef={moreButtonRef}
                                modalBackgroundRef={modalBackgroundRef}
                                modalWindowRef={modalWindowRef}
                                setModalIsOpen={setModalIsOpen}
                                mo={currentMO}
                            />
                        }

                        <SpetialForMapModal
                            modalBackgroundRef={modalBackgroundRef}
                            modalWindowRef={modalWindowRef}
                            setModalIsOpen={setModalIsOpen}
                        >
                            <BigInfoBoard
                                mo={currentMO}
                                week={currentWeek}
                                modalIsOpen={modalIsOpen}
                            />
                        </SpetialForMapModal>
                    </>
            }

            <MainMap
                moList={moList}
                week={currentWeek}
                setCurrentMO={setCurrentMO}
            />

            {/*{*/}
            {/*    currentWeek &&*/}
            {/*    <PeriodChanger*/}
            {/*        currentWeek={currentWeek}*/}
            {/*        weeks={weeks}*/}
            {/*        setWeeks={setWeeks}*/}
            {/*        years={years}*/}
            {/*    />*/}
            {/*}*/}
            <AuthAndNavigationBar/>
        </div>);
};

export default MainPage;