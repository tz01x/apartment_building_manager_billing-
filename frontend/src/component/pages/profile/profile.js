import { Container, useMantineTheme, Table } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { Avatar, Button } from "@mantine/core";

import moment from "moment";
import {
  Phone,
  Building,
  CircleCheck,
  CircleOff,
  ReportMoney,
  AddressBook,
  ArrowLeft,
} from "tabler-icons-react";
import {
  useGetMonthlyRentLogMutation,
  useGetResidentQuery,
} from "../../../slice/biller-slices";

function Profile() {
  const params = useParams();
  const navigation=useNavigate()

  const { data, isLoading } = useGetResidentQuery(params.slug);
  const [rows, setRows] = useState([]);

  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  const [getMonthlyRentLog, { isLoading: isRentLogLoading }] =
    useGetMonthlyRentLogMutation();

  const fetchData = async () => {
    const rentLog = await getMonthlyRentLog(data.slug);

    if (rentLog.error) return;

    const tempRow = Object.values(rentLog.data).map((element) => (
      <tr key={element.id}>
        <td>{moment(new Date(element.created)).format("d MMMM, YYYY")}</td>
        <td>{moment(new Date(element.date)).format("MMMM  YYYY")}</td>
        <td>{element.rent_paid} </td>
        <td>{element.electricity_bill_paid} (BDT)</td>
        <td>{element.rent_for_this_month} (BDT)</td>
        <td>{element.calculated_bill} (BDT)</td>
      </tr>
    ));

    setRows([...tempRow]);
  };

  useEffect(() => {
    if (data) {
     
    }
  }, [data]);

  return (
    <Container>
      <div className="d-flex justify-content-between">

      
      <Button
        variant="subtle"
        color="dark"
        size="md"
        title="back"
        aria-label="back"
        onClick={()=>{
          navigation('/')
        }}
      >
        <ArrowLeft size={20} strokeWidth={2} color={"black"} />
      </Button>
      <Button
        variant="filled"
        color="cyan"
        size="md"
        title="back"
        aria-label="back"
        onClick={()=>{
          navigation('/profile/update/'+params.slug)
        }}
      >
        Update Profile
      </Button>
      </div>
      <hr></hr>

      {!isLoading && basicInfo(secondaryColor, data)}

      <div className="mt-5 pt-4" style={{ color: secondaryColor }}>
        <h3>Extra charges</h3>
        {!isLoading && (
          <ul>
            {Object.values(data.extraCharge).map((item) => {
              return (
                <li key={item.id}>
                  {item.title} : {item.amount} (BDT)
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-5 pt-4" style={{ color: secondaryColor }}>
        <h3>Monthly Rent Log</h3>
        <hr></hr>
        <div className="coustomTable">
          <Table striped highlightOnHover verticalSpacing="sm" fontSize="sm">
            <thead>
              <tr>
                <th>paid in</th>
                <th>paid for</th>
                <th>paid Rent (BDT)</th>
                <th>paid electricity build (BDT)</th>
                <th>Actual Rent (BDT)</th>
                <th>Actual electricity build (BDT)</th>
              </tr>
            </thead>
            {!isRentLogLoading && <tbody>{rows}</tbody>}
          </Table>
        </div>
      </div>
    </Container>
  );
}

export default Profile;
function basicInfo(secondaryColor, data) {
  return (
    <div
      className="d-flex gap-3 align-items-center"
      style={{ color: secondaryColor }}
    >
      <Avatar
        className="align-self-start"
        radius="lg"
        size="xl"
        color="cyan"
        src={data.pictureUrl}
      />
      <div className="flex-grow-1">
        <h2 className="d-flex align-items-center gap-1">
          {data.name}

          {data.currently_staying ? (
            <CircleCheck size={30} strokeWidth={2.5} color={"#43bf40"} />
          ) : (
            <CircleOff size={30} strokeWidth={2.5} color={"#bf4040"} />
          )}
        </h2>
        <div className="row w-100">
          <div className="col-sm-4">
            <span className="d-flex align-items-center gap-1  mt-2">
              <Phone size={20} strokeWidth={1.5} color={"#4040bf"} />
              <strong>{data.phone}</strong>
            </span>
            <span className="d-flex align-items-center gap-1 mt-2">
              <Building size={20} strokeWidth={1.5} color={"#4040bf"} />{" "}
              <strong>{data.flat.room_id}</strong>
            </span>
          </div>
          <div className="col-sm-4">
            <span className="d-flex align-items-center gap-1 mt-2 ">
              <ReportMoney size={20} strokeWidth={1.5} color={"#4040bf"} />{" "}
              <strong>{data.rent} taka</strong>(per month)
            </span>

            <span className="d-flex align-items-center gap-1 mt-2">
              <AddressBook size={20} strokeWidth={1.5} color={"#4040bf"} />{" "}
              <strong>{moment(new Date(data.join)).format("ll")}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
