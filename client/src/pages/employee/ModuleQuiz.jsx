import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import assignmentService from "../../services/assignmentService";
import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function ModuleQuiz() {
  const { assignmentId, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [module, setModule] = useState(null);

  const [loading, setLoading] = useState(true);

  const [answers, setAnswers] = useState({});

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [timeLeft, setTimeLeft] = useState(600);

  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, []);

  useEffect(() => {
    if (!module) return;

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

  }, [module]);

  const loadQuiz = async () => {

    try {

      const res =
        await assignmentService.getAssignments();

      const ass =
        res.data.assignments.find(
          (a) => a._id === assignmentId
        );

      if (!ass) {

        toast.error("Assignment not found.");

        return;
      }

      setAssignment(ass);

      const mod =
        ass.course.modules.find(
          (m) => m._id === moduleId
        );

      if (!mod) {

        toast.error("Module not found.");

        return;
      }

      if (!mod.quiz || mod.quiz.length === 0) {

        toast.error("No quiz available.");

        navigate(`/${user.role}/course/${assignmentId}`);

        return;

      }

      setModule(mod);

    } catch (err) {

      console.error(err);

      toast.error("Unable to load quiz.");

    } finally {

      setLoading(false);

    }

  };

  const handleOptionChange = (questionIndex, option) => {

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));

  };

  const nextQuestion = () => {

    if (
      currentQuestion <
      module.quiz.length - 1
    ) {
      setCurrentQuestion(currentQuestion + 1);
    }

  };

  const previousQuestion = () => {

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }

  };

  const formatTime = () => {

    const mins = Math.floor(timeLeft / 60);

    const secs = timeLeft % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;

  };
    const handleSubmit = async () => {

    if (submitting) return;

    try {

      setSubmitting(true);

      const answerArray = module.quiz.map(
        (_, index) => answers[index] || ""
      );

      const res =
        await assignmentService.submitModuleQuiz(
          assignmentId,
          moduleId,
          answerArray
        );

      setResult({
        passed: res.data.passed,
        score: res.data.score,
        correctAnswers: res.data.correctAnswers,
        totalQuestions: res.data.totalQuestions,
      });

      if (res.data.passed) {
        toast.success("Quiz Passed!");
      } else {
        toast.error("Quiz Failed. Try Again.");
      }

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Unable to submit quiz."
      );

    } finally {

      setSubmitting(false);

    }

  };

  if (loading) {

    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Loading Quiz...
      </div>
    );

  }

  if (!module) {

    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Quiz Not Found
      </div>
    );

  }

  if (result) {

    return (

      <div className="max-w-3xl mx-auto py-16 px-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <FaCheckCircle
            className={`mx-auto text-7xl ${
              result.passed
                ? "text-green-500"
                : "text-red-500"
            }`}
          />

          <h1 className="text-4xl font-bold mt-6">

            {result.passed
              ? "Congratulations!"
              : "Quiz Failed"}

          </h1>

          <p className="text-xl mt-6">

            Score : <b>{result.score}%</b>

          </p>

          <p className="mt-3">

            Correct Answers :

            <b>

              {" "}
              {result.correctAnswers} / {result.totalQuestions}

            </b>

          </p>

          {result.passed ? (

            <button
              onClick={() =>
                navigate(
                  `/${user.role}/course/${assignmentId}`
                )
              }
              className="mt-10 bg-[#18D39A] hover:bg-[#14bc87] text-white px-8 py-4 rounded-xl font-bold"
            >
              Continue Learning
            </button>

          ) : (

            <button
              onClick={() => {

                setAnswers({});

                setCurrentQuestion(0);

                setResult(null);

                setTimeLeft(600);

              }}
              className="mt-10 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold"
            >
              Retry Quiz
            </button>

          )}

        </div>

      </div>

    );

  }

  const question = module.quiz[currentQuestion];

  return (

    <div className="max-w-5xl mx-auto py-10 px-6">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#18D39A] font-semibold"
      >

        <FaArrowLeft />

        Back

      </button>

      <div className="bg-white rounded-3xl shadow-xl mt-8 p-8">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">

              {module.title}

            </h1>

            <p className="text-gray-500 mt-2">

              Module Quiz

            </p>

          </div>

          <div className="flex items-center gap-3 text-red-600 text-xl font-bold">

            <FaClock />

            {formatTime()}

          </div>

        </div>

        <div className="mt-10">

          <div className="flex justify-between mb-3">

            <span>

              Question {currentQuestion + 1} of{" "}

              {module.quiz.length}

            </span>

            <span>

              {Math.round(
                ((currentQuestion + 1) /
                  module.quiz.length) *
                  100
              )}

              %

            </span>

          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full">

            <div
              className="bg-[#18D39A] h-3 rounded-full transition-all"
              style={{
                width: `${((currentQuestion + 1) /
                  module.quiz.length) *
                  100}%`,
              }}
            />

          </div>

        </div>

        <div className="mt-10">

          <h2 className="text-2xl font-bold">

            {question.question}

          </h2>

          <div className="space-y-4 mt-8">

            {question.options.map((option, index) => (

              <label
                key={index}
                className={`flex items-center gap-4 border rounded-xl p-5 cursor-pointer transition hover:border-[#18D39A] ${
                  answers[currentQuestion] === option
                    ? "border-[#18D39A] bg-green-50"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  checked={
                    answers[currentQuestion] === option
                  }
                  onChange={() =>
                    handleOptionChange(
                      currentQuestion,
                      option
                    )
                  }
                />

                {option}

              </label>

            ))}

          </div>
                  </div>

        <div className="flex justify-between mt-10">

          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <FaChevronLeft />
            Previous
          </button>

          {currentQuestion < module.quiz.length - 1 ? (

            <button
              onClick={nextQuestion}
              className="bg-[#18D39A] hover:bg-[#14bc87] text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              Next
              <FaChevronRight />
            </button>

          ) : (

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold"
            >
              {submitting
                ? "Submitting..."
                : "Submit Quiz"}
            </button>

          )}

        </div>

        <div className="mt-8 bg-gray-50 rounded-xl p-5">

          <h3 className="font-bold text-lg mb-3">
            Quiz Summary
          </h3>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">

            {module.quiz.map((_, index) => (

              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`h-10 w-10 rounded-lg font-bold transition ${
                  answers[index]
                    ? "bg-[#18D39A] text-white"
                    : "bg-gray-200 text-gray-700"
                } ${
                  currentQuestion === index
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                {index + 1}
              </button>

            ))}

          </div>

          <div className="mt-5 flex justify-between items-center">

            <p className="text-gray-600">

              Answered{" "}

              <span className="font-bold">

                {Object.keys(answers).length}

              </span>{" "}

              of{" "}

              <span className="font-bold">

                {module.quiz.length}

              </span>{" "}

              questions

            </p>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {submitting
                ? "Submitting..."
                : "Finish Quiz"}
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ModuleQuiz;