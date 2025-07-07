// components/ImageZoomModal.tsx
import React, { useEffect, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import classes from './ImageZoomModal.module.scss';

interface Props {
    src: string;
    onClose: () => void;
}

export const ImageZoomModal: React.FC<Props> = ({ src, onClose }) => {
    const [{ scale, x, y }, api] = useSpring(() => ({ scale: 1, x: 0, y: 0 }));
    const [visible, setVisible] = useState(false);
    let lastTap = 0;

    useEffect(() => {
        setVisible(true);
    }, []);

    const bind = useGesture(
        {
            onPinch: ({ offset: [s] }) => api.start({ scale: s }),
            onDrag: ({ offset: [dx, dy] }) => api.start({ x: dx, y: dy }),
            onWheel: ({ offset: [, s] }) => api.start({ scale: 1 + s / 100 }),
            onDragEnd: ({ movement: [, my] }) => {
                if (my > 100) onClose();
            }
        },
        {
            pinch: { scaleBounds: { min: 1, max: 3 }, rubberband: true },
            drag: {
                bounds: {
                    left: -window.innerWidth / 2,
                    right: window.innerWidth / 2,
                    top: -window.innerHeight / 2,
                    bottom: window.innerHeight / 2
                },
                rubberband: true
            }
        }
    );

    const handleDoubleTap = (e: React.MouseEvent) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            api.start({ scale: 2 });
        }
        lastTap = now;
        e.stopPropagation();
    };

    return (
        <div
            className={`${classes.zoomOverlay} ${visible ? classes.visible : ''}`}
            onClick={onClose}
        >
            <animated.img
                {...bind()}
                src={src}
                className={classes.zoomImage}
                style={{ scale, x, y }}
                onClick={handleDoubleTap}
            />
        </div>
    );
};
