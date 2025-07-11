import React, { FC } from 'react';

interface IType {
    isSimple?: boolean;
}

export const ContactsIcon: FC<IType> = ({ isSimple }) => {
    return (
        <div>
            {isSimple && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21 10.5C21 16.299 12 22 12 22C12 22 3 16.299 3 10.5C3 7.18629 5.68629 4.5 9 4.5C10.7227 4.5 12.2685 5.34988 13.0833 6.66667C13.8981 5.34988 15.4439 4.5 17.1667 4.5C20.4804 4.5 23.1667 7.18629 23.1667 10.5H21Z"
                        fill="currentColor"
                    />
                </svg>
            )}
        </div>
    );
};
