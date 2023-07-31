import React, {useContext, useState} from 'react';
import "./MosBoard.css"
import {getFormattedData} from "../../utils/otherUsefullFunctions";
import UpdateButton from "../UI/UpdateButton/UpdateButton";
import Modal from "../Modals/Modal/Modal";
import Input from "../UI/Input/Input";
import AddButton from "../UI/AddButton/AddButton";
import MosForm from "./MosForm/MosForm";
import {AuthContext} from "../../context/context";

const MosBoard = ({mos}) => {
    const {currentUser} = useContext(AuthContext)
    //открыто ли модальное окно содержащее форму создания/изменения медицинской организации
    const [isModalActive, setIsModalActive] = useState(false)
    //содержимое строки поиска
    const [searchString, setSearchString] = useState('')
    //медицинская организация которая передаётся в форму для редактирования или null если создается новая медицинская организация.
    const [moToForm, setMoToForm] = useState(null)

    //открывает форму создания/изменения медицинской организации и добавляет туда изменяемую медицинскую организацию.
    const formOpen = (mo) => {
        setMoToForm(mo)
        setIsModalActive(true)
    }

    return (
        <div className="mosbMain">
            <div className="mosbTitle">Медицинские организации</div>
            <div className="mosbSearchLineOutContainer">
                <div className="mosbSearchLineInnerContainer">
                    <Input
                        placeholder={"Поиск по названию или адресу"}
                        setString={setSearchString}
                    />
                </div>
                {
                    currentUser.Role === 1 &&
                    <div className="mosbAddMoButtonContainer">
                        <AddButton
                            title={"Добавить новую медицинскую организацию"}
                            onClick={() => formOpen(null)}
                        />
                    </div>
                }
            </div>
            <div className="mosbTableContainer">
                <table>
                    <thead>
                    <tr>
                        <th rowSpan={2}>Название</th>
                        <th rowSpan={2}>Адрес</th>
                        <th colSpan={3}>Сотрудник ответственный за предоставление сведений</th>
                        <th rowSpan={2}>Дата добавления</th>
                        <th rowSpan={2}>Дата последнего изменения</th>
                        <th className="emptyCell" rowSpan={2}/>
                    </tr>
                    <tr>
                        <th>ФИО</th>
                        <th>Телефон</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        mos
                            .filter(mo => mo.Name.toLowerCase().includes(searchString.toLowerCase()) || mo.Address.toLowerCase().includes(searchString.toLowerCase()))
                            .map(mo =>
                                <tr key={mo.Id} className="bodyTr">
                                    <td>{mo.Name}</td>
                                    <td>{mo.Address}</td>
                                    <td>{mo.ResponsibleEmployeeFIO}</td>
                                    <td>{mo.ResponsibleEmployeePhoneNumber}</td>
                                    <td>{mo.ResponsibleEmployeeEmail}</td>
                                    <td>{getFormattedData(mo.Created)}</td>
                                    <td>{getFormattedData(mo.LastUpdated)}</td>
                                    <td className="emptyCell">
                                        <UpdateButton
                                            onClick={() => formOpen(mo)}
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
                <MosForm
                    mo={moToForm}
                    modalIsOpen={isModalActive}
                />
            </Modal>
        </div>
    );
};

export default MosBoard;