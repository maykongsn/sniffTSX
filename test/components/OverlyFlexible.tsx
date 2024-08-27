import React from 'react';

type InputProps = Record<string, unknown>

interface ButtonProps extends Record<string, unknown> {
  label: string;
}

const Input = ({ label, ...rest }: InputProps) => {
  return (
    <>
      <label>{label}</label>
      <input name={label} {...rest} />
    </>
  )
}

function Button({ label, ...rest }: ButtonProps) {}

function Component(props: { name: string } & Record<string, unknown>) {}