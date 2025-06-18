import React, {ChangeEvent, FC, memo} from "react";
import classes from "./textField.module.scss";
import imgBg from "../images/product-settings-bg.png";

interface IType {
    type?: string;
    label?: string;
    placeholder?: string;
    value?: any;
    onChange?: (val: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    onChangeFile?: (val: any) => void;
    description?: boolean;
    error?: boolean;
    borderAccent?: boolean;
}

export const TextField: FC<IType> = memo(({placeholder, borderAccent, type, label, value, onChange, onChangeFile, description, error}) => {

        return (
            <>
                {type === "file" ?
                    <label className={classes.labelFile}>
                        <span className={classes.image}>
                          <img src={imgBg} alt="подложка"/>
                        </span>
                        <input
                            className={classes.inputFile}
                            type="file"
                            onChange={(e) =>
                                onChangeFile && onChangeFile(e?.target?.files?.[0])
                            }
                        />
                        {error && <span className={`error ${classes.errorFile}`}>Файл не выбран</span>}
                    </label>
                    :
                    <>
                        <label className={classes.label}>
                            {label && <span className={classes.text}>{label}</span>}

                            {
                                description ?
                                    <textarea className={classes.textarea} placeholder="Описание" value={value}
                                              onChange={onChange}></textarea>
                                    :
                                    <input
                                        className={borderAccent ? classes.borderAccent : classes.input}
                                        type={type ? type : "text"}
                                        placeholder={placeholder ? placeholder : ''}
                                        value={value}
                                        onChange={onChange}/>

                            }
                        </label>
                        {error && <span className={"error"}>Поле обязательно к заполнению</span>}

                    </>
                }
            </>
        );
    }
);
