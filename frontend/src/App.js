import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./component/login/login";
import Home from "./home/home";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./App.css";
import { Building } from "tabler-icons-react";
import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
  MantineProvider,
  ColorSchemeProvider,
  useMantineColorScheme,
  Global,
} from "@mantine/core";
import CNav from "./component/nav/costomNav";
import Profile from "./component/pages/profile/profile";

function App() {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.refresh) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [user]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme }}>
        <AppShell
          sx={(theme) => {
            return {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.indigo[2],
            };
          }}
          // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
          navbarOffsetBreakpoint="sm"
          // fixed prop on AppShell will be automatically added to Header and Navbar
          fixed
          // navbar={
          //   <Navbar
          //     p="md"
          //     // Breakpoint at which navbar will be hidden if hidden prop is true
          //     hiddenBreakpoint="sm"
          //     // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
          //     hidden={!opened}
          //     // when viewport size is less than theme.breakpoints.sm navbar width is 100%
          //     // viewport size > theme.breakpoints.sm – width is 300px
          //     // viewport size > theme.breakpoints.lg – width is 400px
          //     width={{ sm: 300, lg: 400 }}
          //   >
          //     <CNav />
          //   </Navbar>
          // }
          header={
            <Header height={70} p="md">
              {/* Handle other responsive styles with MediaQuery component or createStyles function */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                {/* <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                  />
                </MediaQuery> */}

                <Text>
                  <Building size={30} strokeWidth={1.5} color={"#4f2d86"} />
                  ApartmentManagement
                </Text>

                <CNav />
              </div>
            </Header>
          }
        >
          <Routes>
            <Route path="login" element={<Login />}></Route>
            <Route path="profile/:slug" element={<Profile/>}></Route>
            <Route path="" element={<Home />}></Route>
          </Routes>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
