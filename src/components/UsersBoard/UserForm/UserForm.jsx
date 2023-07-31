import React, {useContext, useEffect, useState} from 'react';
import "./UserForm.css"
import Input from "../../UI/Input/Input";
import DropDownList from "../../UI/DropDownList/DropDownList";
import MosListRedactor from "../../MosListRedactor/MosListRedactor";
import LineLoader from "../../Loaders/LineLoader/LineLoader";
import UsersAPI from "../../../API/UsersAPI";
import {AuthContext} from "../../../context/context";

const UserForm = ({user, modalIsOpen}) => {
    const {currentUser} = useContext(AuthContext)

    //Пользователь для сохранения в БД. Свойства данного объекта изменяются по мере заполнения формы.
    const [userForSave, setUserForSave] = useState({})

    //Строка находящаяся в инпуте "Имя пользователя" в данный момент
    const [userNameString, setUserNameString] = useState('')

    useEffect(() => {
        setUserForSave({...userForSave, Username: userNameString})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [userNameString])

    //Состояния для работы с выпадающим списком ролей
    const [roleList, setRoleList] = useState(['Пользователь', 'Администратор']) //Список доступных ролей
    const [selectedRole, setSelectedRole] = useState('Пользователь') //Выбранная в данный момент роль

    //Изменяет порядок в списке ролей при выборе другой роли (поднимает выбранную наверх) и меняет значение поля Role для объекта userForSave
    useEffect(() => {
        let updatedRolesList = [selectedRole]
        roleList.forEach(r => {
            if (r !== selectedRole) {
                updatedRolesList.push(r)
            }
        })
        setRoleList(updatedRolesList)
        if (selectedRole === 'Администратор') {
            setUserForSave({...userForSave, Role: 1})
        } else {
            setUserForSave({...userForSave, Role: 0})
        }
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [selectedRole])

    //Состояния для работы с выпадающим списком статусов
    const [statusList, setStatusList] = useState(['Активен', 'Не активен']) //Список доступных статусов
    const [selectedStatus, setSelectedStatus] = useState('Активен') //Выбранный в данный момент статус

    //Изменяет порядок в списке статусов при выборе другого статуса (поднимает выбранный наверх)
    useEffect(() => {
        let updatedStatusList = [selectedStatus]
        statusList.forEach(s => {
            if (s !== selectedStatus) {
                updatedStatusList.push(s)
            }
        })
        setStatusList(updatedStatusList)
        if (selectedStatus === 'Активен') {
            setUserForSave({...userForSave, isActive: true})
        } else {
            setUserForSave({...userForSave, isActive: false})
        }
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [selectedStatus])

    //список доступных для пользователя МО
    const [mosList, setMosList] = useState([])
    //изменяет список доступных МО для пользователя, при каждом изменении списка
    useEffect(() => {
        setUserForSave({...userForSave, Mos: mosList})
        setIsTriedToSave(false) //убираю флажок о том что попытка сохранения уже предпринималась (пропадает сообщение, появляется кнопка "Сохранить")
    }, [mosList])

    useEffect(() => {
        if (modalIsOpen) {
            if (user) {
                setUserForSave(user)
                setUserNameString(user.Username)
                setSelectedRole(user.Role === 1 ? 'Администратор' : 'Пользователь')
                setSelectedStatus(user.isActive ? 'Активен' : 'Не активен')
                setMosList(user.Mos)
            } else {
                setUserForSave({Role: 0, isActive: true})
                setUserNameString('')
                setSelectedRole('Пользователь')
                setSelectedStatus('Активен')
                setMosList([])
            }
        }
    }, [modalIsOpen])

    //происходит ли отправка данных на сервер (сохранение) в настоящий момент
    const [isSubmitting, setIsSubmitting] = useState(false)
    //была ли уже нажата кнопка сохранить (при дальнейшем изменении данных состояние откатывается)
    const [isTriedToSave, setIsTriedToSave] = useState(false)
    //объект содержит статус отправки данных на сервер (сохранения) и сообщение для пользователя
    const [submitStatus, setSubmitStatus] = useState({successful: false, message: ''})

    //логика сохранения содержимого формы и вывода сообщения о результате.
    const submit = () => {
        if (userNameString === '') {
            setSubmitStatus({successful: false, message: 'Поле \"Имя пользователя\" не может быть пустым'})
            setIsTriedToSave(true)
        } else if (mosList.length === 0 && selectedRole === 'Пользователь') {
            setSubmitStatus({successful: false, message: 'Добавьте хотя бы одну медицинскую организацию'})
            setIsTriedToSave(true)
        } else {
            setIsSubmitting(true)
            if (userForSave.Id) {
                UsersAPI.update(userForSave, currentUser.Username, currentUser.Password).then(res => {
                    if (res.status === 200) {
                        setSubmitStatus({successful: true, message: 'Пользователь успешно обновлён'})
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
                UsersAPI.create(userForSave, currentUser.Username, currentUser.Password).then(res => {
                    if (res.status === 200) {
                        setSubmitStatus({successful: true, message: 'Пользователь успешно сохранён'})
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500)
                    } else {
                        setSubmitStatus({successful: false, message: 'Не удалось Добавить пользователя, повторите попытку позже'})
                    }
                }).catch(res => {
                    if (res.response.data === 'Пользователь с таким именем уже существует') {
                        setSubmitStatus({successful: false, message: res.response.data})
                    } else {
                        setSubmitStatus({successful: false, message: 'Не удалось Добавить пользователя, повторите попытку позже'})
                    }
                }).finally(() => {
                    setIsSubmitting(false)
                    setIsTriedToSave(true)
                })
            }
        }
    }

    return (
        <div className="usfMain">
            {
                user ?
                    <div className="usfTitle">Редактировать пользователя</div> :
                    <div className="usfTitle">Добавить нового пользователя</div>
            }
            <br/>
            <div className="usfFormContainer">
                <div className="usfLineContainer">
                    <div className="usfTextContainer">
                        Имя пользователя
                    </div>
                </div>
                <div className="usfLineContainer">
                    <div className="usfNameInputContainer">
                        <Input
                            string={userNameString}
                            setString={setUserNameString}
                        />
                    </div>
                </div>
                <br/><br/>
                <div className="usfLineContainer">
                    <div className="usfTextContainer">
                        Роль
                    </div>
                    <div className="usfTextContainer">
                        Статус
                    </div>
                </div>
                <div className="usfLineContainer">
                    <div className="usfLineContainer">
                        <div className="usfDropDownContainer">
                            <DropDownList
                                list={roleList}
                                setSelectedItem={setSelectedRole}
                            />
                        </div>
                    </div>
                    <div className="usfLineContainer">
                        <div className="usfDropDownContainer">
                            <DropDownList
                                list={statusList}
                                setSelectedItem={setSelectedStatus}
                            />
                        </div>
                    </div>
                </div>
                <br/><br/>
                <div className="usfLineContainer">
                    <div className="usfTextContainer">
                        Доступные медицинские организации
                    </div>
                </div>
                <div className="usfLineContainer">
                    <MosListRedactor
                        mosList={mosList}
                        setMosList={setMosList}
                        modalIsOpen={modalIsOpen}
                    />
                </div>
                <br/>
                <div className="usfFooterContainer">
                    {
                        isSubmitting ?
                            <LineLoader/> :
                            <>
                                {
                                    isTriedToSave ?
                                        <div className={submitStatus.successful ? "usfSubmitMessage green" : "usfSubmitMessage grey"}>{submitStatus.message}</div> :
                                        <div className="usfSubmitButton" onClick={submit}>Сохранить</div>
                                }
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default UserForm;