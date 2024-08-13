import React from "react";

type MyType = Array<any>;
type Other = string | any;

export function Any(props: any) {
  return (
    <div>
      {...props}
    </div>
  )
}