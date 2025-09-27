import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Users,
  UserCheck,
  Activity,
  Search,
  Calendar,
  Clock,
  Shield,
  Stethoscope,
  Sparkles,
  ChevronDown,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetAllUsersQuery } from "@/features/api/userApi";
import { useGetAllBHAssociatesQuery } from "@/features/api/bhAssociateApi";

const ManageBHFamily = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    admins: false,
    associates: false,
    clients: false,
  });

  // Fetch real data from APIs
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery();
  const {
    data: associatesData,
    isLoading: associatesLoading,
    error: associatesError,
  } = useGetAllBHAssociatesQuery();

  // Combine data from APIs
  const allUsers = useMemo(() => {
    if (usersLoading || associatesLoading)
      return { admins: [], associates: [], clients: [] };

    // Transform associates data to match expected format
    const transformedAssociates = (associatesData?.associates || []).map(
      (associate) => ({
        ...associate,
        _id: associate._id, // Ensure _id is preserved
        status: associate.isActive ? "active" : "inactive",
        designation: associate.type || "BH Associate",
        // Add any missing fields with defaults
        totalSessions: 0,
        lastService: "N/A",
        lastLogins: [],
        lastScheduleUpdates: associate.lastScheduleUpdates || [],
        lastActiveAt: associate.lastActiveAt || "Never",
        isVerified: associate.isVerified,
        isActive: associate.isActive,
      })
    );

    // Transform users data if needed
    const transformedAdmins = (usersData?.data?.admins || []).map((admin) => ({
      ...admin,
      status: admin.isActive ? "active" : "inactive",
      totalSessions: 0,
      lastService: "N/A",
      lastLogins: [],
      lastActiveAt: admin.lastActiveAt || "Never",
    }));

    const transformedClients = (usersData?.data?.clients || []).map(
      (client) => ({
        ...client,
        status: client.isActive ? "active" : "inactive",
        totalSessions: 0,
        lastService: "N/A",
        lastLogins: [],
        lastActiveAt: client.lastActiveAt || "Never",
      })
    );

    return {
      admins: transformedAdmins,
      associates: transformedAssociates,
      clients: transformedClients,
    };
  }, [usersData, associatesData, usersLoading, associatesLoading]);

  const filteredUsers = useMemo(() => {
    if (!allUsers) return { admins: [], associates: [], clients: [] };

    let filtered = {};

    filtered.admins = (allUsers.admins || []).filter(
      (user) =>
        (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.associates = (allUsers.associates || []).filter(
      (user) =>
        (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.specialization || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    filtered.clients = (allUsers.clients || []).filter(
      (user) =>
        (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered;
  }, [searchTerm, allUsers]);

  // Show loading state
  if (usersLoading || associatesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading BH Family data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (usersError || associatesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Error loading data</p>
              <p>
                {usersError?.message ||
                  associatesError?.message ||
                  "Something went wrong"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "verified":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    if (role.toLowerCase().includes("admin"))
      return <Shield className="w-5 h-5 text-red-600" />;
    if (
      role.toLowerCase().includes("psycho") ||
      role.toLowerCase().includes("psychiatrist")
    )
      return <Stethoscope className="w-5 h-5 text-purple-600" />;
    if (
      role.toLowerCase().includes("cosmetologist") ||
      role.toLowerCase().includes("dermatologist")
    )
      return <Sparkles className="w-5 h-5 text-orange-600" />;
    return <Users className="w-5 h-5 text-blue-600" />;
  };

  const getTotalCount = () => {
    return (
      (allUsers.admins?.length || 0) +
      (allUsers.associates?.length || 0) +
      (allUsers.clients?.length || 0)
    );
  };

  const UserCard = ({ user, type }) => (
    <Card className="bg-white hover:shadow-xl transition-all duration-500 group border-0 shadow-lg hover:scale-[1.02] overflow-hidden">
      <div className="relative">
        {/* Header with gradient background */}
        <div
          className={`h-20 bg-gradient-to-r ${
            type === "admins"
              ? "from-red-500 to-red-600"
              : type === "associates"
              ? "from-purple-500 to-purple-600"
              : "from-blue-500 to-blue-600"
          } relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            {type === "associates" ? (
              <>
                <Badge
                  className={`${
                    user.isVerified === "verified"
                      ? "bg-green-100 text-green-800"
                      : user.isVerified === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  } border-0 font-semibold shadow-sm text-xs`}
                >
                  {user.isVerified === "verified"
                    ? "Verified"
                    : user.isVerified === "pending"
                    ? "Pending"
                    : "Not Verified"}
                </Badge>
                <Badge
                  className={`${
                    user.isActive
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  } border-0 font-semibold shadow-sm text-xs`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </>
            ) : (
              <Badge
                className={`${getStatusColor(
                  user.status
                )} border-0 font-semibold shadow-sm`}
              >
                {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
              </Badge>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <CardHeader className="pb-4 relative -mt-8">
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg border-4 border-white ${
                type === "admins"
                  ? "bg-red-500"
                  : type === "associates"
                  ? "bg-purple-500"
                  : "bg-blue-500"
              }`}
            >
              {getRoleIcon(user.role)}
            </div>
            <div className="flex-1 min-w-0 mt-2">
              <CardTitle className="text-lg text-[#000080] mb-1 truncate font-bold">
                {user.name || "Unknown"}
              </CardTitle>
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <Mail className="w-3 h-3" />
                <p className="text-sm truncate">
                  {user.email || "Not Defined"}
                </p>
              </div>
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <Phone className="w-3 h-3" />
                <p className="text-sm truncate">{user.phoneNumber}</p>
              </div>
              <p
                className={`text-sm font-semibold ${
                  type === "admins"
                    ? "text-red-600"
                    : type === "associates"
                    ? "text-purple-600"
                    : "text-blue-600"
                }`}
              >
                {(user.designation || user.role).toUpperCase().slice(0, 1) +
                  (user.designation || user.role).slice(1)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6">
          {/* Client Credits Info */}
          {type === "clients" && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-700">
                  Available Credits
                </span>
              </div>
              {user.credits && user.credits.length > 0 ? (
                <div className="space-y-2">
                  {user.credits.map((credit, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1"
                    >
                      <span className="text-xs text-blue-600 font-medium capitalize">
                        {credit.serviceType.replace("_", " ")} -{" "}
                        {credit.duration}min
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {credit.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-blue-600 font-medium">
                  No credits available
                </p>
              )}
            </div>
          )}

          {/* Specialization */}
          {user.specialization && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-bold text-gray-700">
                  Specialization
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {user.specialization}
              </p>
            </div>
          )}

          {/* Last Active Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-700">
                Last Active
              </span>
            </div>
            <p className="text-sm text-indigo-600 font-medium">
              {user.lastActiveAt && user.lastActiveAt !== "Never"
                ? user.lastActiveAt
                : "Never logged in"}
            </p>
          </div>

          {/* Schedule Updates for Associates */}
          {type === "associates" &&
            user.lastScheduleUpdates &&
            user.lastScheduleUpdates.length > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-bold text-orange-700">
                    Schedule Updates
                  </span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {user.lastScheduleUpdates.slice(0, 5).map((update, index) => (
                    <div key={index} className="flex items-start gap-2 py-1">
                      <div
                        className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                          index === 0
                            ? "bg-orange-500 shadow-sm"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="text-xs text-orange-700 leading-tight font-medium">
                        {update}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Membership Info */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-bold text-purple-700">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className="text-xs text-purple-600 font-medium">
                {Math.floor(
                  (new Date() - new Date(user.createdAt)) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days ago
              </span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  UserCard.propTypes = {
    user: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      role: PropTypes.string,
      type: PropTypes.string,
      designation: PropTypes.string,
      specialization: PropTypes.string,
      status: PropTypes.string,
      totalSessions: PropTypes.number,
      lastService: PropTypes.string,
      lastLogins: PropTypes.arrayOf(PropTypes.string),
      lastScheduleUpdates: PropTypes.arrayOf(PropTypes.string),
      lastActiveAt: PropTypes.string,
      isVerified: PropTypes.string,
      isActive: PropTypes.bool,
      createdAt: PropTypes.string,
      credits: PropTypes.arrayOf(
        PropTypes.shape({
          duration: PropTypes.number,
          count: PropTypes.number,
          serviceType: PropTypes.string,
          _id: PropTypes.string,
        })
      ),
    }),
    type: PropTypes.string.isRequired,
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const CategorySection = ({
    title,
    users,
    type,
    icon,
    bgColor,
    isExpanded,
    onToggle,
  }) => (
    <div className="mb-6">
      {/* Clickable Header */}
      <button
        onClick={onToggle}
        className={`w-full bg-gradient-to-r ${bgColor} rounded-xl p-6 shadow-lg border flex items-center justify-between hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`${
              type === "admins"
                ? "text-red-600"
                : type === "associates"
                ? "text-purple-600"
                : "text-blue-600"
            } bg-white rounded-full p-3 shadow-sm`}
          >
            {icon}
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600">
              {users?.length || 0} members
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[5000px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        {users && users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user, index) => (
              <UserCard
                key={`${type}-${user._id || user.id || `fallback-${index}`}`}
                user={user}
                type={type}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No {title.toLowerCase()} found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms."
                : `No ${title.toLowerCase()} available.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  CategorySection.propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    bgColor: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffae3] via-white to-[#fffae3] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-20 pb-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#000080] mb-2">
              Manage BH Family
            </h1>
            <p className="text-gray-600">
              Overview of all Better Health family members and their activity
            </p>
          </div>

          {/* Stats Summary */}
          <div className="flex gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#000080]">
                  {getTotalCount()}
                </p>
                <p className="text-sm text-gray-600">Total Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-[#ec5228] focus:ring-[#ec5228] rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* All Category Sections */}
        <div className="space-y-6">
          {/* Admins Section */}
          <CategorySection
            title="Admins"
            users={filteredUsers.admins}
            type="admins"
            icon={<Shield className="w-5 h-5" />}
            bgColor="from-red-50 to-red-100"
            isExpanded={expandedSections.admins}
            onToggle={() => toggleSection("admins")}
          />

          {/* Better Health Associates Section */}
          <CategorySection
            title="Better Health Associates"
            users={filteredUsers.associates}
            type="associates"
            icon={<UserCheck className="w-5 h-5" />}
            bgColor="from-purple-50 to-purple-100"
            isExpanded={expandedSections.associates}
            onToggle={() => toggleSection("associates")}
          />

          {/* Clients Section */}
          <CategorySection
            title="Clients"
            users={filteredUsers.clients}
            type="clients"
            icon={<Users className="w-5 h-5" />}
            bgColor="from-blue-50 to-blue-100"
            isExpanded={expandedSections.clients}
            onToggle={() => toggleSection("clients")}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageBHFamily;
