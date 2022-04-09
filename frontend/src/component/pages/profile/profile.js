import { Container, useMantineTheme, Table } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar } from "@mantine/core";
import moment from "moment";
import {
  Phone,
  Building,
  CircleCheck,
  CircleOff,
  ReportMoney,
  AddressBook,
} from "tabler-icons-react";
import {
  useGetMonthlyRentLogMutation,
  useGetResidentQuery,
} from "../../../slice/biller-slices";

function Profile() {
  const params = useParams();

  const { data, isLoading } = useGetResidentQuery(params.slug);
  const [rows, setRows] = useState([]);

  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  const [getMonthlyRentLog, { isLoading: isRentLogLoading }] =
    useGetMonthlyRentLogMutation();

  const fetchData= async ()=>{
    const rentLog = await getMonthlyRentLog(data.slug);

    if (rentLog.error) return;

    const tempRow = Object.values(rentLog.data).map((element) => (
      <tr key={element.id}>
        <td>{moment(new Date(element.created)).format("ll")}</td>
        <td>{moment(new Date(element.date)).format("MMMM  YYYY")}</td>
        <td>{element.rent_paid} taka (BDT)</td>
        <td>{element.electricity_bill_paid} taka (BDT)</td>
      </tr>
    ));

    setRows([...tempRow]);
  }

  useEffect( () => {
    if (data) {
      fetchData();
    }
  }, [data]);

  return (
    <Container>
      {!isLoading && basicInfo(secondaryColor, data)}

      <div className="mt-5 pt-4" style={{ color: secondaryColor }}>
        <h3>Extra charges</h3>
        {!isLoading && (
          <ul>
            {Object.values(data.extraCharge).map((item) => {
              return (
                <li key={item.id}>
                  {item.title} : {item.amount} taka (BDT)
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-5 pt-4" style={{ color: secondaryColor }}>
        <h3>Monthly Rent Log</h3>
        <hr></hr>

        <Table striped highlightOnHover verticalSpacing="sm" fontSize="md">
          <thead>
            <tr>
              <th>paid in</th>
              <th>paid for</th>
              <th>Rent</th>
              <th>electricity build</th>
            </tr>
          </thead>
          {!isRentLogLoading && <tbody>{rows}</tbody>}
        </Table>
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
              <strong>{data.flat}</strong>
            </span>
          </div>
          <div className="col-sm-4">
            <span className="d-flex align-items-center gap-1 mt-2 ">
              <ReportMoney size={20} strokeWidth={1.5} color={"#4040bf"} />{" "}
              <strong>{data.rent} taka (BDT)</strong>(per month)
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
