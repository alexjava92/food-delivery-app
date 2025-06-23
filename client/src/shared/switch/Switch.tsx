// shared/switch/switch.tsx

import React, { FC } from "react";
import classes from "./switch.module.scss";

interface SwitchProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

export const Switch: FC<SwitchProps> = ({ checked, onChange, disabled = false }) => {
    return (
        <label className={classes.switch}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <span className={classes.slider}></span>
        </label>
    );
};
