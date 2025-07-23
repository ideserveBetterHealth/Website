import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await axios.post("/user/register", {
        name,
        email,
        password,
        role,
      });
      setMessage(data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#fffae3] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#000080]">Create Account</h2>
          <p className="text-sm text-gray-500">
            Sign up to get started with Better Health
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-1">
            <label htmlFor="name" className="font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Deepika Sharma"
              onFocus={() => setMessage("")}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setMessage("")}
              placeholder="Deepika@xyz.com"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="●●●●●●●●●"
              onFocus={() => setMessage("")}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="role" className="font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
            >
              <option value="user">User</option>
              <option value="doctor">Psychologist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#ec5228] hover:bg-[#d64720] text-white font-semibold py-2 rounded transition"
          >
            Sign Up
          </button>
        </form>
        {error && (
          <div className="text-red-600 text-center text-sm">{error}</div>
        )}
        {message && (
          <div className="text-green-600 text-center text-sm">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Signup;

// import React, { useState } from "react";
// import { Calendar } from "primereact/calendar";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/primereact.min.css";
// import { format } from "date-fns";

// const initialEmployment = {
//   organization: "",
//   jobTitle: "",
//   startDate: null,
//   endDate: null,
//   employmentType: "",
// };

// const initialEducation = {
//   educationLevel: "",
//   degree: "",
//   major: "",
//   institution: "",
//   graduationYear: null,
// };

// export default function DynamicForm() {
//   const [employmentDetails, setEmploymentDetails] = useState([
//     initialEmployment,
//   ]);
//   const [educationDetails, setEducationDetails] = useState([initialEducation]);
//   const [sameAddress, setSameAddress] = useState(false);
//   const [currentAddress, setCurrentAddress] = useState("");
//   const [permanentAddress, setPermanentAddress] = useState("");
//   const [dob, setDob] = useState(null);

//   const handleEmploymentChange = (index, name, value) => {
//     const updated = [...employmentDetails];
//     updated[index][name] = value;
//     setEmploymentDetails(updated);
//   };

//   const addEmployment = () => {
//     setEmploymentDetails([...employmentDetails, initialEmployment]);
//   };

//   const removeEmployment = (index) => {
//     const updated = employmentDetails.filter((_, i) => i !== index);
//     setEmploymentDetails(updated);
//   };

//   const handleEducationChange = (index, name, value) => {
//     const updated = [...educationDetails];
//     updated[index][name] = value;
//     setEducationDetails(updated);
//   };

//   const addEducation = () => {
//     setEducationDetails([...educationDetails, initialEducation]);
//   };

//   const removeEducation = (index) => {
//     const updated = educationDetails.filter((_, i) => i !== index);
//     setEducationDetails(updated);
//   };

//   const handleSameAddressChange = () => {
//     setSameAddress(!sameAddress);
//     if (!sameAddress) {
//       setPermanentAddress(currentAddress);
//     } else {
//       setPermanentAddress("");
//     }
//   };

//   const calendarInputStyle =
//     "w-full border p-2 rounded outline-none focus:outline-none focus:ring-0 focus:shadow-none";
//   const labelStyle = "block mb-1 font-medium text-gray-700";
//   const inputStyle = "w-full border p-2 rounded";

//   return (
//     <form className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded shadow-md">
//       <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
//         Personal Information
//       </h2>

//       <div>
//         <label htmlFor="firstName" className={labelStyle}>
//           First Name
//         </label>
//         <input
//           id="firstName"
//           name="firstName"
//           placeholder="First Name"
//           className={inputStyle}
//         />
//       </div>

//       <div>
//         <label htmlFor="middleName" className={labelStyle}>
//           Middle Name (Optional)
//         </label>
//         <input
//           id="middleName"
//           name="middleName"
//           placeholder="Middle Name (Optional)"
//           className={inputStyle}
//         />
//       </div>

//       <div>
//         <label htmlFor="lastName" className={labelStyle}>
//           Last Name
//         </label>
//         <input
//           id="lastName"
//           name="lastName"
//           placeholder="Last Name"
//           className={inputStyle}
//         />
//       </div>

//       <div>
//         <label htmlFor="dob" className={labelStyle}>
//           Date of Birth
//         </label>
//         <Calendar
//           id="dob"
//           value={dob}
//           onChange={(e) => setDob(e.value)}
//           placeholder="Date of Birth"
//           className="w-full"
//           inputClassName={calendarInputStyle}
//           showIcon
//         />
//       </div>

//       <div>
//         <label htmlFor="gender" className={labelStyle}>
//           Gender
//         </label>
//         <select id="gender" name="gender" className={inputStyle}>
//           <option value="">Select Gender</option>
//           <option>Male</option>
//           <option>Female</option>
//           <option>Other</option>
//           <option>Prefer not to say</option>
//         </select>
//       </div>

//       <div>
//         <label htmlFor="currentAddress" className={labelStyle}>
//           Current Residential Address
//         </label>
//         <textarea
//           id="currentAddress"
//           className={inputStyle}
//           value={currentAddress}
//           onChange={(e) => setCurrentAddress(e.target.value)}
//         ></textarea>
//       </div>
//       <div className="flex items-center gap-2">
//         <input
//           id="sameAddress"
//           type="checkbox"
//           checked={sameAddress}
//           onChange={handleSameAddressChange}
//         />
//         <label htmlFor="sameAddress" className="text-sm">
//           Same as Current Address
//         </label>
//       </div>

//       <div>
//         <label htmlFor="permanentAddress" className={labelStyle}>
//           Permanent Address
//         </label>
//         <textarea
//           id="permanentAddress"
//           className={inputStyle}
//           value={permanentAddress}
//           onChange={(e) => setPermanentAddress(e.target.value)}
//           disabled={sameAddress}
//         ></textarea>
//       </div>

//       <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
//         Employment Details
//       </h2>
//       {employmentDetails.map((job, index) => (
//         <div key={index} className="space-y-4 border p-4 rounded bg-gray-50">
//           <div>
//             <label className={labelStyle}>Organization Name</label>
//             <input
//               className={inputStyle}
//               value={job.organization}
//               onChange={(e) =>
//                 handleEmploymentChange(index, "organization", e.target.value)
//               }
//             />
//           </div>

//           <div>
//             <label className={labelStyle}>Job Title</label>
//             <input
//               className={inputStyle}
//               value={job.jobTitle}
//               onChange={(e) =>
//                 handleEmploymentChange(index, "jobTitle", e.target.value)
//               }
//             />
//           </div>

//           <div>
//             <label className={labelStyle}>Start Date</label>
//             <Calendar
//               value={job.startDate}
//               onChange={(e) =>
//                 handleEmploymentChange(index, "startDate", e.value)
//               }
//               className="w-full"
//               inputClassName={calendarInputStyle}
//               showIcon
//             />
//           </div>

//           <div>
//             <label className={labelStyle}>End Date</label>
//             <Calendar
//               value={job.endDate}
//               onChange={(e) =>
//                 handleEmploymentChange(index, "endDate", e.value)
//               }
//               className="w-full"
//               inputClassName={calendarInputStyle}
//               showIcon
//             />
//           </div>

//           <div>
//             <label className={labelStyle}>Employment Type</label>
//             <select
//               className={inputStyle}
//               value={job.employmentType}
//               onChange={(e) =>
//                 handleEmploymentChange(index, "employmentType", e.target.value)
//               }
//             >
//               <option value="">Select Type</option>
//               <option>Full-time</option>
//               <option>Part-time</option>
//               <option>Contract</option>
//               <option>Temporary</option>
//               <option>Other</option>
//             </select>
//           </div>

//           {employmentDetails.length > 1 && (
//             <button
//               type="button"
//               onClick={() => removeEmployment(index)}
//               className="text-red-600 text-sm underline"
//             >
//               Remove
//             </button>
//           )}
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={addEmployment}
//         className="text-blue-600 text-sm underline"
//       >
//         + Add Another Job
//       </button>

//       <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
//         Educational Background
//       </h2>
//       {educationDetails.map((edu, index) => (
//         <div key={index} className="space-y-4 border p-4 rounded bg-gray-50">
//           <div>
//             <label className={labelStyle}>Level of Education</label>
//             <select
//               className={inputStyle}
//               value={edu.educationLevel}
//               onChange={(e) =>
//                 handleEducationChange(index, "educationLevel", e.target.value)
//               }
//             >
//               <option value="">Select Level</option>
//               <option>High School</option>
//               <option>Diploma</option>
//               <option>Bachelor's Degree</option>
//               <option>Master's Degree</option>
//               <option>Doctorate</option>
//               <option>Other</option>
//             </select>
//           </div>

//           <div>
//             <label className={labelStyle}>Degree/Certification Name</label>
//             <input
//               className={inputStyle}
//               value={edu.degree}
//               onChange={(e) =>
//                 handleEducationChange(index, "degree", e.target.value)
//               }
//             />
//           </div>

//           <div>
//             <label className={labelStyle}>Major/Specialization</label>
//             <input
//               className={inputStyle}
//               value={edu.major}
//               onChange={(e) =>
//                 handleEducationChange(index, "major", e.target.value)
//               }
//             />
//           </div>

//           <div>
//             <label className={labelStyle}>Name of Institution</label>
//             <input
//               className={inputStyle}
//               value={edu.institution}
//               onChange={(e) =>
//                 handleEducationChange(index, "institution", e.target.value)
//               }
//             />
//           </div>

//           <div>
//             <label className={labelStyle}>Year of Graduation/Completion</label>
//             <Calendar
//               view="year"
//               dateFormat="yy"
//               value={edu.graduationYear}
//               onChange={(e) =>
//                 handleEducationChange(index, "graduationYear", e.value)
//               }
//               className="w-full"
//               inputClassName={calendarInputStyle}
//               showIcon
//             />
//           </div>

//           {educationDetails.length > 1 && (
//             <button
//               type="button"
//               onClick={() => removeEducation(index)}
//               className="text-red-600 text-sm underline"
//             >
//               Remove
//             </button>
//           )}
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={addEducation}
//         className="text-blue-600 text-sm underline"
//       >
//         + Add Another Education
//       </button>

//       <button
//         type="submit"
//         className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full mt-4"
//       >
//         Submit
//       </button>
//     </form>
//   );
// }
