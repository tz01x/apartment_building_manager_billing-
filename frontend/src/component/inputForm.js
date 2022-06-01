import {
  NumberInput,
  Button,
  InputWrapper,
  Input,
  Modal,
  Alert,
} from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import GenericSelectInput from "./genaric-select-input/genaric-select-input";

import ResidentSelector from "./residient-selector/residient-selector";

function DataEntry({ initialData, errorTextInitial, addData,successMessage="New Resident has been added" }) {
  const [formData, setFormData] = useState({ ...initialData });
  const [errorText, setErrorText] = useState({ ...errorTextInitial });
  const [openModal, setOpenModal] = useState(false);

  const handelForm = (name, value) => {
    console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: { ...prev[name], value: value },
    }));
  };

  const clearFormData = () => {
    setErrorText({ ...errorTextInitial });
    setFormData({ ...initialData });
  };

  const onSubmitHandeler = async () => {
    setErrorText(errorTextInitial);
    const tempFormData = {};
    Object.keys(formData).forEach((key) => {
      tempFormData[key] = formData[key].valueStr();
    });
    try {
      await addData(tempFormData).unwrap();
      setOpenModal(true);
      clearFormData();
    } catch (error) {
      console.log(error);
      Object.keys(error.data).forEach((key) => {
        if (key in errorText) {
          setErrorText((prev) => ({ ...prev, [key]: error.data[key] }));
        }
      });
    }
  };

  return (
    <div>
      {formFields()}
      {buttonGrp()}
    </div>
  );

  function formFields() {
    return (
      <form>
        {Object.keys(formData).map((key) => {
          switch (formData[key].type) {
            case "select":
              if (key == "resident") {
                return (
                  <div className={`data_entry_${key} mt-4`} key={key}>
                    <ResidentSelector
                      handelForm={handelForm}
                      value={formData[key].value}
                      errorText={errorText[key]}
                      label={formData[key].label}
                    />
                  </div>
                );
              } else {
                return (
                  <div className={`data_entry_${key} mt-4`} key={key}>
                    <GenericSelectInput
                      dataSource={formData[key].dataSource}
                      handelForm={handelForm}
                      name={key}
                      unpackItem={formData[key].unpackItem}
                      value={formData[key].value}
                      label={formData[key].label}
                      error={errorText[key]}
                    />
                  </div>
                );
              }

            case "date":
              return (
                <div className={`data_entry_${key} mt-4`} key={key}>
                  <DatePicker
                    error={errorText[key]}
                    name={key}
                    locale="bn"
                    radius="md"
                    size="lg"
                    placeholder="date"
                    label={formData[key].label}
                    defaultValue={formData[key].value}
                    value={formData[key].value}
                    onChange={(e) => handelForm(key, e)}
                  />
                </div>
              );
            case "text":
              return (
                <div className={`data_entry_${key} mt-4`} key={key}>
                  <InputWrapper
                    id={`data_entry_${key}`}
                    required={formData[key].required}
                    label={formData[key].label}
                    description={formData[key].description}
                    error={errorText[key]}
                  >
                    <Input
                      id={`data_entry_${key}`}
                      onChange={(e) => handelForm(key, e.target.value)}
                      placeholder={
                        formData[key].placeholder
                          ? formData[key].placeholder
                          : ""
                      }
                      value={formData[key].value}
                      radius="md"
                      size="lg"
                    />
                  </InputWrapper>
                </div>
              );

            default:
              return (
                <div className={`data_entry_${key} mt-4`} key={key}>
                  <NumberInput
                    error={errorText[key]}
                    label={formData[key].label}
                    radius="md"
                    size="lg"
                    required={!!formData[key].required}
                    name={key}
                    hideControls
                    onChange={(e) => handelForm(key, e)}
                    value={formData[key].value}
                    description={formData[key].description}
                  />
                </div>
              );
          }
        })}
      </form>
    );
  }

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

        <Modal
          transition="fade"
          transitionDuration={600}
          transitionTimingFunction="ease"
          overlayOpacity={0.55}
          overlayBlur={3}
          withCloseButton={false}
          opened={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          padding={0}
        >
          <Alert
           
            title="Submitted"
            color="teal"
            radius="xs"
            variant="outline"
            style={{padding:"2em"}}
          >
            {successMessage}
          </Alert>
        </Modal>
      </div>
    );
  }
}

export default DataEntry;
