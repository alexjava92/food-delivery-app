import React, { useEffect, useState } from "react";

export const useInput = (
    initialValue: any,
    errorInput?: boolean,
    clear?: boolean,
    noValidate?: boolean
) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (errorInput) {
            setError(errorInput);
        }
    }, [errorInput]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(e.target.value);
        if (e.target.value !== value) {
            setVisible(true);
        }
        if (e.target.value !== "" && !noValidate) {
            setError(false);
        }
    };

    return {
        value,
        onChange,
        error,
        setError,
        visible,
        setValue,     // ← добавлено
        setVisible,   // ← добавлено
    };
};
