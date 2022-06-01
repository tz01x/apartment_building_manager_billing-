import moment from "moment";
import { useMantineTheme} from "@mantine/core";
import { useAddElectricMeterReadingMutation } from "../../slice/biller-slices";
import DataEntry from "../inputForm";

const initialData = {
  resident: {
    value: "",
    type: "select",
    label: "ভাড়াটে/Tenant",
    
    valueStr() {
      return this.value;
    },
    required:true
  },
  current_meterReading: {
    value: 0,
    type: "number",
    label: "বর্তমান রেডিং",
    valueStr() {
      return this.value;
    },
    required:true

  },
  
  previous_meterReading:{
    value: 0,
    type: "number",
    label: "পূর্ববর্তী রেডিং",
    valueStr() {
      return this.value;
    },
    required:false,
    description:"যদি নির্বাচিত ভাড়াটেটির কোনো পূর্ববর্তী মিটার রিডিং না থাকে তবে আপনি এখানে মান সন্নিবেশ করতে পারেন অন্যথায় এটি শূন্য হিসাবে ছেড়ে দিন"
    // if the selected tenant has no previous meter reading only then you can insert the value here  otherwise leave it as zero 

  },
  unit:{
    value:8,
    type:"number",
    label:"Unit",
    valueStr(){
      return this.value;
    },
  },
  date: {
    value: new Date(),
    type: "date",
    label: "তারিখ",
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
      <h1 style={{ color: secondaryColor }}> 
      {/* Electricity meter reading form */}
      বিদ্যুৎ মিটার রিডিং ফর্ম
      
      </h1>
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
