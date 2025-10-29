import { useState } from "react";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";

const mentalHealthTips = [
  {
    id: 1,
    title: "Encourage Work-Life Balance",
    description:
      "Promote flexible work hours and encourage employees to log off on time to prevent burnout.",
  },
  {
    id: 2,
    title: "Normalize Mental Health Conversations",
    description:
      "Create a culture where talking about stress, burnout, and mental health is accepted and encouraged.",
  },
  {
    id: 3,
    title: "Recognize and Appreciate Employees",
    description:
      "Regularly acknowledge good work and effort, even for small wins—recognition boosts morale.",
  },
  {
    id: 4,
    title: "Ensure Fair Workload Distribution",
    description:
      "Keep an eye on who is overworked and redistribute tasks when needed to prevent burnout.",
  },
  {
    id: 5,
    title: "Promote Regular Breaks",
    description:
      "Encourage employees to take micro-breaks during the day and use their vacation days.",
  },
  {
    id: 6,
    title: "Offer Mental Health Resources",
    description:
      "Provide access to counseling, EAP programs, or mindfulness apps to support well-being.",
  },
  {
    id: 7,
    title: "Build Psychological Safety",
    description:
      "Make sure employees feel safe to voice concerns, share struggles, and ask for help.",
  },
  {
    id: 8,
    title: "Encourage Social Connections",
    description:
      "Foster team bonding through casual check-ins, virtual coffee chats, or team-building activities.",
  },
  {
    id: 9,
    title: "Lead by Example",
    description:
      "Show that mental health matters by practicing self-care, taking breaks, and being transparent about challenges.",
  },
  {
    id: 10,
    title: "Reduce Unnecessary Meetings",
    description:
      "Cut down on long, back-to-back meetings—opt for async updates or quick stand-ups.",
  },
  {
    id: 11,
    title: "Provide Career Growth Opportunities",
    description:
      "Help employees feel valued and engaged by supporting learning, promotions, and skill development.",
  },
  {
    id: 12,
    title: "Watch for Warning Signs",
    description:
      "Be proactive in spotting signs of stress or disengagement—like absenteeism, mood changes, or declining performance—and check in with employees privately.",
  },
];
const Tips = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const tipsPerPage = 1;
  const totalPages = Math.ceil(mentalHealthTips.length / tipsPerPage);

  // Calculate the starting index for the current page
  const startIndex = currentPage * tipsPerPage;
  const currentTips = mentalHealthTips.slice(
    startIndex,
    startIndex + tipsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mental-health-tips p-4 rounded-xl  dashed-border">
      <h2 className="text-title-lg text-title font-bold mb-4">
        Maybe some of these tips could help you improve
      </h2>

      {/* Display the tips */}
      <div
        className="tips-list translate-all transition-opacity duration-500 ease-in-out opacity-0"
        style={{ opacity: 1 }}
      >
        {currentTips.map((tip) => (
          <div
            key={tip.id}
            className="tip-item mb-4 p-4 rounded-lg min-h-36 bg-white shadow-card transition-all"
          >
            <h3 className="text-title-xsm font-semibold text-gray-600">
              {tip.title}
            </h3>
            <p className="text-sm text-gray-600">{tip.description}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls mt-4 flex justify-around items-center">
        <button
          className={`previous-btn p-2 rounded-full transition-all ${
            currentPage === 0
              ? " text-gray-400"
              : " hover:bg-white text-primary"
          }`}
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          <BsArrowLeftCircle size={32} />
        </button>
        <button
          className={`next-btn p-2 rounded-full transition-all ${
            currentPage === totalPages - 1
              ? " text-gray-400"
              : " hover:bg-white text-primary"
          }`}
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
        >
          <BsArrowRightCircle size={32} />
        </button>
      </div>
    </div>
  );
};

export default Tips;
