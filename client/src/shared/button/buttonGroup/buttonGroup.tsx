import React, { FC } from "react";

import styles from "./buttonGroup.module.scss";
import {Button} from "../button";

interface RangeButton {
    label: string;
    onClick: () => void;
    active: boolean;
    haptic?: "light" | "medium" | "heavy" | "soft" | "rigid";
}

interface ButtonGroupProps {
    items: RangeButton[];
    className?: string;
}

export const ButtonGroup: FC<ButtonGroupProps> = ({ items, className }) => {
    return (
        <div className={`${styles.group} ${className || ""}`}>
            {items.map((item, idx) => (
                <Button
                    key={idx}
                    size="small"
                    active={item.active}
                    onClick={item.onClick}
                    className={styles.compact}
                    haptic={item.haptic || "light"}
                >
                    {item.label}
                </Button>
            ))}
        </div>
    );
};
