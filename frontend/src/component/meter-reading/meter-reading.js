import {
  useMantineTheme,
  NumberInput,
  Button,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import moment from "moment";
import { useState } from "react";
import {
  useAddElectricMeterReadingMutation,
} from "../../slice/biller-slices";
import ResidentSelector from "../residient-selector/residient-selector";

const initialData = {
  resident: "",
  current_meterReading: 0,
  date: new Date(),
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

  const [fromData, setFormData] = useState({ ...initialData });
  const [errorText, setErrorText] = useState({ ...errorTextInitial });

  const [addElectricMeterReading] = useAddElectricMeterReadingMutation();

  const handelForm = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearFormData = () => {
    setErrorText({ ...errorTextInitial });
    setFormData({ ...initialData });
  };

  const onSubmitHandeler = async () => {
    setErrorText(errorTextInitial);

    fromData.date = moment(fromData.date).format("YYYY-MM-DD");

    try {
      await addElectricMeterReading(fromData).unwrap();

      clearFormData();
    } catch (error) {
      Object.keys(error.data).forEach((key) => {
        if (key in errorText) {
          setErrorText((prev) => ({ ...prev, [key]: error.data[key] }));
        }
      });
    }
  };

  return (
    <section>
      <h1 style={{ color: secondaryColor }}> Electricity meter reading form</h1>
      <div className="mt-5">
        {formFields()}
        {buttonGrp()}
      </div>
    </section>
  );

  function buttonGrp() {
    return (
      <div className="d-flex mt-5 justify-content-between">
        <Button
          onClick={onSubmitHandeler}
          color="blue"
          radius="md"
          size="lg"
          uppercase
        >
          ADD &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-lightning"
            viewBox="0 0 16 16"
          >
            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1H6.374z" />
          </svg>
        </Button>
        <Button
          onClick={clearFormData}
          color="red"
          radius="md"
          size="lg"
          uppercase
        >
          Clear &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-x-square-fill"
            viewBox="0 0 16 16"
          >
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
          </svg>
        </Button>
      </div>
    );
  }

  function formFields() {
    return (
      <form>

        <ResidentSelector
          handelForm={handelForm}
          value={fromData.resident}
          errorText={errorText.resident}
        />

        <NumberInput
          error={errorText.current_meterReading}
          label="Meter Reading"
          radius="md"
          size="lg"
          required
          name="current_meterReading"
          hideControls
          onChange={(e) => handelForm("current_meterReading", e)}
          value={fromData.current_meterReading}
        />
        <DatePicker
          error={errorText.date}
          name="date"
          locale="bn"
          radius="md"
          size="lg"
          placeholder="date"
          label="Date"
          defaultValue={initialData.data}
          value={fromData.date}
          onChange={(e) => handelForm("date", e)}
        />
      </form>
    );
  }
};

export default MeterReading;
