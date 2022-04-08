import { useMantineTheme, NativeSelect, NumberInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";

const MeterReading = () => {
  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  const [fromData, setFormData] = useState({
    resident: "",
    current_meterReading: "",
    date: new Date(),
  });

  const handelForm = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section>
      <h1 style={{ color: secondaryColor }}> Entry form</h1>
      <div>
        <form>
          <NativeSelect
            data={["React", "Vue", "Angular", "Svelte"]}
            placeholder="Pick one"
            label="Residient"
            description="This is anonymous"
            radius="md"
            size="lg"
            required
            onChange={(e) => handelForm("resident", e.currentTarget.value)}
            value={fromData.resident}
          />
          <NumberInput
            defaultValue={18}
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
            name="date"
            locale="bn"
            radius="md"
            size="lg"
            placeholder="date"
            label="Date"
            defaultValue={fromData.date}
            onChange={(e) => handelForm("date", e)}
          />
        </form>

        <button
          onClick={() => {
            console.log(fromData);
          }}
        >
          click me
        </button>
      </div>
    </section>
  );
};

export default MeterReading;
