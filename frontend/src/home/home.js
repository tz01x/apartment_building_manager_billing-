import {
  Container,
  Loader,
  Grid,
  Card,
  Text,
  Button,
  Group,
  Avatar,
  useMantineTheme,
  Tabs,
} from "@mantine/core";

import {
  Home2,
  ScooterElectric,
  ReportMoney,
  FileSettings,
  Plus
} from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetResidentListQuery } from "../slice/biller-slices";
import "./home.css";
import MeterReading from "../component/meter-reading/meter-reading";
import MonthlyRentEntry from "../component/monthly-rent-entry/monthly-rent-entry";
import RenderElectricMeterReadingSlipt from "../component/generate-electic-meter-slipt/generate-electric-meter-slipt";

export default function Home() {
  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  const [cdata, setData] = useState({});
  const navigate = useNavigate();
  const { data: fetchData, isLoading } = useGetResidentListQuery();

  useEffect(() => {
    if (fetchData) {
      setData(fetchData);
    }
  }, [fetchData]);
  return (
    <Container size="md">
      <Tabs
        color="dark"
        tabPadding="lg"
        classNames={{ tabLabel: "homeTabLabel", tabIcon: "homeTabIcons" }}
      >
        <Tabs.Tab label="Residents" icon={<Home2 size={20} />}>
          {residentList(secondaryColor, isLoading, cdata, theme, navigate)}
        </Tabs.Tab>
        <Tabs.Tab label="Meter Reading" icon={<ScooterElectric size={20} />}>
          <MeterReading />
        </Tabs.Tab>
        <Tabs.Tab label="Monthly Rent" icon={<ReportMoney size={20} />}>
          <MonthlyRentEntry />
        </Tabs.Tab>
        <Tabs.Tab label="Generate slipt " icon={<FileSettings size={20} />}>
          <RenderElectricMeterReadingSlipt />
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
}
function residentList(secondaryColor, isLoading, cdata, theme, navigate) {
  return (
    <section>
      <div className="d-flex justify-content-between">
        <h1 style={{ color: secondaryColor }}>ভাড়াটে/Tenant  List</h1>
        <Button color="cyan" title="add more user" onClick={()=>{
          navigate('/add-user');

        }}> 
          <Plus  size={20} color={'white'}></Plus>
          Add 
        </Button>
      </div>

      {isLoading ? (
        <Loader color="teal" size="lg" />
      ) : (
        <Grid>
          {Object.keys(cdata).map((key) => {
            const { pictureUrl, name, slug, phone, flat } = cdata[key];
            return (
              <Grid.Col md={6} lg={3} key={key}>
                <Card shadow="sm" p="lg">
                  <Group
                    position="left"
                    style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
                  >
                    <Avatar
                      color="cyan"
                      radius="xl"
                      size="lg"
                      src={pictureUrl}
                      alt={name}
                    ></Avatar>

                    <Text
                      weight={700}
                      style={{
                        color: secondaryColor,
                        fontSize: theme.fontSizes.ld,
                      }}
                    >
                      {name}
                    </Text>
                  </Group>
                  <Text weight={400} style={{ color: secondaryColor }}>
                    <div>
                      <strong>phone:</strong> {phone}
                    </div>
                    <div>
                      <strong>flat:</strong> {flat.room_id}
                    </div>
                  </Text>

                  {/* {resident.pictureUrl}
                            {resident.flat}
                            {resident.phone} */}

                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    style={{ marginTop: 14 }}
                    onClick={() => {
                      navigate(`/profile/${slug}`);
                    }}
                  >
                    Profile
                  </Button>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      )}
    </section>
  );
}
