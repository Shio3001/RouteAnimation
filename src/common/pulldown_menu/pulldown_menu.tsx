import * as React from "react";
const { useContext, useReducer, createContext, useState, useEffect } = React;
import { createRoot } from "react-dom/client";

type props = {
  flowUp: Function;
  view_options: Array<string>;
  unselected?: boolean;
  selected?: number;
};

const PulldownMenu = (props: props) => {
  const [selectIndex, setSelectIndex] = useState(!props.selected ? -1 : props.selected);

  const onChangeEvent = (event: any) => {
    console.log(event, event.target.value);
    const value: number = event.target.value as number;

    console.log("onChangeEvent", value);
    setSelectIndex(value);
    props.flowUp(value);
  };

  return (
    <>
      <select value={selectIndex} onChange={onChangeEvent}>
        {props.view_options.map((view, index) => {
          return (
            <option key={index} value={index}>
              {view}
            </option>
          );
        })}
      </select>
    </>
  );
};
export default PulldownMenu;