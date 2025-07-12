import React, { FC } from "react";
import styles from "./buttonGroup.module.scss";
import {useTelegram} from "../../../hooks/useTelegram";


interface RangeButton {
    label: string;
    onClick: () => void;
    active: boolean;
    icon?: React.ReactNode;
    haptic?: "light" | "medium" | "heavy" | "soft" | "rigid";
}

interface ButtonGroupProps {
    items: RangeButton[];
    className?: string;
}

export const ButtonGroup: FC<ButtonGroupProps> = ({ items, className }) => {
    const { tg } = useTelegram();

    const handleClick = (item: RangeButton) => {
        if (item.haptic) {
            tg?.HapticFeedback?.impactOccurred(item.haptic);
        }
        item.onClick();
    };

    return (
        <div className={`${styles.group} ${className || ""}`.trim()}>
            {items.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => handleClick(item)}
                    className={
                        item.active ? `${styles.button} ${styles.active}` : styles.button
                    }
                >
                    {item.icon && <span className={styles.icon}>{item.icon}</span>}
                    {item.label}
                </button>
            ))}
        </div>
    );
};
