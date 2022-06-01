import { Button } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "tabler-icons-react";
import moment from "moment";
import {useNavigate} from 'react-router-dom'
import DataEntry from "../../inputForm";
import { API_BASE_URL } from "../../../constant";
import { useGetFlatsQuery } from "../../../slice/biller-slices";

const initalFormData = {
  name: {
    value: "",
    value_str() {
      return this.value;
    },
    label: "Name",
    type: "text",
    required: true,
  },
  phone: {
    value: "",
    value_str() {
      return this.value;
    },
    label: "Phone Number",
    type: "text",
    required: true,
  },
  nid: {
    value:0,
    value_str() {
      return this.value;
    },
    label: "NID Card Number",
    type: "number",
    required: false,
  },
  join: {
    value: new Date(),
    type: "date",
    label: "তারিখ",
    valueStr() {
      return moment(this.value).format("YYYY-MM-DD");
    },
    required: true,
  },
  flat: {
    value: "",
    type: "select",
    label: "flat Room",
    valueStr() {
      return this.value;
    },
    data:[
        {value:1,label:"A@"}
    ],
    required: true,
  },
  rent: {
    value:0,
    value_str() {
      return this.value;
    },
    label: "Rent",
    type: "number",
    required: true,
  },
};

const initalErrorText = {
  name: "",
  join: "",
  phone: "",
  nid: "",
};

function AddUserPage() {
  const navigate=useNavigate();
  const {data:flatData,isLoading}=useGetFlatsQuery();
  useEffect(()=>{
    if(flatData){
      initalFormData.flat.data=[...Object.keys(flatData).map(k=>{
        return {value:k,label:k}
      })];
      
    }
  },[isLoading])


  return (
    <section>
      <div>
        <Button variant="subtle"
         color={"dark"} 
         onClick={()=>{
           navigate('/home')
         }} 
         >
          <ArrowLeft size={30} />
        </Button>
      </div>

      <h1 className="text-center">Add New User</h1>

      <div className="container">
        {isLoading?null:
        <DataEntry
          initialData={initalFormData}
          errorTextInitial={initalErrorText}
        />
        }

      </div>
    </section>
  );
}

export default AddUserPage;
