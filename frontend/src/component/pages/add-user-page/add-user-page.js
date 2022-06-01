import { Button } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "tabler-icons-react";
import moment from "moment";
import {useNavigate} from 'react-router-dom'
import DataEntry from "../../inputForm";
import { useAddResidentMutation, useGetFlatsQuery } from "../../../slice/biller-slices";

const initalFormData = {
  name: {
    value: "",
    valueStr() {
      return this.value;
    },
    label: "Name",
    type: "text",
    required: true,
  },
  phone: {
    value: "",
    valueStr() {
      return this.value;
    },
    label: "Phone Number",
    type: "text",
    required: true,
  },
  nid: {
    value:0,
    valueStr() {
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
    value: null,
    type: "select",
    label: "flat Room",
    valueStr() {
      return this.value;
    },
    dataSource:useGetFlatsQuery,
    unpackItem:(item)=>{return {value:item.id,label:item.room_id}},
    required: true,
  },
  rent_history: {
    value:0,
    valueStr() {
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
  rent_history:"",
  flat:""
};

function AddUserPage() {
  const navigate=useNavigate();
  const [addResident,{}]=useAddResidentMutation();




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
      
        <DataEntry
          addData={addResident}
          initialData={initalFormData}
          errorTextInitial={initalErrorText}
          successMessage="New Resident has been added"
        />
        

      </div>
    </section>
  );
}

export default AddUserPage;
