import { useGetFlatsQuery, useGetResidentQuery } from "../slice/biller-slices";
import { useSelector } from "react-redux";

const Home = () => {
  const { data } = useGetResidentQuery();
  const user = useSelector((state) => state.user);
  return <pre> {JSON.stringify(data)}</pre>;
};

// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#axios-basequery

export default Home;
