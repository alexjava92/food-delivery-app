import React, { useEffect, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { X } from "lucide-react";
import classes from './ImageZoomModal.module.scss';

interface Props {
    src: string;
    onClose: () => void;
}

export const ImageZoomModal: React.FC<Props> = ({ src, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [{ scale }, api] = useSpring(() => ({ scale: 1 }));

    useEffect(() => {
        setVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const bind = useGesture(
        {
            onPinch: ({ offset: [s] }) => api.start({ scale: s }),
            onWheel: ({ offset: [, s] }) => api.start({ scale: 1 + s / 100 }),
        },
        {
            pinch: { scaleBounds: { min: 1, max: 3 }, rubberband: true },
        }
    );

    return (
        <div
            className={`${classes.zoomOverlay} ${visible ? classes.visible : ''}`}
            onClick={onClose}
        >
            <div
                className={classes.closeButton}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <X size={28} color="#fff" />
            </div>

            <animated.img
                {...bind()}
                src={src}
                alt="product"
                className={classes.zoomImage}
                style={{ scale }}
                onClick={onClose} // клик по фото — тоже закрывает
            />
        </div>
    );
};
