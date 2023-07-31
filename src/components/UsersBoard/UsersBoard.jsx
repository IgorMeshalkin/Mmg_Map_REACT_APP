import React, {useEffect, useState} from 'react';
import "./UsersBoard.css"
import {getFormattedData, getMosListForTable} from "../../utils/otherUsefullFunctions";
import UpdateButton from "../UI/UpdateButton/UpdateButton";
import UsersFilterSearchPanel from "./UsersFilterSearchPanel/UsersFilterSearchPanel";
import Modal from "../Modals/Modal/Modal";
import UserForm from "./UserForm/UserForm";
const UsersBoard = ({users}) => {
    //содержимое строки поиска
    const [searchString, setSearchString] = useState('')
    //состояния для работы с фильтрами
    const [isOnlyAdmins, setIsOnlyAdmins] = useState(false)
    const [isOnlyUsers, setIsOnlyUsers] = useState(false)
    const [isOnlyActive, setIsOnlyActive] = useState(false)
    const [isOnlyNotActive, setIsOnlyNotActive] = useState(false)
    //состояние модального окна содержащего форму
    const [isModalActive, setIsModalActive] = useState(false)
    //содержит пользователя, который передаётся в форму для редактирования или null если в форме создаётся новый пользователь.
    const [userToForm, setUserToForm] = useState(null)

    //проверяет юзера на соответствие фильтру по роли
    const matchesRoleFilter = (user) => {
        if (isOnlyAdmins) {
            return user.Role === 1;
        } else if (isOnlyUsers) {
            return user.Role === 0;
        } else {
            return true;
        }
    }

    //проверяет юзера на соответствие фильтру по статусу
    const matchesStatusFilter = (user) => {
        if (isOnlyActive) {
            return user.isActive;
        } else if (isOnlyNotActive) {
            return !user.isActive;
        } else {
            return true;
        }
    }

    //открывает модальное окно содержащее форму создания/изменения юзера и передаёт туда данные юзера для изменения.
    const formOpen = (user) => {
        setUserToForm(user)
        setIsModalActive(true)
    }

    return (<div className="usbMain">
        <div className="usbTitle">Пользователи</div>

        <div className="usbFilterSearchContainer">
            <UsersFilterSearchPanel
                isOnlyAdmins={isOnlyAdmins}
                setIsOnlyAdmins={setIsOnlyAdmins}
                isOnlyUsers={isOnlyUsers}
                setIsOnlyUsers={setIsOnlyUsers}
                isOnlyActive={isOnlyActive}
                setIsOnlyActive={setIsOnlyActive}
                isOnlyNotActive={isOnlyNotActive}
                setIsOnlyNotActive={setIsOnlyNotActive}
                setSearchString={setSearchString}
                formOpen={formOpen}
            />
        </div>

        <div className="usbTableContainer">
            <table>
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th>Доступные медицинские организации</th>
                    <th>Дата добавления</th>
                    <th>Дата последнего изменения</th>
                    <th className="emptyCell"/>
                </tr>
                </thead>
                <tbody>
                {
                    users
                        .filter(user => matchesRoleFilter(user))
                        .filter(user => matchesStatusFilter(user))
                        .filter(user => user.Username.toLowerCase().includes(searchString.toLowerCase()))
                        .map(user =>
                            <tr key={user.Id} className="bodyTr">
                                <td>{user.Username}</td>
                                <td>{user.Role === 1 ? "Администратор" : "Пользователь"}</td>
                                <td className={user.isActive ? "tdColor green" : "tdColor grey"}>{user.isActive ? "Активен" : "Не активен"}</td>
                                <td title={user.Role === 1 ? "Пользователям с ролью \"Администратор\" доступна работа со всеми медицинскими организациями" : ""}>
                                    {user.Role === 1 ? "Все медицинские организации" : getMosListForTable(user.Mos)}</td>
                                <td>{getFormattedData(user.Created)}</td>
                                <td>{getFormattedData(user.LastUpdated)}</td>
                                <td className="emptyCell">
                                    <UpdateButton
                                        onClick={() => formOpen(user)}
                                    />
                                    <div className="emptyCellContentVisor"/>
                                </td>
                            </tr>
                        )
                }
                </tbody>
            </table>
        </div>
        <Modal
            active={isModalActive}
            setActive={setIsModalActive}
        >
            <UserForm
                user={userToForm}
                modalIsOpen={isModalActive}
            />
        </Modal>
    </div>);
};

export default UsersBoard;