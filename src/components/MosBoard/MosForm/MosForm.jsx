import React, {useContext, useEffect, useState} from 'react';
import "./MosForm.css"
import Input from "../../UI/Input/Input";
import LineLoader from "../../Loaders/LineLoader/LineLoader";
import MoAPI from "../../../API/MoAPI";
import {AuthContext} from "../../../context/context";

const MosForm = ({mo, modalIsOpen}) => {
    const {currentUser} = useContext(AuthContext)

    //Медицинская организация для сохранения в БД. Свойства данного объекта изменяются по мере заполнения формы.
    const [moForSave, setMoForSave] = useState({})

    //Название организации
    const [name, setName] = useState('')
    //При каждом изменении названия организации изменяет объект moForSave
    useEffect(() => {
        setMoForSave({...moForSave, Name: name})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [name])

    //Адрес организации
    const [address, setAddress] = useState('')
    //При каждом изменении адреса организации изменяет объект moForSave
    useEffect(() => {
        setMoForSave({...moForSave, Address: address})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [address])

    //Широта координат медицинской организации
    const [latitude, setLatitude] = useState('')
    //При каждом изменении широты организации изменяет объект moForSave
    useEffect(() => {
        const updatedCoordinates = latitude.replaceAll(',', '.') + "-" + (moForSave.Coordinates ? moForSave.Coordinates.split("-")[1] : " ");
        setMoForSave({...moForSave, Coordinates: updatedCoordinates})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [latitude])

    //Долгота координат медицинской организации
    const [longitude, setLongitude] = useState('')
    //При каждом изменении долготы организации изменяет объект moForSave
    useEffect(() => {
        const updatedCoordinates = (moForSave.Coordinates ? moForSave.Coordinates.split("-")[0] : " ") + "-" + longitude.replaceAll(',', '.');
        setMoForSave({...moForSave, Coordinates: updatedCoordinates})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [longitude])

    //ФИО сотрудника ответственного за предоставление сведений
    const [fio, setFio] = useState('')
    //При каждом изменении ФИО изменяется объект moForSave
    useEffect(() => {
        setMoForSave({...moForSave, ResponsibleEmployeeFIO: fio})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [fio])

    //Телефон сотрудника ответственного за предоставление сведений
    const [phoneNumber, setPhoneNumber] = useState('')
    //При каждом изменении телефона изменяется объект moForSave
    useEffect(() => {
        setMoForSave({...moForSave, ResponsibleEmployeePhoneNumber: phoneNumber})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [phoneNumber])

    //Почта сотрудника ответственного за предоставление сведений
    const [email, setEmail] = useState('')
    //При каждом изменении почты изменяется объект moForSave
    useEffect(() => {
        setMoForSave({...moForSave, ResponsibleEmployeeEmail: email})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [email])

    useEffect(() => {
        if (modalIsOpen) {
            if (mo) {
                setMoForSave(mo)
                setName(mo.Name)
                setAddress(mo.Address)
                setLatitude(mo.Coordinates.split("-")[0])
                setLongitude(mo.Coordinates.split("-")[1])
                setFio(mo.ResponsibleEmployeeFIO)
                setPhoneNumber(mo.ResponsibleEmployeePhoneNumber)
                setEmail(mo.ResponsibleEmployeeEmail)
            } else {
                setMoForSave({})
                setName('')
                setAddress('')
                setLatitude('')
                setLongitude('')
                setFio('')
                setPhoneNumber('')
                setEmail('')
            }
        }
    }, [modalIsOpen])

    //сохраняются ли данные формы в настоящий момент
    const [isSubmitting, setIsSubmitting] = useState(false)
    //была ли уже нажата кнопка сохранить (при дальнейшем изменении данных состояние откатывается)
    const [isTriedToSave, setIsTriedToSave] = useState(false)
    //объект содержит статус отправки данных на сервер (сохранения) и сообщение для пользователя
    const [submitStatus, setSubmitStatus] = useState({successful: false, message: ''})

    const submit = () => {
        if (name === '') {
            setSubmitStatus({successful: false, message: 'Поле \"Название\" не может быть пустым'})
            setIsTriedToSave(true)
        } else if (address === '') {
            setSubmitStatus({successful: false, message: 'Поле \"Адрес\" не может быть пустым'})
            setIsTriedToSave(true)
        } else if (latitude === '') {
            setSubmitStatus({successful: false, message: 'Поле \"Широта\" не может быть пустым'})
            setIsTriedToSave(true)
        } else if (longitude === '') {
            setSubmitStatus({successful: false, message: 'Поле \"Долгота\" не может быть пустым'})
            setIsTriedToSave(true)
        } else {
            setIsSubmitting(true)
            if (moForSave.Id) {
                MoAPI.update(moForSave, currentUser.Username, currentUser.Password).then(res => {
                    if (res.status === 200) {
                        setSubmitStatus({successful: true, message: 'Медицинская организация успешно обновлена'})
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500)
                    } else {
                        setSubmitStatus({successful: false, message: 'Не удалось сохранить изменения, повторите попытку позже'})
                    }
                }).catch(res => {
                    setSubmitStatus({successful: false, message: 'Не удалось сохранить изменения, повторите попытку позже'})
                }).finally(() => {
                    setIsSubmitting(false)
                    setIsTriedToSave(true)
                })
            } else {
                MoAPI.create(moForSave, currentUser.Username, currentUser.Password).then(res => {
                    if (res.status === 200) {
                        setSubmitStatus({successful: true, message: 'Медицинская организация успешно сохранена'})
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500)
                    } else {
                        setSubmitStatus({successful: false, message: 'Не удалось добавить медицинскую организацию, повторите попытку позже'})
                    }
                }).catch(res => {
                    setSubmitStatus({successful: false, message: 'Не удалось сохранить изменения, повторите попытку позже'})
                }).finally(() => {
                    setIsSubmitting(false)
                    setIsTriedToSave(true)
                })
            }
        }
    }

    return (
        <div className="mofMain">
            {
                mo ?
                    <div className="mofTitle">Редактировать медицинскую организацию</div> :
                    <div className="mofTitle">Добавить новую медицинскую организацию</div>
            }
            <br/>
            <div className="mofFormContainer">
                <div className="mofFullLine">Название</div>
                <div className="mofFullLine">
                    <Input
                        string={name}
                        setString={setName}
                        isReadOnly={currentUser.Role !== 1}
                    />
                </div>
                <br/>
                <div className="mofFullLine">Адрес</div>
                <div className="mofFullLine">
                    <Input
                        string={address}
                        setString={setAddress}
                        isReadOnly={currentUser.Role !== 1}
                    />
                </div>
                <br/>
                <div className="mofFullLine">Координаты (для карты)</div>
                <div className="mofFullLine">
                    <div className="mofFullLine grey">
                        Широта
                    </div>
                    <div className="horizontalSeparator"/>
                    <div className="mofFullLine grey">
                        Долгота
                    </div>
                </div>
                <div className="mofFullLine">
                    <div className="mofFullLine grey">
                        <Input
                            string={latitude}
                            setString={setLatitude}
                            isReadOnly={currentUser.Role !== 1}
                        />
                    </div>
                    <div className="horizontalSeparator"/>
                    <div className="mofFullLine grey">
                        <Input
                            string={longitude}
                            setString={setLongitude}
                            isReadOnly={currentUser.Role !== 1}
                        />
                    </div>
                </div>
                <br/>
                <div className="mofFullLine">Сотрудник ответственный за предоставление сведений</div>
                <div className="mofFullLine">
                    <div className="mofShortLine">ФИО</div>
                    <div className="mofFullLine">
                        <Input
                            string={fio}
                            setString={setFio}
                        />
                    </div>
                </div>
                <br/>
                <div className="mofFullLine">
                    <div className="mofShortLine">Телефон</div>
                    <div className="mofFullLine">
                        <Input
                            string={phoneNumber}
                            setString={setPhoneNumber}
                        />
                    </div>
                </div>
                <br/>
                <div className="mofFullLine">
                    <div className="mofShortLine">Email</div>
                    <div className="mofFullLine">
                        <Input
                            string={email}
                            setString={setEmail}
                        />
                    </div>
                </div>
                <br/><br/>
                <div className="usfFooterContainer">
                    {
                        isSubmitting ?
                            <LineLoader/> :
                            <>
                                {
                                    isTriedToSave ?
                                        <div className={submitStatus.successful ? "mofSubmitMessage green" : "mofSubmitMessage red"}>{submitStatus.message}</div> :
                                        <div className="mofSubmitButton" onClick={submit}>Сохранить</div>
                                }
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default MosForm;