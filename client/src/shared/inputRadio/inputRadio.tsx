import React, {FC} from "react";
import classes from "./inputRadio.module.scss";

interface IType {
    value?: any;
    onChange: (val: any) => void;
    name?: string
    label?: string
    checked?: any
}

export const InputRadio: FC<IType> = ({checked, value, onChange, name, label}) => {

    return (
        <label className={classes.label}>
            <input className={classes.customRadio} type="radio" name={name} value={value}
                   onChange={e => onChange(e.target.value)}
            />
            <span></span>
            <span className={classes.text}>{label}</span>
        </label>
    );
};
