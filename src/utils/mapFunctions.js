import placemarkHospital from '../images/plasemarks/hospital.png'


import {getRatingProperties} from "./MOsDictionary";
import {logDOM} from "@testing-library/react";
export const setSmallInfoBoard = (boardRef, nameRef, addressRef, planRef, completePercentRef, moreButtonRef, mo, week) => {
    if (boardRef.current.className === 'ibBlock') {
        boardRef.current.className = 'ibBlock open'
    } else if (boardRef.current.className === 'ibBlock open'
        && (nameRef.current.innerHTML === mo.Name && addressRef.current.innerHTML === mo.Address)) {
        boardRef.current.className = 'ibBlock'
    }

    nameRef.current.innerHTML = mo.Name
    addressRef.current.innerHTML = mo.Address

    if (mo.PartialData !== null) {
        if (mo.PartialData.PercentageOfCompletion >= week.Target) {
            completePercentRef.current.className = 'ibRegularValue green';
        } else {
            completePercentRef.current.className = 'ibRegularValue red';
        }
        planRef.current.className = 'ibRegularValue';
        planRef.current.innerHTML = mo.PartialData.YearPlan
        completePercentRef.current.innerHTML = mo.PartialData.PercentageOfCompletion.toFixed(2) + "%"
        moreButtonRef.current.className = 'ibMoreButton'
    } else {
        completePercentRef.current.className = 'ibHidden';
        planRef.current.className = 'ibHidden';
    }
}

export const getPlacemark = () => {
    return placemarkHospital;
}

// export const getIcon = (type) => {
//     let result;
//     switch (type) {
//         case 'Поликлиника':
//             result = iconPoliclinic;
//             break;
//         case 'Диспансер':
//             result = iconDispensary;
//             break;
//         case 'Родильный дом':
//             result = iconMternityHospital;
//             break;
//         case 'Станция скорой помощи':
//             result =iconAmbulance;
//             break;
//         case 'Станция переливания крови':
//             result = iconBloodTransfusion;
//             break;
//         case 'Аптека':
//             result = iconPharmacy;
//             break;
//         case 'Пункт вакцинации':
//             result = iconVaccination;
//             break;
//         default:
//             result = iconHospital;
//     }
//     return result;
// }
