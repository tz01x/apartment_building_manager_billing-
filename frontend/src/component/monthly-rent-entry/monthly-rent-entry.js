import { useMantineTheme } from "@mantine/core";
import moment from "moment";
import { useAddMonthlyRentEntryMutation } from "../../slice/biller-slices";
import DataEntry from "../inputForm";

const initialData = {
  resident: {
    value: "",
    type: "select",
    label: "Residents",
    valueStr() {
      return this.value;
    },
  },
  date: {
    value: new Date(),
    type: "date",
    label: "Date",
    valueStr() {
      return moment(this.value).format("YYYY-MM-DD");
    },
  },
  rent_paid: {
    value: 0,
    type: "number",
    label: "Rent",
    valueStr() {
      return this.value;
    },
  },
  electricity_bill_paid: {
    value: 0,
    type: "number",
    label: "Electric bill",
    valueStr() {
      return this.value;
    },
  },
};

const errorTextInitial = {
  resident: "",
  rent_paid: "",
  electricity_bill_paid: "",
  date: "",
};

const MonthlyRentEntry = () => {
  const theme = useMantineTheme();

  const [addMonthlyRentEntry]= useAddMonthlyRentEntryMutation()

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <section>
      <h1 style={{ color: secondaryColor }}> Add Monthly React Entry</h1>
      <div className="mt-5">
        <DataEntry
          initialData={initialData}
          errorTextInitial={errorTextInitial}
          addData={addMonthlyRentEntry}
        />
      </div>
    </section>
  );
};

export default MonthlyRentEntry;
