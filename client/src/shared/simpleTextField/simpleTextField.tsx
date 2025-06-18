import React, {FC, memo} from "react";
import classes from "./simpleTextField.module.scss";
import ReactInputMask from "react-input-mask";

interface IType {
    type?: string;
    label?: string;
    value?: any;
    placeholder?: string;
    onChange?: (val: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: boolean;
    borderAccent?: boolean;
    description?: boolean
}

export const SimpleTextField: FC<IType> = memo(({placeholder, type, label, value, onChange, error, borderAccent, description}) => {
    if (description) {
        return (
            <textarea
                className={classes.textarea}
                placeholder="Описание"
                value={value}
                onChange={onChange}
            ></textarea>
        );
    }

    if (type === "phone") {
        return (
            <label className={classes.label}>
                {label && <span className={classes.text}>{label}</span>}
                <ReactInputMask
                    className={borderAccent ? `${classes.input} ${classes.borderAccent}` : `${classes.input}`}
                    placeholder={placeholder}
                    mask={'+7 999 999 99 99'}
                    value={value}
                    onChange={onChange}
                />
                {error && <span className="error">Поле обязательно к заполнению</span>}
            </label>
        );
    }

    return (
        <label className={classes.label}>
            {label && <span className={classes.text}>{label}</span>}
            <input
                className={borderAccent ? `${classes.input} ${classes.borderAccent}` : `${classes.input}`}
                placeholder={placeholder}
                type="text"
                value={value}
                onChange={onChange}
            />
            {error && <span className="error">Поле обязательно к заполнению</span>}
        </label>
    );
});
