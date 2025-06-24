import React, {FC} from "react";
import {useNavigate} from "react-router-dom";
import {ArrowIconBack} from "../shared/images/icons/arrowIconBack";

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
    return (
        <div className={tg?.colorScheme === 'light' ? 'container' : 'container darkTheme'}>
            <h1 className={textCenter ? "h1 textCenter" : "h1"}>
                {!homePage &&
                    <span className={"back"} onClick={() => navigate(-1)}>
                    <ArrowIconBack/>
                  </span>
                }
                <span>{heading}</span>
            </h1>
            {isSearch && <Search url={'search?search'}/>}
            {children}
            <div className="menuBg"></div>
        </div>
    );
};
