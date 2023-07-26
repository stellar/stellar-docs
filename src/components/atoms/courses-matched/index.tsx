import React, { useEffect, useState } from 'react';
import styles from "./style.module.css";

interface SingleCourseCardProps {
  course: Course;
}

interface CompletedCoursesProps {
  addressHex: string;
}

interface Course {
    publickey: string;
    course_index: number;
    url: string;
    completed_at: number; // Add this line
  }
  

const fetchCourses = async (address: string): Promise<Course[]> => {
  try {
    const response = await fetch("https://soroban-dapps-challenge-wrangler.sdf-ecosystem.workers.dev");
    const rawData = await response.json();
    const data: Course[] = rawData.map(({ publickey, url }: { publickey: string, url: string }) => {
      const [key, index] = publickey.split(':');
      return { publickey: key, course_index: Number(index), url };
    });

    return data.filter((course) => course.publickey === address);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const courseMapping: { [key: number]: string } = {
  0: "Crowdfund",
  1: "Payment",
  2: "Minting",
  3: "AMM",
  4: "Staking",
};

const SingleCourseCard: React.FC<SingleCourseCardProps> = ({ course }) => {
  return (
    <div className={styles.card}>
      <h3>{courseMapping[course.course_index] || `Unknown Course (${course.course_index})`}</h3>
      <p>
        <a href={course.url} target="_blank" rel="noopener noreferrer">
          {course.url}
        </a>
      </p>
    </div>
  );
};

export const CompletedCourses: React.FC<CompletedCoursesProps> = ({ addressHex }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (addressHex) {
      fetchCourses(addressHex).then(setCourses);
    }
  }, [addressHex]);

  return (
    <div className={styles.container}>
      <h2>Completed Courses</h2>
      {courses.map((course, index) => (
        <SingleCourseCard key={index} course={course} />
      ))}
    </div>
  );
};


