import React, {useContext, useEffect, useState} from 'react';
import "./WeekForm.css"
import Input from "../../UI/Input/Input";
import WeekAPI from "../../../API/WeekAPI";
import SmallLoader from "../../Loaders/SmallLoader/SmallLoader";
import LineLoader from "../../Loaders/LineLoader/LineLoader";
import Modal from "../../Modals/Modal/Modal";
import DeleteButton from "../../UI/DeleteButton/DeleteButton";
import YearPlanAPI from "../../../API/YearPlanAPI";
import {AuthContext} from "../../../context/context";

const WeekForm = () => {
    const {currentUser} = useContext(AuthContext)
    //объект для сохранения в БД
    const [weekForSave, setWeekForSave] = useState({})
    //Отчётные недели по указанному году полученные из БД
    const [weeksFromDB, setWeeksFromDB] = useState([])
    //загружается ли список отчётных недель в данный момент
    const [isWeeksLoading, setIsWeeksLoading] = useState(false)

    //содержимое инпута "Год"
    const [year, setYear] = useState('')
    //при каждом изменении года обновляет объект weekForSave и запрашивает у API список недель этого года
    useEffect(() => {
        if (!isNaN(Number.parseInt(year)) && year.length === 4 && year[0] === '2' && year[1] === '0') {
            setWeekForSave({...weekForSave, Year: Number.parseInt(year)})
            setIsWeeksLoading(true)
            WeekAPI.getAll(year).then(res => {
                if (res.status === 200) {
                    setWeeksFromDB(res.data)
                } else {
                    setWeeksFromDB([])
                }
            }).catch(() => {
                setWeeksFromDB([])
            }).finally(() => {
                setIsWeeksLoading(false)
            })
        }
        setIsTriedToSave(false) //убираю флаг о том что попытка сохранить уже предпринималась. пропадает сообщение, появляется кнопка "Сохранить"
    }, [year])

    //содержимое инпута "Номер недели в году"
    const [numberInYear, setNumberInYear] = useState('')
    //при каждом изменении номера в году обновляет объект weekForSave и предлагает значение полю "Цель недели"
    useEffect(() => {
        const number = Number.parseInt(numberInYear)
        if (!isNaN(number) && number >= 1 && number <= 53) {
            if (weeksFromDB.length > 0 && weeksFromDB.filter(w => w.NumberInYear === number).length > 0) {
                const currentWeek = weeksFromDB.filter(w => w.NumberInYear === number)[0]
                setWeekForSave(currentWeek)
                setFirstDayDate(currentWeek.FirstDay.split("T")[0])
                setEndDayDate(currentWeek.EndDay.split("T")[0])
                setTarget(currentWeek.Target)
            } else {
                setWeekForSave({Year: Number.parseInt(year), NumberInYear: number})
                setFirstDayDate('')
                setEndDayDate('')
                setTarget((number * 1.923).toFixed(2))
            }
        }
        setIsTriedToSave(false) //убираю флаг о том что попытка сохранить уже предпринималась. пропадает сообщение, появляется кнопка "Сохранить"
    }, [numberInYear])

    //содержимое поля "Первый день"
    const [firstDayDate, setFirstDayDate] = useState('')
    //при каждом изменении поля "Первый день" обновляется объект weekForSave
    useEffect(() => {
        setWeekForSave({...weekForSave, FirstDay: firstDayDate})
        setIsTriedToSave(false) //убираю флаг о том что попытка сохранить уже предпринималась. пропадает сообщение, появляется кнопка "Сохранить"
    }, [firstDayDate])

    //содержимое поля "Последний день"
    const [endDayDate, setEndDayDate] = useState('')
    //при каждом изменении поля "Последний день" обновляется объект weekForSave
    useEffect(() => {
        setWeekForSave({...weekForSave, EndDay: endDayDate})
        setIsTriedToSave(false) //убираю флаг о том что попытка сохранить уже предпринималась. пропадает сообщение, появляется кнопка "Сохранить"
    }, [endDayDate])

    //содержимое поля "Цель(%)"
    const [target, setTarget] = useState('')
    //при каждом изменении цели обновляется объект weekForSave
    useEffect(() => {
        const numTarget = Number.parseFloat(target.toString().replaceAll(",", "."))
        if (!isNaN(numTarget)) {
            setWeekForSave({...weekForSave, Target: numTarget})
        }
        setIsTriedToSave(false) //убираю флаг о том что попытка сохранить уже предпринималась. пропадает сообщение, появляется кнопка "Сохранить"
    }, [target])

    //сохраняются ли данные формы в настоящий момент
    const [isSubmitting, setIsSubmitting] = useState(false)
    //была ли уже нажата кнопка сохранить (при дальнейшем изменении данных состояние откатывается)
    const [isTriedToSave, setIsTriedToSave] = useState(false)
    //объект содержит статус отправки данных на сервер (сохранения) и сообщение для пользователя
    const [submitStatus, setSubmitStatus] = useState({successful: false, message: ''})

    const submit = () => {
        setIsTriedToSave(true)
        if (year.toString().length !== 4 || year.toString()[0] !== '2' || year.toString()[1] !== '0') {
            setSubmitStatus({successful: false, message: 'Не корректное значение поля \"Год\"'})
        } else if (year.toString().length === 0) {
            setSubmitStatus({successful: false, message: 'Поле \"Год\" не может быть пустым'})
        } else if (isNaN(Number.parseInt(year.toString()))) {
            setSubmitStatus({successful: false, message: '\"Год\" должен быть целым числом'})
        } else if (numberInYear.toString().length === 0) {
            setSubmitStatus({successful: false, message: 'Поле \"Номер недели в году\" не может быть пустым'})
        } else if (isNaN(Number.parseInt(numberInYear.toString()))) {
            setSubmitStatus({successful: false, message: '\"Номер недели в году\" должен быть целым числом'})
        } else {
            setIsSubmitting(true)
            if (weekForSave.Id) {
                WeekAPI.update(weekForSave, currentUser.Username, currentUser.Password).then(res => {
                    if (res.status === 200) {
                        setSubmitStatus({successful: true, message: 'Отчётная неделя успешно сохранена'})
                    } else {
                        setSubmitStatus({
                            successful: false,
                            message: 'Не удалось сохранить отчётную неделю. Повторите попытку позже'
                        })
                    }
                }).catch(() => {
                    setSubmitStatus({
                        successful: false,
                        message: 'Не удалось сохранить отчётную неделю. Повторите попытку позже'
                    })
                }).finally(() => {
                    setIsSubmitting(false)
                })
            } else {
                WeekAPI.create(weekForSave, currentUser.Username, currentUser.Password).then(res => {
                    if (res.status === 200) {
                        setSubmitStatus({successful: true, message: 'Отчётная неделя успешно сохранена'})
                    } else {
                        setSubmitStatus({
                            successful: false,
                            message: 'Не удалось сохранить отчётную неделю. Повторите попытку позже'
                        })
                    }
                }).catch(() => {
                    setSubmitStatus({
                        successful: false,
                        message: 'Не удалось сохранить отчётную неделю. Повторите попытку позже'
                    })
                }).finally(() => {
                    setIsSubmitting(false)
                })
            }
        }
    }

    //открыто ли модальное окно содержащее меню удаления отчётной недели
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    //удаляется ли отчётная неделя в настоящий момент
    const [isDeleting, setIsDeleting] = useState(false)

    const deleteWeek = () => {
        if (weekForSave.Id) {
            setIsDeleting(true)
            WeekAPI.delete(weekForSave, currentUser.Username, currentUser.Password).then(res => {
                if (res.data) {
                    alert("Отчётная неделя успешно удалена")
                } else {
                    alert("Не удалось удалить отчётную неделю. Повторите попытку позже.")
                }
            }).catch(() => {
                alert("Не удалось удалить отчётную неделю. Повторите попытку позже.")
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
        <div className="wfMain">
            <div className="wfTitle">Создать/изменить отчётную неделю</div>
            <table>
                <thead>
                <tr>
                    <th>Год</th>
                    <th>Номер недели в году</th>
                    <th>Первый день</th>
                    <th>Последний день</th>
                    <th>Цель недели(%)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <div className="wfSingleInputContainer">
                            <Input
                                string={year}
                                setString={setYear}
                            />
                        </div>
                    </td>
                    {
                        isWeeksLoading ?
                            <td colSpan={4}>
                                <SmallLoader/>
                            </td> :
                            <>
                                <td>
                                    <div className="wfSingleInputContainer small">
                                        <Input
                                            string={numberInYear}
                                            setString={setNumberInYear}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={firstDayDate}
                                        onChange={(event) => setFirstDayDate(event.target.value)}
                                        className="wfDateInput"/>
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={endDayDate}
                                        onChange={(event) => setEndDayDate(event.target.value)}
                                        className="wfDateInput"/>
                                </td>
                                <td>
                                    <div className="wfSingleInputContainer">
                                        <Input
                                            string={target}
                                            setString={setTarget}
                                        />
                                    </div>
                                </td>
                            </>
                    }
                </tr>
                </tbody>
            </table>
            <br/><br/>
            <div className="wfSubmitContainer">
                {
                    isSubmitting ?
                        <LineLoader/> :
                        <>
                            {
                                isTriedToSave ?
                                    <div
                                        className={submitStatus.successful ? "wfSubmitMessage green" : "wfSubmitMessage red"}>{submitStatus.message}</div> :
                                    <div className="wfSubmitButton" onClick={submit}>Сохранить отчётную неделю</div>
                            }
                        </>
                }
                <div className="wfDeleteButtonContainer">
                    <DeleteButton
                        onClick={() => setIsDeleteModalOpen(true)}
                        title={"Удалить текущую отчётную неделю"}
                    />
                    <div className="wfDeleteButtonHider"/>
                </div>
            </div>
            <Modal
                active={isDeleteModalOpen}
                setActive={setIsDeleteModalOpen}
            >
                <div className="wfModalDeleteMenu">
                    <div className="wfModalDeleteMessage">
                        {weekForSave.Id ?
                            <div>Вы действительно хотите удалить отчётную неделю номер {weekForSave.NumberInYear} за {year} год?</div> :
                            <div>Вы не можете удалить отчётную неделю номер {(weekForSave.NumberInYear && weekForSave.NumberInYear.toString().length > 0) ? weekForSave.NumberInYear : '...'} за {year.toString().length > 0 ? year : '...'} год потому что её нет в базе данных.</div>
                        }
                    </div>
                    <div className="wfModalDeleteButtonContainer">
                        {
                            isDeleting ?
                                <LineLoader/> :
                                <div className="wfModalDeleteButton"
                                     onClick={deleteWeek}>{weekForSave.Id ? 'ДА' : 'ПОНЯТНО'}</div>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WeekForm;