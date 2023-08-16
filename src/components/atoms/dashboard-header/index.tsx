import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./style.module.css";
import useAuth from "../../../hooks/useAuth";

interface DashboardHeaderProps {
  challengesCompleted: number;
}

export default function DashboardHeader({
  challengesCompleted,
}: DashboardHeaderProps) {
  const { address, disconnectUser } = useAuth();
  const [avatarNumber, setAvatarNumber] = useState<number>();
  const addressEnding = address?.substring(address.length, address.length - 4);

  useEffect(() => {
    setAvatarNumber(Math.floor(Math.random() * 10) + 1);
  }, []);

  const copyUserAddress = () => {
    navigator.clipboard.writeText(address);
    toast("Copied to clipboard!", {
      hideProgressBar: true,
      position: "top-center",
      autoClose: 2000,
    });
  };

  // TODO: Uncomment Logout button when disconnect feature will be fully completed from @soroban-react/core side
  return (
    <div className={styles.dashboardHeader}>
      <h3 className={styles.dashboardTitle}>Your dashboard</h3>

      <ul className={styles.userInfo}>
        <li className={styles.userInfoItem}>
          <img
            src={`/icons/icon-avatar-${avatarNumber}.svg`}
            className={styles.avatarIcon}
            alt="User avatar icon"
          />

          <div>
            <label>User address</label>

            <div className={styles.userAddress} data-truncate={addressEnding}>
              <div>{address}</div>
              <img
                src="/icons/icon-copy.svg"
                className={styles.copyIcon}
                onClick={copyUserAddress}
                alt="Copy address to clipboard"
              />
            </div>

            {/* <button
              className={styles.logoutButton}
              onClick={disconnectUser}
            >
              Log out
            </button> */}
          </div>
        </li>
        <li className={styles.userInfoItem}>
          <img
            src="/icons/icon-star.svg"
            className={styles.starIcon}
            alt="Star icon"
          />

          <div className={styles.completedChallenges}>
            <label>{challengesCompleted}</label>
            <span>completed challenges</span>
          </div>
        </li>
      </ul>
    </div>
  );
}
