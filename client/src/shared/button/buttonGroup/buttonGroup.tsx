import React, { FC } from "react";
import styles from "./buttonGroup.module.scss";

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
        <div className={`${styles.group} ${className || ""}`.trim()}>
            {items.map((item, idx) => (
                <button
                    key={idx}
                    onClick={item.onClick}
                    className={
                        item.active ? `${styles.button} ${styles.active}` : styles.button
                    }
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};
