import React from "react";
import { useSelector } from "react-redux";

const UserRoleDebugger = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="p-4 bg-yellow-100 rounded">Loading user data...</div>
    );
  }

  if (!user) {
    return <div className="p-4 bg-red-100 rounded">No user logged in</div>;
  }

  return (
    <div className="p-4 bg-blue-100 rounded mb-4">
      <h3 className="font-bold">Current User Debug Info:</h3>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Verified Status:</strong> {user.isVerified}
      </p>
      <p>
        <strong>User ID:</strong> {user._id}
      </p>

      <div className="mt-2">
        <strong>My Schedule Visibility Check:</strong>
        <ul className="ml-4">
          <li>✓ User logged in: {user ? "Yes" : "No"}</li>
          <li>✓ Role is 'doctor': {user.role === "doctor" ? "Yes" : "No"}</li>
          <li>
            ✓ User is verified: {user.isVerified === "verified" ? "Yes" : "No"}
          </li>
          <li>
            <strong>
              Should see My Schedule: {user.role === "doctor" ? "YES" : "NO"}
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserRoleDebugger;
