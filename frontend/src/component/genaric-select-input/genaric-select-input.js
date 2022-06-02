import React from "react";
import {  NativeSelect , MultiSelect} from "@mantine/core";

function GenericSelectInput({ dataSource, handelForm, name, value, label , unpackItem,error,multi=false}) {
  const {data,isLoading}=dataSource();
  if(multi){
    return (
      <>
      {isLoading?null:<MultiSelect
          placeholder="Pick one"
          radius="md"
            size="lg"
        data={data.map(unpackItem)}
        name={name}
        onChange={(value) => {
          handelForm(name, value);
        }}
        
        value={value}
        label={label}
        error={error}
      />}
      </>
    );
  }
  return (
    <>
    {isLoading?null:<NativeSelect
        placeholder="Pick one"
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
