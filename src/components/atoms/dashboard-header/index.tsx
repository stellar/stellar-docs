import React from "react";
import { toast } from "react-toastify";
import { Ranking } from "interfaces/challenge";
import styles from "./style.module.css";
import useAuth from "../../../hooks/useAuth";

const AVATAR = `/icons/icon-avatar-${Math.floor(Math.random() * 10) + 1}.svg`;

interface Props {
  totalCompleted: number;
  ranking: Ranking;
}

const DashboardHeader: React.FC<Props> = ({ totalCompleted, ranking }) => {
  const { address, disconnect } = useAuth();

  const addressEnding = address?.substring(address.length, address.length - 4);

  const copyUserAddress = () => {
    navigator.clipboard.writeText(address);

    toast("Copied to clipboard!", {
      hideProgressBar: true,
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <div className={styles.dashboardHeader}>
      <h3 className={styles.dashboardTitle}>Your dashboard</h3>

      <ul className={styles.userInfo}>
        <li className={styles.userInfoItem}>
          <img
            src={AVATAR}
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

            <button className={styles.logoutButton} onClick={disconnect}>
              Log out
            </button>
          </div>
        </li>

        <li className={styles.userInfoItem}>
          <img
            src="/icons/icon-star.svg"
            className={styles.statsIcon}
            alt="Star icon"
          />

          <div className={styles.completedChallenges}>
            <label>{totalCompleted}</label>
            <span>completed challenges</span>
          </div>
        </li>

        <li className={styles.userInfoItem}>
          <img
            src="/icons/icon-ranking.svg"
            className={styles.statsIcon}
            alt="Ranking icon"
          />

          <div className={styles.completedChallenges}>
            <label>
              {ranking.current}/{ranking.total}
            </label>
            <span>ranking position</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DashboardHeader;
