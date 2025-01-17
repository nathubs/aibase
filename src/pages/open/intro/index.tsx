import { useParams } from "react-router-dom";
import Banner from "../component/banner";
import Special from "../component/special";
import ApplyList from "../component/applyList";

const Intro = () => {
  const params = useParams();

  if (!params.type) {
    return <></>;
  }
  return (
    <div className="layout">
      <Banner type={params.type} />
      <ApplyList type={params.type} />
      <Special type={params.type} />
    </div>
  );
};

export default Intro;
