import React, { useState } from "react";
import { Leaderboard as LeaderboardI } from "../../../interfaces/challenge";
import {
  LeaderboardColumn,
  LeaderboardParams,
} from "../../../services/leaderboard";
import styles from "./style.module.css";

type Props = {
  userId?: string;
  list: LeaderboardI[];
  isLoading: boolean;
  onLoad: (params: LeaderboardParams) => void;
};

const PAGE_SIZE = 10;

const arrowDown = <span style={{ fontSize: "10px" }}>&#9660;</span>;
const arrowUp = <span style={{ fontSize: "10px" }}>&#9650;</span>;

const Leaderboard: React.FC<Props> = ({ userId, list, isLoading, onLoad }) => {
  const [col, setCol] = useState<LeaderboardColumn | null>(null);
  const [isAsc, setIsAsc] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);

  const maxUsers = list[0]?.ranking.total;
  const maxPage = Math.ceil(maxUsers / PAGE_SIZE);

  const onSort = (val: LeaderboardColumn) => {
    // if click on current column ? change direction : set default direction
    const nextAsc = col === val ? !isAsc : false;
    setIsAsc(nextAsc);
    onLoad({
      colName: val,
      direction: nextAsc ? "asc" : "desc",
    });
    setCol(val);
    setPageNumber(1);
  };

  const onReset = () => {
    setIsAsc(true);
    setCol(null);
    onLoad({});
    setPageNumber(1);
  };

  const onNext = () => {
    const nextPageNumber = pageNumber + 1;
    setPageNumber(nextPageNumber);
    onLoad({
      pageNumber: nextPageNumber,
      ...(col ? { colName: col } : {}),
      direction: isAsc ? "asc" : "desc",
    });
  };

  const onPrev = () => {
    const nextPageNumber = pageNumber - 1;
    setPageNumber(nextPageNumber);
    onLoad({
      pageNumber: nextPageNumber,
      ...(col ? { colName: col } : {}),
      direction: isAsc ? "asc" : "desc",
    });
  };

  const arrow = !isAsc ? arrowDown : arrowUp;

  return (
    <div className={styles.leaderboard}>
      <table className={styles.leadTable}>
        <thead className={styles.leadTableHead}>
          <tr>
            <th className={styles.leadTableHeadColumnPlace} onClick={onReset}>
              Place
            </th>
            <th className={styles.leadTableHeadColumn}>Address</th>
            <th
              className={styles.leadTableHeadColumn}
              onClick={() => onSort(LeaderboardColumn.TotalValueLocked)}
            >
              TVL, $ {col === LeaderboardColumn.TotalValueLocked ? arrow : null}
            </th>
            <th
              className={styles.leadTableHeadColumn}
              onClick={() => onSort(LeaderboardColumn.ChallengesCompleted)}
            >
              Number of challenges{" "}
              {col === LeaderboardColumn.ChallengesCompleted ? arrow : null}
            </th>
            <th
              className={styles.leadTableHeadColumn}
              onClick={() => onSort(LeaderboardColumn.MinutesSpent)}
            >
              Minutes spent{" "}
              {col === LeaderboardColumn.MinutesSpent ? arrow : null}
            </th>
          </tr>
        </thead>
        {isLoading ? null : (
          <tbody className={styles.leadTableBody}>
            {list.map((item) => {
              const isCurrent = userId === item.userId;
              return (
                <tr
                  key={item.userId}
                  className={`${styles.leadTableBodyRow} ${
                    isCurrent ? styles.userRow : ""
                  }`}
                >
                  <td
                    className={`${styles.rankingCell} ${
                      isCurrent ? styles.userRankingCell : ""
                    }`}
                  >
                    <div
                      className={`${styles.rankingCellNum} ${
                        isCurrent ? styles.userRankingCellNum : ""
                      }`}
                    >
                      {item.ranking.current}
                    </div>
                    {isCurrent ? (
                      <>
                        you are here!
                        <img
                          src="/icons/icon-star-yellow.svg"
                          alt="Star icon"
                        />
                      </>
                    ) : null}
                  </td>
                  <td title={item.userId}>{`${item.userId}`}</td>
                  <td>{item.totalValueLocked}</td>
                  <td>{item.challengesCompleted}</td>
                  <td>{item.minutesSpent}</td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {isLoading ? <div className={styles.loading}>Loading</div> : null}
      <div className={styles.paginationBlock}>
        <button
          className={styles.paginationButton}
          disabled={pageNumber === 1 || isLoading}
          onClick={onPrev}
        >
          Prev
        </button>
        <button
          className={styles.paginationButton}
          disabled={pageNumber === maxPage || isLoading}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
