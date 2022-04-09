import { NativeSelect } from "@mantine/core";
import { useGetResidentListQuery } from "../../slice/biller-slices";

const ResidentSelector = ({ handelForm, errorText, value }) => {
  const { data, isLoading } = useGetResidentListQuery();

  return (
    <>
      {!isLoading && (
        <NativeSelect
          data={Object.values(data).map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          placeholder="Pick one"
          label="Resident"
          description="This is anonymous"
          radius="md"
          size="lg"
          required
          error={errorText}
          onChange={(e) => handelForm("resident", e.currentTarget.value)}
          value={value}
        />
      )}
    </>
  );
};

export default ResidentSelector;
