import React, {useEffect, useState} from 'react';
import "./MosListRedactor.css"
import ViewAndDeleteButton from "./ViewAndDeleteButton/ViewAndDeleteButton";
import SmallAddButton from "../UI/SmallAddButton/SmallAddButton";
import Loader from "../Loaders/Loader/Loader";
import MoAPI from "../../API/MoAPI";
import Input from "../UI/Input/Input";
import MosAddButton from "./MosAddButton/MosAddButton";
import SmallLoader from "../Loaders/SmallLoader/SmallLoader";

const MosListRedactor = ({mosList, setMosList, modalIsOpen}) => {
    //включен ли режим добавления новых медицинских организаций в список
    const [isAddingMode, setIsAddingMode] = useState(false)
    //загружаются ли в настоящий момент медицинские организации из API
    const [isLoading, setIsLoading] = useState(true)
    //список медицинских организаций полученный через API (для добавления)
    const [mosListFromDB, setMosListFromDB] = useState()
    //содержимое строки поиска (в режиме добавления МО)
    const [searchString, setSearchString] = useState('')

    //устанавливает режим только для просмотра и удаления при каждом закрытии/открытии модального окна содержащего данную форму
    useEffect(() => {
        setIsAddingMode(false)
    }, [modalIsOpen])

    //при изменении режима на добавление организаций делает запрос к API
    useEffect(() => {
        setIsLoading(true)
        if (isAddingMode) {
            MoAPI.getAll().then(res => {
                setMosListFromDB(res.data)
                setIsLoading(false)
            })
        }
    }, [isAddingMode])
    //добавляет МО в список
    const addMoToList = (mo) => {
        setMosList([...mosList, mo])
    }
    //удаляет МО из списка
    const removeMoFromList = (mo) => {
        setMosList(mosList.filter(m => m.Id !== mo.Id))
    }

    return (
        <div className="mlrMain">
            <div className="mlrAddButtonContainer">
                <SmallAddButton
                    notActiveTitle={"Добавить медицинскую организацию в список"}
                    activeTitle={"Вернуться к списку медицинских организаций"}
                    onClick={() => setIsAddingMode(!isAddingMode)}
                    isActive={isAddingMode}
                />
            </div>
            <div className="mlrScrollContainer">
                {
                    isAddingMode ?
                        <>
                            {
                                isLoading ?
                                    <div className="mlrLoaderContainer">
                                        <SmallLoader/>
                                    </div> :
                                    <>
                                        <div className="mlrHeader">
                                            <div className="mlrHeaderInputContainer">
                                                <Input
                                                    placeholder={"Поиск по названию"}
                                                    setString={setSearchString}
                                                />
                                            </div>
                                        </div>
                                        {
                                            mosListFromDB &&
                                            mosListFromDB
                                                .filter(mo => mo.Name.toLowerCase().includes(searchString.toLowerCase()))
                                                .map(mo =>
                                                    <MosAddButton
                                                        key={mo.Id}
                                                        isSelected={mosList.filter(m => m.Id === mo.Id).length > 0}
                                                        mo={mo}
                                                        addMo={addMoToList}
                                                        removeMo={removeMoFromList}
                                                    />
                                                )
                                        }
                                    </>
                            }
                        </> :
                        <>
                            {
                                mosList.map(mo =>
                                    <ViewAndDeleteButton
                                        key={mo.Id}
                                        mo={mo}
                                        onDeleteClick={removeMoFromList}
                                    />
                                )
                            }
                        </>
                }
            </div>
        </div>
    );
};

export default MosListRedactor;