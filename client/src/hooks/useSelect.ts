import React, {useEffect, useState} from "react";


export const useSelect = (initialValue: any, errorSelect?: boolean) => {
    const [value, setValue] = useState(initialValue)
    const [error, setError] = useState(false)
    useEffect(() => {
        if (errorSelect) {
            setError(errorSelect)
        }
    }, [errorSelect])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setValue(e.target.value)
        if (e.target.value === '') {
            setError(true)
        } else {
            setError(false)
        }
    }

    return {
        value, onChange, error
    }
}