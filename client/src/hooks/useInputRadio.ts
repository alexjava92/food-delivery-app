import React, {ChangeEvent, useEffect, useMemo, useState} from "react";


export const useInputRadio = (initialValue: any) => {
    const [value, setValue] = useState(initialValue)
    const [checked, setChecked] = useState(initialValue)


    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        setChecked(e.target.checked)
    }

    return {
        value,checked, onChange
    }
}