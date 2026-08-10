import { NavLink, useNavigate } from "react-router-dom";
import {
FaHome,
FaBookOpen,
FaClipboardCheck,
FaAward,
FaSignOutAlt,
FaUserCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import getskilledLogo from "../../assets/getskilled-logo.png";

function StudentSidebar() {

const { user, logout } = useAuth();
const navigate = useNavigate();

const navClass = ({ isActive }) =>
`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${
isActive
? "bg-[#18D39A] text-white"
: "text-slate-300 hover:bg-[#1E293B]"
}`;

return (

<aside className="w-[270px] bg-[#111827] flex flex-col h-screen">

<div className="p-6 border-b border-[#1F2937]">

<img
src={getskilledLogo}
className="bg-white rounded-xl p-3 h-16 object-contain"
/>

<h1 className="text-3xl font-black text-white mt-5">
SkillOS
</h1>

<p className="text-slate-400">
Student Portal
</p>

</div>

<div className="flex-1 px-5 py-6">

<nav className="space-y-2">

<NavLink
to="/student/dashboard"
className={navClass}
>
<FaHome />
Dashboard
</NavLink>

<NavLink
to="/student/courses"
className={navClass}
>
<FaBookOpen />
My Courses
</NavLink>

<NavLink
to="/student/quiz"
className={navClass}
>
<FaClipboardCheck />
Quiz
</NavLink>

<NavLink
to="/student/certificates"
className={navClass}
>
<FaAward />
Certificates
</NavLink>

</nav>

</div>

<div className="p-5 border-t border-[#1F2937]">

<div className="bg-[#1F2937] rounded-xl p-4 flex items-center gap-3">

<FaUserCircle
size={35}
className="text-[#18D39A]"
/>

<div>

<h3 className="text-white font-semibold">
{user?.name}
</h3>

<p className="text-slate-400 text-sm">
Student
</p>

</div>

</div>

<button
onClick={()=>{
logout();
navigate("/login");
}}
className="mt-4 w-full h-11 rounded-xl border border-slate-600 text-white"
>

Logout

</button>

</div>

</aside>

);

}

export default StudentSidebar;