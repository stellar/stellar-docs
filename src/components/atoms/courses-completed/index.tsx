import React, { useState, useEffect } from "react";
import styles from "./style.module.css";

interface CardProps {
  addressHex: string;
}

interface Course {
  publickey: string;
  course_index: number;
  url: string;
}

const fetchCourses = async (address: string): Promise<Course[]> => {
  try {
    const response = await fetch(
      "https://soroban-dapps-challenge-wrangler.sdf-ecosystem.workers.dev/",
    );
    const rawData = await response.json();
    const data: Course[] = rawData.map(
      ({ publickey, url }: { publickey: string; url: string }) => {
        const [key, course_index] = publickey.split(":");
        return { publickey: key, course_index: Number(course_index), url };
      },
    );

    return data.filter((course) => course.publickey === address);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export function CompletedCoursesCard({ addressHex }: CardProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (addressHex) {
      fetchCourses(addressHex).then(setCourses);
    }
  }, [addressHex]);

  const courseMapping: { [key: number]: string } = {
    0: "Crowdfund",
    1: "Payment",
    2: "Minting",
    3: "AMM",
    4: "Staking",
  };

  return (
    <div className={styles.card}>
      <h3>Completed Challenges</h3>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>
            {courseMapping[course.course_index] ||
              `Unknown Course (${course.course_index})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
