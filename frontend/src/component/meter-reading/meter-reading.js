import moment from "moment";
import { useMantineTheme} from "@mantine/core";
import { useAddElectricMeterReadingMutation } from "../../slice/biller-slices";
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
  current_meterReading: {
    value: 0,
    type: "number",
    label: "Meter Reading",
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
};

const errorTextInitial = {
  resident: "",
  current_meterReading: "",
  date: "",
};

const MeterReading = () => {

  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

    const [addElectricMeterReading] = useAddElectricMeterReadingMutation();


  return (
    <section>
      <h1 style={{ color: secondaryColor }}> Electricity meter reading form</h1>
      <div className="mt-5">
        <DataEntry
          initialData={initialData}
          errorTextInitial={errorTextInitial}
          addData={addElectricMeterReading}
        />
      </div>
    </section>
  );
};

export default MeterReading;
