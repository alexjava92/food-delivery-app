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
    const [{ scale, x, y }, api] = useSpring(() => ({ scale: 1, x: 0, y: 0 }));

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
            onDrag: ({ offset: [dx, dy] }) => api.start({ x: dx, y: dy }),
            onWheel: ({ offset: [, s] }) => api.start({ scale: 1 + s / 100 }),
        },
        {
            pinch: { scaleBounds: { min: 1, max: 3 }, rubberband: true },
            drag: { rubberband: true }
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
                style={{ scale, x, y }}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
};
