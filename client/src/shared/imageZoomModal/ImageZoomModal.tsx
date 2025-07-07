import React, { useEffect, useState } from "react";
import classes from './ImageZoomModal.module.scss';

interface Props {
    src: string;
    onClose: () => void;
}

export const ImageZoomModal: React.FC<Props> = ({ src, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // плавное появление
        setVisible(true);
        // блокируем прокрутку фона
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div
            className={`${classes.zoomOverlay} ${visible ? classes.visible : ''}`}
            onClick={onClose}
        >
            <img
                src={src}
                alt="product"
                className={classes.zoomImage}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
};
