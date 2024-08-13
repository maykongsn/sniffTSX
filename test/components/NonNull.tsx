import React from "react";

interface Data {
  prop1: string;
  prop2: number;
}

interface Props {
  data: Data | null;
}

export function Component({ data }: Props): JSX.Element {
  return(
    <div>
      <p>{data!.prop1}</p>
      <p>Teste</p>
      <p>{data!.prop2}</p>
      <h1>Testando</h1>
    </div>
  )
}