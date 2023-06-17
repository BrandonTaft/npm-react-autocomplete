import { useEffect } from "react";

export default function useOnOutsideClick(ref, onOutsideClick, disabled) {

    useEffect(() => {
        const triggered = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                if (!e.target.classList.contains('ignore')) {
                    onOutsideClick()
                };
            };
        };
        if (!disabled) {
            document.addEventListener("mousedown", triggered);
            document.addEventListener("touchstart", triggered);
        };
        return () => {
            document.removeEventListener("mousedown", triggered);
            document.removeEventListener("touchstart", triggered);
        };
    },[ref, onOutsideClick, disabled]);
};