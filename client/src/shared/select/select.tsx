import React, { FC, memo } from "react";
import classes from './select.module.scss';

interface IType {
    onChange: (value: string) => void;
    dataOption: Array<string | number>;
    initValue?: string | number;
}

export const Select: FC<IType> = memo(({ onChange, dataOption, initValue }) => {
    return (
        <select
            className={classes.select}
            value={initValue}
            onChange={(e) => onChange(e.target.value)}
        >
            {dataOption.map((item, index) => (
                <option key={index} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
});
