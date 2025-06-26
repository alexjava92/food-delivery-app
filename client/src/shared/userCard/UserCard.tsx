// components/UserCard.tsx
import React from "react";
import classes from "./UserCard.module.scss";
import {Button} from "../button/button";

interface Role {
    id: number;
    role: string;
    name: string;
}

interface Props {
    id: string;
    username: string;
    chatId: string;
    name?: string;
    role: string;
    currentEdited?: string;
    roles: Role[];
    onChange: (id: string, value: string) => void;
    onSave: (id: string) => void;
    phone: string;
}

export const UserCard: React.FC<Props> = ({
                                              id,
                                              username,
                                              chatId,
                                              name,
                                              role,
                                              currentEdited,
                                              roles,
                                              phone,
                                              onChange,
                                              onSave,

                                          }) => {
    const roleChanged = currentEdited && currentEdited !== role;

    return (
        <div className={classes.card}>
            <div className={classes.header}>
                <div className={classes.userInfo}>
                    <div className={classes.name}>{username || chatId}</div>
                    <div className={classes.meta}>ID: {id}</div>
                    {name && <div className={classes.meta}>{name}</div>}
                    {phone && <div className={classes.meta}>{phone}</div>}
                </div>
            </div>
            <div className={classes.controls}>
                <select
                    className={classes.select}
                    value={currentEdited ?? role}
                    onChange={(e) => onChange(id, e.target.value)}
                >
                    {roles
                        .filter((r) => r.role !== "")
                        .map((r) => (
                            <option key={r.id} value={r.role}>
                                {r.name}
                            </option>
                        ))}
                </select>
                <Button
                    size={"small"}
                    disabled={!roleChanged}
                    onClick={() => onSave(id)}
                >
                    Сохранить
                </Button>
            </div>
        </div>
    );
};
