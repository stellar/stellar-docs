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
      "https://soroban-dapps-challenge-wrangler.sdf-ecosystem.workers.dev",
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

export function DeployedProjectsCard({ addressHex }: CardProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (addressHex) {
      fetchCourses(addressHex).then(setCourses);
    }
  }, [addressHex]);

  return (
    <div className={styles.card}>
      <h3>Dapp Deployments</h3>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>
            <a href={course.url} target="_blank" rel="noopener noreferrer">
              {course.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
