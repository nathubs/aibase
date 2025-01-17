import ApplyList from "../component/applyList";
import Banner from "../component/banner";
import Special from "../component/special";

const Draw = () => {
  return (
    <div className="layout">
      <Banner type="draw" />

      <ApplyList type="draw" />
      <Special type="draw" />
    </div>
  );
};

export default Draw;
