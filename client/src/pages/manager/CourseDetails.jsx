import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

import api from "../../services/api";

import CourseHero from "../../components/course/CourseHero";
import CourseStats from "../../components/course/CourseStats";
import ModuleCard from "../../components/course/ModuleCard";
import AIInsightsCard from "../../components/course/AIInsightsCard";

import SectionHeader from "../../components/ui/SectionHeader";
import Button from "../../components/ui/Button";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/courses/${id}`);

      setCourse(res.data.course);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load course.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        <h2 className="text-2xl font-bold">
          Loading Course...
        </h2>

        <p className="text-gray-500 mt-2">
          Preparing course content...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10">

        <h2 className="text-3xl font-bold">
          Course Not Found
        </h2>

        <Link to="/manager/courses">
          <Button className="mt-8">
            Back to Courses
          </Button>
        </Link>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      <Link
        to="/manager/courses"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#18D39A]"
      >
        <FaArrowLeft />
        Back to Courses
      </Link>

      {/* Hero */}

      <CourseHero course={course} />

      {/* Course Information */}

      <CourseStats course={course} />

      {/* Main Content */}

      <div className="grid xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2">

          <SectionHeader
            title="Course Modules"
            subtitle="Training modules generated for this course."
          />

          <div className="space-y-8 mt-8">

            {course.modules?.map((module, index) => (

              <ModuleCard
                key={module._id || index}
                module={module}
                index={index}
              />

            ))}

          </div>

        </div>

        <div>

          <AIInsightsCard course={course} />

        </div>

      </div>

    </div>
  );
}

export default CourseDetails;