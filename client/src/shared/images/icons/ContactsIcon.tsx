import React, { FC } from 'react';

interface IType {
    isSimple?: boolean;
}

export const ContactsIcon: FC<IType> = ({ isSimple }) => {
    return (
        <div>
            {isSimple && (
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
                        fill="currentColor"
                    />
                    <path
                        d="M21 10C21 16 12 22 12 22C12 22 3 16 3 10C3 6.68629 5.68629 4 9 4C10.6569 4 12.1566 4.84285 13 6.0815C13.8434 4.84285 15.3431 4 17 4C20.3137 4 23 6.68629 23 10Z"
                        fill="currentColor"
                    />
                </svg>
            )}
        </div>
    );
};
