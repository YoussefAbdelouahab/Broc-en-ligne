import "./SwitchButton.scss";
import axios from "axios";
import { useEffect, useState } from "react";


export default function SwitchButton({ user, setUser }) {
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    if (user.status === 1) {
      setIsChecked(isChecked);
    }
    else {
      setIsChecked(!isChecked);
    }
  }, []);

  const handleClick = async () => {
    const newStatus = isChecked ? 0 : 1;
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/user/${user.id}`, { status: newStatus });
      setUser({ ...user, status: newStatus });
      setIsChecked(!isChecked);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={`switch-button ${isChecked ? "on" : "off"}`} onClick={handleClick}>
        <div className="button-status"></div>
      </div>
    </>
  );
}
