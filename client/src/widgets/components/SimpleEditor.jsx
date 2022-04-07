import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";

export default forwardRef((props, ref) => {
    const inputRef = useRef();
    const [value, setValue] = useState('');

    function inputHandler(e) {
        setValue(e.target.value);
    }

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value;
            },
            afterGuiAttached: () => {
                setValue(props.value);
                inputRef.current.focus();
                inputRef.current.select();
            }
        };
    });

    return (
        <input
            type="text"
            className="ag-input-field-input ag-text-field-input"
            ref={inputRef}
            onChange={inputHandler}
            value={value}
            placeholder={'Enter ' + props.column.colId}
        />
    )
})