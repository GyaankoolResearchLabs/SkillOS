import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import assignmentService from "../../services/assignmentService";
import toast from "react-hot-toast";

import {
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaClock,
  FaTrophy,
} from "react-icons/fa";

function FinalAssessment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // =====================================================
  // LOAD ASSESSMENT
  // =====================================================

  useEffect(() => {
    loadAssessment();
  }, []);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (questions.length === 0 || result) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          handleSubmit();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, result]);

  // =====================================================
  // LOAD ASSESSMENT
  // =====================================================

  const loadAssessment = async () => {
    try {
      setLoading(true);

      const res = await assignmentService.getAssignments();

      const ass = res.data.assignments.find(
        (a) => a._id === assignmentId
      );

      if (!ass) {
        toast.error("Assignment not found.");
        return;
      }

      setAssignment(ass);

      const finalQuiz = ass.course?.finalAssessment || [];

      if (finalQuiz.length === 0) {
        toast.error("Final assessment unavailable.");

        navigate(`/${user.role}/course/${assignmentId}`);

        return;
      }

      setQuestions(finalQuiz);
    } catch (err) {
      console.error(
        "LOAD FINAL ASSESSMENT ERROR:",
        err
      );

      toast.error("Unable to load assessment.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const handleOptionChange = (index, option) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: option,
    }));
  };

  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // =====================================================
  // PREVIOUS QUESTION
  // =====================================================

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // =====================================================
  // FORMAT TIMER
  // =====================================================

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // =====================================================
  // SUBMIT FINAL ASSESSMENT
  // =====================================================

  const handleSubmit = async () => {
    if (submitting || result) {
      return;
    }

    try {
      setSubmitting(true);

      // ================================================
      // Convert answers into ordered array
      // ================================================

      const answerArray = questions.map(
        (_, index) => answers[index] || ""
      );

      console.log(
        "FINAL ASSESSMENT ANSWERS:",
        answerArray
      );

      // ================================================
      // SUBMIT FINAL ASSESSMENT
      // ================================================

      const res =
        await assignmentService.submitFinalAssessment(
          assignmentId,
          answerArray
        );

      console.log(
        "FINAL ASSESSMENT RESPONSE:",
        res.data
      );

      // ================================================
      // GET ASSESSMENT RESULT
      // ================================================

      const assessmentResult = res.data.result;

      if (!assessmentResult) {
        throw new Error(
          "Assessment result was not returned by the server."
        );
      }

      // ================================================
      // IMPORTANT FIX
      //
      // If the employee passes the final assessment,
      // complete the assignment.
      //
      // This is what changes:
      //
      // status:
      // In Progress -> Completed
      //
      // certificateIssued:
      // false -> true
      //
      // certificateIssuedAt:
      // null -> current date
      //
      // completedAt:
      // null -> current date
      // ================================================

      if (assessmentResult.passed) {
        console.log(
          "FINAL ASSESSMENT PASSED."
        );

        console.log(
          "COMPLETING COURSE:",
          assignmentId
        );

        const completionResponse =
          await assignmentService.completeCourse(
            assignmentId
          );

        console.log(
          "COURSE COMPLETION RESPONSE:",
          completionResponse.data
        );

        toast.success(
          "Course completed successfully! Certificate issued."
        );
      } else {
        toast.error(
          "You did not pass the assessment."
        );
      }

      // ================================================
      // DISPLAY RESULT
      // ================================================

      setResult({
        passed: assessmentResult.passed,
        score: assessmentResult.score,
        correctAnswers:
          assessmentResult.correctAnswers,
        totalQuestions:
          assessmentResult.totalQuestions,
      });
    } catch (err) {
      console.error(
        "SUBMIT FINAL ASSESSMENT ERROR:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Unable to submit assessment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Loading Final Assessment...
      </div>
    );
  }

  // =====================================================
  // NO QUESTIONS
  // =====================================================

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        No Assessment Found
      </div>
    );
  }

  const current = questions[currentQuestion];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <FaTrophy className="text-yellow-500" />

              Final Assessment
            </h1>

            <p className="text-gray-500 mt-2">
              {assignment.course.courseTitle}
            </p>
          </div>

          <div className="bg-red-100 text-red-700 px-5 py-3 rounded-xl flex items-center gap-3 font-bold">
            <FaClock />

            {formatTime()}
          </div>
        </div>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="mt-8">
          <div className="flex justify-between mb-3">
            <span>
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </span>

            <span>
              {Math.round(
                ((currentQuestion + 1) /
                  questions.length) *
                  100
              )}
              %
            </span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="bg-[#18D39A] h-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* =================================================
          QUESTION
      ================================================= */}

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-8">
          {current.question}
        </h2>

        <div className="space-y-4">
          {current.options.map(
            (option, index) => (
              <label
                key={index}
                className={`block border rounded-xl p-5 cursor-pointer transition ${
                  answers[currentQuestion] === option
                    ? "border-[#18D39A] bg-green-50"
                    : "border-gray-200 hover:border-[#18D39A]"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={
                    answers[currentQuestion] === option
                  }
                  onChange={() =>
                    handleOptionChange(
                      currentQuestion,
                      option
                    )
                  }
                  className="mr-4"
                />

                {option}
              </label>
            )
          )}
        </div>
      </div>

      {/* =================================================
          QUESTION NAVIGATOR
      ================================================= */}

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h3 className="text-xl font-bold mb-6">
          Question Navigator
        </h3>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() =>
                setCurrentQuestion(index)
              }
              className={`h-12 rounded-lg font-bold transition ${
                currentQuestion === index
                  ? "bg-[#18D39A] text-white"
                  : answers[index]
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="flex justify-between">
        <button
          onClick={previousQuestion}
          disabled={
            currentQuestion === 0 ||
            submitting
          }
          className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <FaChevronLeft />

          Previous
        </button>

        {currentQuestion ===
        questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#18D39A] hover:bg-[#15bc88] text-white px-8 py-3 rounded-xl flex items-center gap-2"
          >
            <FaCheckCircle />

            {submitting
              ? "Submitting..."
              : "Submit Assessment"}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl flex items-center gap-2"
          >
            Next

            <FaChevronRight />
          </button>
        )}
      </div>

      {/* =================================================
          RESULT SCREEN
      ================================================= */}

      {result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg text-center">

            <FaTrophy
              className={`mx-auto text-6xl ${
                result.passed
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            />

            <h2 className="text-3xl font-bold mt-6">
              {result.passed
                ? "Congratulations!"
                : "Assessment Failed"}
            </h2>

            <p className="text-gray-500 mt-4">
              Your Score
            </p>

            <h3 className="text-5xl font-bold mt-2">
              {result.score}%
            </h3>

            <p className="text-gray-500 mt-3">
              Correct Answers:{" "}
              {result.correctAnswers} /{" "}
              {result.totalQuestions}
            </p>

            <p className="mt-6 text-gray-600">
              {result.passed
                ? "You have successfully completed the assessment and your certificate has been issued."
                : "You did not reach the required passing score. Please review the material and try again."}
            </p>

            <button
              onClick={() =>
                navigate(
                  `/${user.role}/course/${assignmentId}`
                )
              }
              className="mt-8 w-full bg-[#18D39A] hover:bg-[#15bc88] text-white py-4 rounded-xl font-bold"
            >
              Return to Course
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default FinalAssessment;