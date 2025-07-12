import React, {FC, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {ArrowIconBack} from "../shared/images/icons/arrowIconBack";
import classes from "./MainLayout.module.scss"
import {Search} from "../entities/search/search";
import {useTelegram} from "../hooks/useTelegram";


interface IType {
    children?: React.ReactNode;
    heading?: string;
    homePage?: boolean;
    textCenter?: boolean;
    isSearch?: boolean;
}

export const MainLayout: FC<IType> = ({children, heading, homePage, textCenter, isSearch,}) => {
    const {tg} = useTelegram();
    const navigate = useNavigate();

    useEffect(() => {
        if (!homePage && tg?.BackButton) {
            tg.BackButton.show();
            const handleBack = () => navigate(-1);
            tg.BackButton.onClick(handleBack);

            return () => {
                tg.BackButton.hide();
                tg.BackButton.offClick(handleBack);
            };
        }
    }, [tg, homePage, navigate]);


    return (
        <div className={tg?.colorScheme === 'light' ? 'container' : 'container darkTheme'}>
            <div className={classes.pageHeader}>
            {/*    {!homePage &&
                    <span className={classes.back} onClick={() => navigate(-1)}>
                <ArrowIconBack />
            </span>
                }*/}
                <h1 className={`${classes.h1} ${textCenter ? classes.textCenter : ''}`}>
                    {heading}
                </h1>
            </div>

            {isSearch && <Search url={'search?search'} />}
            {children}
            <div className="menuBg"></div>
        </div>

    );
};
