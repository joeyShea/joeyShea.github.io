import "./Submit.css";
import useSubmitStats from "../../firebase/UseSubmitStats"; // Adjust the path as needed
import uploadIcn from "../../assets/images/upload-sign.svg"

const Submit = ({ tryUpdate }: { tryUpdate: () => void }) => {
  const submitStats = useSubmitStats();

  function handleClick() {
    submitStats();
    tryUpdate();
  }

  return (
    <button className="submit incButton" onClick={handleClick}>
      Submit my Stats!
      <img src={uploadIcn} alt="Upload your statistics!" />
    </button>
  );
};

export default Submit;