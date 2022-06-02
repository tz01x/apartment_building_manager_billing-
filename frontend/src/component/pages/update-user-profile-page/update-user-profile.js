import React, { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, THEME_ICON_SIZES } from "@mantine/core";
import { ArrowLeft } from "tabler-icons-react";
import moment from "moment";
import DataEntry from "../../inputForm";
import { useGetExtraChargesQuery, useGetFlatsQuery,useGetResidentQuery, useUpdateResidentMutation } from "../../../slice/biller-slices";

const initalErrorText = {
    name: "",
    join: "",
    phone: "",
    nid: "",
    rent_history:"",
    flat:"",
    extraCharge:""
  };

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
    flat: {
      value: "",
      type: "select",
      label: "Room NO.",
      valueStr() {
        return this.value;
      },
      dataSource:useGetFlatsQuery,
      unpackItem:(item)=>{return {value: String(item.id),label:item.room_id}},
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
    extraCharge: {
      value: [],
      multi:true,
      type: "select",
      label: "Extra Charges",
      valueStr() {
        return this.value;
      },
      dataSource:useGetExtraChargesQuery,
      unpackItem:(item)=>{return {value:String(item.id),label:`${item.title} ${item.amount} Tk`}},
      required: true,
    },
    join: {
        value: new Date(),
        type: "date",
        label: "তারিখ",
        valueStr() {
          return moment(this.value).format("YYYY-MM-DD");
        },
        required: true,
        hidden:true,
      },
  };
  

function UpdateUserProfile() {
  const params = useParams();
  const navigation = useNavigate();
  const { data,isLoading } = useGetResidentQuery(params.slug);
  const [formInitial,setFormInitial]=useState({});

  const [updateResident,{isError}]=useUpdateResidentMutation()

  useEffect(()=>{
      if(data){
        const tempData={...initalFormData}
        initalFormData.flat.value=data.flat.id;
        initalFormData.name.value=data.name;
        initalFormData.phone.value=data.phone;
        initalFormData.rent_history.value=data.rent;
        initalFormData.nid.value=Number(data.nid);
        initalFormData.join.value=new Date(data.join);
        initalFormData.extraCharge.value=data.extraCharge.map((item)=>String(item.id));
        setFormInitial({...tempData});
        console.log(data)
        // currently_staying: true

      }
  },[isLoading])

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center">
        <Button
          variant="subtle"
          color="dark"
          size="md"
          title="back"
          aria-label="back"
          onClick={() => {
            navigation("/profile/"+params.slug);
          }}
        >
          <ArrowLeft size={20} strokeWidth={2} color={"black"} />
        </Button>
        <h1 className="flex-grow-1 text-center">Update Profile</h1>
        <div></div>
      </div>
      <hr></hr>
      {isLoading?null:
      <DataEntry
      addData={updateResident}
      initialData={initalFormData}
      errorTextInitial={initalErrorText}
      successMessage="Updated Resident has been added"
      extraParams={{slug:params.slug}}
      onSuccess={()=>{
          console.log('updated')
      }}
    />
      }
      

    </Container>
  );
}

export default UpdateUserProfile;
