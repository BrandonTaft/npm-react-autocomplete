"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useOnOutsideClick;
var _react = require("react");
function useOnOutsideClick(ref, onOutsideClick, disabled) {
  (0, _react.useEffect)(() => {
    const triggered = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (!e.target.classList.contains('ignore')) {
          onOutsideClick();
        }
        ;
      }
      ;
    };
    if (!disabled) {
      document.addEventListener("mousedown", triggered);
      document.addEventListener("touchstart", triggered);
    }
    ;
    return () => {
      document.removeEventListener("mousedown", triggered);
      document.removeEventListener("touchstart", triggered);
    };
  }, [ref, onOutsideClick, disabled]);
}
;