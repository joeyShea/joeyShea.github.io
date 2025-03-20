import "./Submit.css";
import refreshIcn from "../../assets/images/refresh.svg"

const Refresh = ({ tryUpdate }: { tryUpdate: () => void }) => {
    return (
    <button className="refresh incButton" onClick={tryUpdate}>
      Refresh
      <img src={refreshIcn} alt="Refresh the statistics!" />
    </button>
  );
};

export default Refresh;