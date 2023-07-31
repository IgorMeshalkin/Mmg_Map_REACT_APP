export const setModalActive = (modalBackgroundRef, modalWindowRef) => {
    if (modalBackgroundRef.current.className === 'background active') {
        modalBackgroundRef.current.className = 'background'
        modalWindowRef.current.className = 'window'
    } else if (modalBackgroundRef.current.className === 'background') {
        modalBackgroundRef.current.className = 'background active'
        modalWindowRef.current.className = 'window active'
    }
}