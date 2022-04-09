import { useMantineTheme ,Button,NumberInput,} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useAddMonthlyRentEntryMutation } from "../../slice/biller-slices";
import ResidentSelector from "../residient-selector/residient-selector";

const initialData = {
  resident: "",
  date: new Date(),
  rent_paid: 0,
  electricity_bill_paid: 0,
};

const errorTextInitial = {
  resident: "",
  rent_paid: "",
  electricity_bill_paid: "",
  date: "",
};

const MonthlyRentEntry = () => {
  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  const [formData, setFormData] = useState({ ...initialData });
  const [errorText, setErrorText] = useState({ ...errorTextInitial });

  const clearFormData = () => {
    setErrorText({ ...errorTextInitial });
    setFormData({ ...initialData });
  };

  const [addMonthlyRentEntry,{isLoading}]= useAddMonthlyRentEntryMutation()

  const onSubmitHandeler = async () => {


    setErrorText(errorTextInitial);

    formData.date = moment(formData.date).format("YYYY-MM-DD");


    try {
      await addMonthlyRentEntry(formData).unwrap();

      clearFormData();
    } catch (error) {
      Object.keys(error.data).forEach((key) => {
        if (key in errorText) {
          setErrorText((prev) => ({ ...prev, [key]: error.data[key] }));
        }
      });
    }


  }

  const handelForm = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section>
      <h1 style={{ color: secondaryColor }}> Add Monthly React Entry</h1>
      <form className="mt-5">
        <ResidentSelector
          handelForm={handelForm}
          value={formData.resident}
          errorText={errorText.resident}
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
          value={formData.date}
          onChange={(e) => handelForm("date", e)}
        />

        <NumberInput
          error={errorText.rent_paid}
          label="Rent"
          radius="md"
          size="lg"
          required
          name="rent_paid"
          hideControls
          onChange={(e) => handelForm("rent_paid", e)}
          value={formData.rent_paid}
        />

        <NumberInput
          error={errorText.electricity_bill_paid}
          label="Electricity bill"
          radius="md"
          size="lg"
          required
          name="electricity_bill_paid"
          hideControls
          onChange={(e) => handelForm("electricity_bill_paid", e)}
          value={formData.electricity_bill_paid}
        />

        {buttonGrp()}

      </form>

     
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
};

export default MonthlyRentEntry;
