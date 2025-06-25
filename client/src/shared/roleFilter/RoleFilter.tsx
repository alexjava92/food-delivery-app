import React from "react";
import styles from "./RoleFilter.module.scss";

interface Role {
    id: number;
    role: string;
    name: string;
}

interface Props {
    roles: Role[];
    selected: string;
    onSelect: (value: string) => void;
}

export const RoleFilter: React.FC<Props> = ({ roles, selected, onSelect }) => {
    return (
        <div className={styles.tabs}>
            {roles.map((r) => (
                <button
                    key={r.id}
                    className={`${styles.tab} ${selected === r.role ? styles.active : ""}`}
                    onClick={() => onSelect(r.role)}
                >
                    {r.name}
                </button>
            ))}
        </div>
    );
};