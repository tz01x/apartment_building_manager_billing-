import React from "react";
import {  NativeSelect } from "@mantine/core";

function GenericSelectInput({ dataSource, handelForm, name, value, label , unpackItem,error}) {
  const {data,isLoading}=dataSource();
  return (
    <>
    {isLoading?null:<NativeSelect
        defaultValue={null}
        radius="md"
          size="lg"
      data={data.map(unpackItem)}
      name={name}
      onChange={(e) => {
        handelForm(name, e.target.value);
      }}
      value={value}
      label={label}
      error={error}
    />}
    </>
  );
}

export default GenericSelectInput;
