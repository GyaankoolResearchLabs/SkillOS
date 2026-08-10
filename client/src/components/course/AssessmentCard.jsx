import { FaBookOpen, FaClipboardCheck } from "react-icons/fa";

import Card from "../ui/Card";
import Button from "../ui/Button";

function AssessmentCard() {
  return (
    <Card className="p-8">

      <div className="flex items-center gap-3 mb-8">

        <div className="w-12 h-12 rounded-xl bg-[#E8FFF6] flex items-center justify-center">

          <FaClipboardCheck
            className="text-[#18D39A]"
            size={20}
          />

        </div>

        <div>

          <h3 className="text-xl font-bold text-[#202B38]">
            Assessment
          </h3>

          <p className="text-sm text-[#64748B]">
            Verify course completion
          </p>

        </div>

      </div>

      <div className="space-y-5">

        <div className="flex justify-between items-center">

          <span className="text-[#64748B]">
            Questions
          </span>

          <strong className="text-[#202B38]">
            20
          </strong>

        </div>

        <div className="flex justify-between items-center">

          <span className="text-[#64748B]">
            Passing Score
          </span>

          <strong className="text-[#202B38]">
            70%
          </strong>

        </div>

        <div className="flex justify-between items-center">

          <span className="text-[#64748B]">
            Attempts
          </span>

          <strong className="text-[#202B38]">
            Unlimited
          </strong>

        </div>

      </div>

      <Button
        className="w-full mt-8"
        icon={<FaBookOpen />}
      >
        Start Assessment
      </Button>

    </Card>
  );
}

export default AssessmentCard;