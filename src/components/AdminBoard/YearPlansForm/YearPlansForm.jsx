import React, {useContext, useEffect, useState} from 'react';
import "./YearPlansForm.css"
import MoAPI from "../../../API/MoAPI";
import Input from "../../UI/Input/Input";
import DropDownList from "../../UI/DropDownList/DropDownList";
import SmallLoader from "../../Loaders/SmallLoader/SmallLoader";
import RadioButtons from "../../UI/RadioButtons/RadioButtons";
import YearPlanAPI from "../../../API/YearPlanAPI";
import LineLoader from "../../Loaders/LineLoader/LineLoader";
import DeleteButton from "../../UI/DeleteButton/DeleteButton";
import Modal from "../../Modals/Modal/Modal";
import {AuthContext} from "../../../context/context";

const YearPlansForm = () => {
    const {currentUser} = useContext(AuthContext)
    //объект план на год для сохранения в БД
    const [planForSave, setPlanForSave] = useState({})

    //загружается ли список медицинских организаций в настоящий момент
    const [isMosLoading, setIsMosLoading] = useState(true)
    //список медицинских организаций
    const [mos, setMos] = useState([])
    //текущая(выбранная) медицинская организация
    const [selectedMo, setSelectedMo] = useState({})
    //строка поиска медицинской организации
    const [moSearchString, setMoSearchString] = useState('')
    //загружает список медицинских организаций
    useEffect(() => {
        setIsMosLoading(true)
        MoAPI.getAll().then(res => {
            if (res.status === 200) {
                setMos(res.data)
                setSelectedMo(res.data[0])
            }
        }).finally(() => setIsMosLoading(false))
    }, [])
    //ставит выбранную МО на первое место(для выпадающего списка)
    useEffect(() => {
        if (selectedMo) {
            setMos([selectedMo, ...mos.filter(mo => mo.Id !== selectedMo.Id)])
            setIsTriedToSave(false) //убираю флаг о том что попытка сохранить уже предпринималась. пропадает сообщение, появляется кнопка "Сохранить"
        }
    }, [selectedMo])

    //строка содержащая введённый год
    const [year, setYear] = useState('')
    //при каждом изменении года обновляет объект planForSave
    useEffect(() => {
        setPlanForSave({...planForSave, Year: year})
        setIsTriedToSave(false) //убираю флаг о том что попытка сохранить уже предпринималась. пропадает сообщение, появляется кнопка "Сохранить"
    }, [year])

    //типы сведений
    const [types, setTypes] = useState([{Id: 1, Value: 'С прикреплённым населением'}
        , {Id: 2, Value: 'По самостоятельному тарифу'}])
    //выбранный в настоящий момент тип сведений
    const [selectedType, setSelectedType] = useState(types[0])
    //при каждом изменении типа обновляет объект planForSave
    useEffect(() => {
        setPlanForSave({...planForSave, Type: year})
        setIsTriedToSave(false) //убираю флаг о том что попытка сохранить уже предпринималась. пропадает сообщение, появляется кнопка "Сохранить"
    }, [selectedType])

    //загружаются ли планы из БД в настоящий момент
    const [isPlansLoading, setIsPlansLoading] = useState(false)
    //планы полученные из БД
    const [plansFromDB, setPlansFromDB] = useState([])
    //при каждом изменении МО или года загружает планы из БД если они там есть
    useEffect(() => {
        if (selectedMo && year.length === 4) {
            setIsPlansLoading(true)
            YearPlanAPI.getAll(year, selectedMo.Id)
                .then(res => {
                    if (res.status === 200) {
                        setPlansFromDB(res.data.sort((a, b) => {
                            if (a.Type.Id > b.Type.Id) {
                                return 1
                            } else {
                                return -1
                            }
                        }))
                    }
                }).finally(() => {
                setIsPlansLoading(false)
            })
        }
    }, [selectedMo, year])

    //содержимое инпута "План"
    const [plan, setPlan] = useState('')
    //при каждом изменении плана обновляет объект planForSave
    useEffect(() => {
        setPlanForSave({...planForSave, Plan: plan})
        setIsTriedToSave(false) //убираю флаг о том что попытка сохранить уже предпринималась. пропадает сообщение, появляется кнопка "Сохранить"
    }, [plan])

    //при каждом изменении года или выбранного типа сведений заполняет инпут "План" данными если они есть
    useEffect(() => {
        if (plansFromDB.length === 2) {
            if (selectedType.Id === 1) {
                setPlanForSave(plansFromDB[0])
                setPlan(plansFromDB[0].Plan)
            } else if (selectedType.Id === 2) {
                setPlanForSave(plansFromDB[1])
                setPlan(plansFromDB[1].Plan)
            }
        } else if (plansFromDB.length === 1) {
            setPlanForSave(plansFromDB[0])
            if (plansFromDB[0].Type.Id === selectedType.Id) {
                setPlan(plansFromDB[0].Plan)
            } else {
                setPlanForSave({Year: year, Plan: plan, Type: selectedType})
                setPlan('')
            }
        } else {
            setPlanForSave({Year: year, Plan: plan, Type: selectedType})
            setPlan('')
        }
    }, [plansFromDB, selectedType])

    //сохраняются ли данные формы в настоящий момент
    const [isSubmitting, setIsSubmitting] = useState(false)
    //была ли уже нажата кнопка сохранить (при дальнейшем изменении данных состояние откатывается)
    const [isTriedToSave, setIsTriedToSave] = useState(false)
    //объект содержит статус отправки данных на сервер (сохранения) и сообщение для пользователя
    const [submitStatus, setSubmitStatus] = useState({successful: false, message: ''})
    const submit = () => {
        setIsTriedToSave(true)
        if (plan === '') {
            setSubmitStatus({successful: false, message: 'Поле \"План\" не может быть пустым'})
        } else if (isNaN(Number.parseInt(plan))) {
            setSubmitStatus({successful: false, message: 'Поле \"План\" должно содержать целое число'})
        } else if (year === '') {
            setSubmitStatus({successful: false, message: 'Поле \"Год\" не может быть пустым'})
        } else if (isNaN(Number.parseInt(year))) {
            setSubmitStatus({successful: false, message: '\"Год\" должен быть числом'})
        } else if (year.length > 4 || year[0] !== '2' || year[1] !== '0') {
            setSubmitStatus({successful: false, message: 'Не корректное значение поля \"Год\"'})
        } else {
            setIsSubmitting(true)
            if (planForSave.Id) {
                YearPlanAPI.update(planForSave, selectedMo.Id, currentUser.Username, currentUser.Password).then((res) => {
                    if (res.status === 200) {
                        setSubmitStatus({successful: true, message: 'Годовой план успешно сохранён'})
                    } else {
                        setSubmitStatus({
                            successful: false,
                            message: 'Не удалось сохранить годовой план. Повторите попытку позже'
                        })
                    }
                }).catch(() => {
                    setSubmitStatus({
                        successful: false,
                        message: 'Не удалось сохранить годовой план. Повторите попытку позже'
                    })
                }).finally(() => {
                    setIsSubmitting(false)
                })
            } else {
                YearPlanAPI.create(planForSave, selectedMo.Id, currentUser.Username, currentUser.Password).then((res) => {
                    if (res.status === 200) {
                        setSubmitStatus({successful: true, message: 'Годовой план успешно сохранён'})
                    } else {
                        setSubmitStatus({
                            successful: false,
                            message: 'Не удалось сохранить годовой план. Повторите попытку позже'
                        })
                    }
                }).catch(() => {
                    setSubmitStatus({
                        successful: false,
                        message: 'Не удалось сохранить годовой план. Повторите попытку позже'
                    })
                }).finally(() => {
                    setIsSubmitting(false)
                })
            }
        }
    }
    //открыто ли модальное окно содержащее меню удаления годового плана
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    //удаляется ли годовой план в настоящий момент
    const [isDeleting, setIsDeleting] = useState(false)

    const deleteYearPlan = () => {
        if (planForSave.Id) {
            setIsDeleting(true)
            YearPlanAPI.delete(planForSave, currentUser.Username, currentUser.Password).then(res => {
                if (res.data) {
                    alert("Годовой план успешно удалён")
                } else {
                    alert("Не удалось удалить годовой план. Повторите попытку позже.")
                }
            }).catch(() => {
                alert("Не удалось удалить годовой план. Повторите попытку позже.")
            }).finally(() => {
                setIsDeleteModalOpen(false)
                setIsDeleting(false)
                window.location.reload()
            })
        } else {
            setIsDeleteModalOpen(false)
        }
    }

    return (
        <div className="ypfMain">
            <div className="ypfTableTitle">Создать/изменить годовой план</div>
            <table>
                <thead>
                <tr>
                    <th>Медицинская организация</th>
                    <th>Год</th>
                    <th>Тип</th>
                    <th>План</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <div className="ypfMoCellContainer">
                            <div className="ypfInputContainer">
                                <Input
                                    string={moSearchString}
                                    setString={setMoSearchString}
                                    placeholder={"Поиск по названию"}
                                />
                            </div>
                            <br/>
                            <div className="ypfInputContainer">
                                {
                                    isMosLoading ?
                                        <SmallLoader/> :
                                        <>
                                            <DropDownList
                                                list={mos
                                                    .filter(mo => mo.Name.toLowerCase().includes(moSearchString.toLowerCase()))
                                                    .map((mo) => {
                                                        return mo.Name
                                                    })}
                                                setSelectedItem={(item) => setSelectedMo(mos.filter(mo => mo.Name === item)[0])}
                                            />
                                        </>
                                }
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="ypfSingleInputContainer">
                            <Input
                                string={year}
                                setString={setYear}
                            />
                        </div>
                    </td>
                    <td>
                        <div className="ypfRadioButtonsContainer">
                            <RadioButtons
                                list={types}
                                selectedItem={selectedType}
                                setSelectedItem={setSelectedType}
                            />
                        </div>
                    </td>
                    <td>
                        <div className="ypfSingleInputContainer">
                            <Input
                                string={plan}
                                setString={setPlan}
                                isLoading={isPlansLoading}
                            />
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <br/><br/>
            <div className="ypfSubmitContainer">
                {
                    isSubmitting ?
                        <LineLoader/> :
                        <>
                            {
                                isTriedToSave ?
                                    <div
                                        className={submitStatus.successful ? "ypfSubmitMessage green" : "ypfSubmitMessage red"}>{submitStatus.message}</div> :
                                    <div className="ypfSubmitButton" onClick={submit}>Сохранить годовой план</div>
                            }
                        </>
                }
                <div className="ypDeleteButtonContainer">
                    <DeleteButton
                        onClick={() => setIsDeleteModalOpen(true)}
                        title={"Удалить текущий годовой план"}
                    />
                    <div className="ypDeleteButtonHider"/>
                </div>
            </div>
            <Modal
                active={isDeleteModalOpen}
                setActive={setIsDeleteModalOpen}
            >
                <div className="ypModalDeleteMenu">
                    <div className="ypModalDeleteMessage">
                        {planForSave.Id ?
                            <div>Вы действительно хотите удалить годовой план для "{selectedMo.Name}" за {year} год по
                                работе {selectedType.Value.toLowerCase()}?</div> :
                            <div>Вы не можете удалить годовой план для "{selectedMo.Name}"
                                за {year.toString().length > 0 ? year : '...'} год по
                                работе {selectedType.Value.toLowerCase()} потому что его нет в базе данных.</div>
                        }
                    </div>
                    <div className="ypModalDeleteButtonContainer">
                        {
                            isDeleting ?
                                <LineLoader/> :
                                <div className="ypModalDeleteButton"
                                     onClick={deleteYearPlan}>{planForSave.Id ? 'ДА' : 'ПОНЯТНО'}</div>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default YearPlansForm;