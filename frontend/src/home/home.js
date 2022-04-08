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

import { Home2, ScooterElectric, ReportMoney } from "tabler-icons-react";

import { useEffect, useState } from "react";
import { useGetResidentQuery } from "../slice/biller-slices";
import "./home.css";
import MeterReading from "../component/meter-reading/meter-reading";

export default function Home() {
  const theme = useMantineTheme();
  const [cdata, setData] = useState({});

  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  const { data: fetchData, isLoading } = useGetResidentQuery();

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
          {residentList(secondaryColor, isLoading, cdata, theme)}
        </Tabs.Tab>
        <Tabs.Tab label="Meter Reading" icon={<ScooterElectric size={20} />}>
          <MeterReading />
        </Tabs.Tab>
        <Tabs.Tab label="Monthly Rent" icon={<ReportMoney size={20} />}>
          Settings tab content
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
}
function residentList(secondaryColor, isLoading, cdata, theme) {
  return (
    <section>
      <h1 style={{ color: secondaryColor }}>Resident List</h1>

      {isLoading ? (
        <Loader color="teal" size="lg" />
      ) : (
        <Grid>
          {Object.keys(cdata).map((key) => {
            const resident = cdata[key];
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
                      src={resident.pictureUrl}
                      alt={resident.name}
                    ></Avatar>

                    <Text
                      weight={700}
                      style={{
                        color: secondaryColor,
                        fontSize: theme.fontSizes.ld,
                      }}
                    >
                      {resident.name}
                    </Text>
                  </Group>
                  <Text weight={400} style={{ color: secondaryColor }}>
                    <div>
                      <strong>phone:</strong> {resident.phone}
                    </div>
                    <div>
                      <strong>flat:</strong> {resident.flat}
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
