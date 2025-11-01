import { useState } from "react";
import axios from "axios";

const CreateCoupon = () => {
  const [formData, setFormData] = useState({
    code: "",
    serviceDiscounts: [
      {
        serviceType: "mental_health",
        enabled: false,
        discount: "",
        discountType: "percentage",
        maxDiscountAmount: "",
        minOrderAmount: "",
        planDiscounts: [],
      },
      {
        serviceType: "cosmetology",
        enabled: false,
        discount: "",
        discountType: "percentage",
        maxDiscountAmount: "",
        minOrderAmount: "",
        planDiscounts: [],
      },
    ],
    maxUses: "",
    validFrom: "",
    validTill: "",
    isActive: true,
    isNewUserOnly: false,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/coupons`;

  axios.defaults.withCredentials = true;

  const validateForm = () => {
    const newErrors = {};

    // Validate coupon code
    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters";
    }

    // Check if at least one service is enabled
    const enabledServices = formData.serviceDiscounts.filter(
      (sd) => sd.enabled
    );
    if (enabledServices.length === 0) {
      newErrors.services = "At least one service must be selected";
    }

    // Validate each enabled service
    formData.serviceDiscounts.forEach((serviceDiscount, index) => {
      if (serviceDiscount.enabled) {
        if (!serviceDiscount.discount) {
          newErrors[`service_${index}_discount`] = "Discount is required";
        } else if (serviceDiscount.discount <= 0) {
          newErrors[`service_${index}_discount`] =
            "Discount must be greater than 0";
        }

        // Validate discount percentage
        if (
          serviceDiscount.discountType === "percentage" &&
          serviceDiscount.discount > 100
        ) {
          newErrors[`service_${index}_discount`] =
            "Percentage discount cannot exceed 100%";
        }

        // Validate max discount amount for percentage discounts
        if (
          serviceDiscount.discountType === "percentage" &&
          serviceDiscount.maxDiscountAmount &&
          serviceDiscount.maxDiscountAmount < 0
        ) {
          newErrors[`service_${index}_maxDiscount`] =
            "Maximum discount amount cannot be negative";
        }

        // Validate min order amount
        if (
          serviceDiscount.minOrderAmount &&
          serviceDiscount.minOrderAmount < 0
        ) {
          newErrors[`service_${index}_minOrder`] =
            "Minimum order amount cannot be negative";
        }
      }
    });

    // Validate validity dates
    if (!formData.validFrom) {
      newErrors.validFrom = "Valid from date is required";
    }

    if (!formData.validTill) {
      newErrors.validTill = "Valid till date is required";
    }

    if (formData.validFrom && formData.validTill) {
      const fromDate = new Date(formData.validFrom);
      const tillDate = new Date(formData.validTill);

      if (fromDate >= tillDate) {
        newErrors.validTill = "Valid till date must be after valid from date";
      }
    }

    // Validate max uses if provided
    if (formData.maxUses && formData.maxUses < 1) {
      newErrors.maxUses = "Max uses must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "code") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleServiceToggle = (index) => {
    setFormData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts[index].enabled = !newServiceDiscounts[index].enabled;
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handleServiceInputChange = (index, field, value) => {
    setFormData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts[index][field] = value;
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handleAddPlanDiscount = (serviceIndex) => {
    setFormData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts[serviceIndex].planDiscounts.push({
        sessions: "",
        duration: "",
        discount: "",
        discountType: "percentage",
        maxDiscountAmount: "",
      });
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handleRemovePlanDiscount = (serviceIndex, planIndex) => {
    setFormData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts[serviceIndex].planDiscounts.splice(planIndex, 1);
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handlePlanDiscountChange = (serviceIndex, planIndex, field, value) => {
    setFormData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts[serviceIndex].planDiscounts[planIndex][field] = value;
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fix the errors below");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Filter only enabled services and clean up the data
      const enabledServices = formData.serviceDiscounts
        .filter((sd) => sd.enabled)
        .map((sd) => ({
          serviceType: sd.serviceType,
          discount: Number(sd.discount),
          discountType: sd.discountType,
          maxDiscountAmount: sd.maxDiscountAmount
            ? Number(sd.maxDiscountAmount)
            : null,
          minOrderAmount: sd.minOrderAmount ? Number(sd.minOrderAmount) : 0,
          planDiscounts: sd.planDiscounts
            .filter((pd) => pd.sessions && pd.duration && pd.discount)
            .map((pd) => ({
              sessions: Number(pd.sessions),
              duration: Number(pd.duration),
              discount: Number(pd.discount),
              discountType: pd.discountType,
              maxDiscountAmount: pd.maxDiscountAmount
                ? Number(pd.maxDiscountAmount)
                : null,
            })),
        }));

      const payload = {
        code: formData.code,
        serviceDiscounts: enabledServices,
        maxUses: formData.maxUses ? Number(formData.maxUses) : null,
        validFrom: formData.validFrom,
        validTill: formData.validTill,
        isActive: formData.isActive,
        isNewUserOnly: formData.isNewUserOnly,
        description: formData.description,
      };

      const response = await axios.post(`${API_BASE}/`, payload);

      if (response.data.success) {
        setMessage("Coupon created successfully!");
        setMessageType("success");

        // Reset form
        setFormData({
          code: "",
          serviceDiscounts: [
            {
              serviceType: "mental_health",
              enabled: false,
              discount: "",
              discountType: "percentage",
              maxDiscountAmount: "",
              minOrderAmount: "",
              planDiscounts: [],
            },
            {
              serviceType: "cosmetology",
              enabled: false,
              discount: "",
              discountType: "percentage",
              maxDiscountAmount: "",
              minOrderAmount: "",
              planDiscounts: [],
            },
          ],
          maxUses: "",
          validFrom: "",
          validTill: "",
          isActive: true,
          isNewUserOnly: false,
          description: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error creating coupon:", error);

      if (error.response) {
        setMessage(error.response.data.message || "Failed to create coupon");
      } else if (error.request) {
        setMessage("Network error. Please check your connection.");
      } else {
        setMessage("Error creating coupon. Please try again.");
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      code: "",
      serviceDiscounts: [
        {
          serviceType: "mental_health",
          enabled: false,
          discount: "",
          discountType: "percentage",
          maxDiscountAmount: "",
          minOrderAmount: "",
          planDiscounts: [],
        },
        {
          serviceType: "cosmetology",
          enabled: false,
          discount: "",
          discountType: "percentage",
          maxDiscountAmount: "",
          minOrderAmount: "",
          planDiscounts: [],
        },
      ],
      maxUses: "",
      validFrom: "",
      validTill: "",
      isActive: true,
      isNewUserOnly: false,
      description: "",
    });
    setErrors({});
    setMessage("");
  };

  const getServiceName = (serviceType) => {
    return serviceType === "mental_health"
      ? "Mental Health Counselling"
      : "Cosmetology Consultation";
  };

  // Helper function to get current date-time in local format
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Helper function to add days to current date
  const addDaysToDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Quick date setters
  const setQuickDate = (type) => {
    const now = getCurrentDateTime();
    let endDate = "";

    switch (type) {
      case "today":
        endDate = addDaysToDate(1);
        break;
      case "week":
        endDate = addDaysToDate(7);
        break;
      case "month":
        endDate = addDaysToDate(30);
        break;
      case "3months":
        endDate = addDaysToDate(90);
        break;
      case "6months":
        endDate = addDaysToDate(180);
        break;
      case "year":
        endDate = addDaysToDate(365);
        break;
      default:
        return;
    }

    setFormData((prev) => ({
      ...prev,
      validFrom: now,
      validTill: endDate,
    }));
  };

  return (
    <div className="min-h-screen  bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto mt-24">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create New Coupon
            </h1>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded mb-4"></div>
            <p className="text-gray-600">
              Add a new promotional coupon for services
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Coupon Code */}
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., NEWUSER20"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.code
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                  )}
                </div>

                {/* Max Uses */}
                <div>
                  <label
                    htmlFor="maxUses"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Maximum Uses (Optional)
                  </label>
                  <input
                    type="number"
                    id="maxUses"
                    name="maxUses"
                    value={formData.maxUses}
                    onChange={handleInputChange}
                    placeholder="Leave empty for unlimited"
                    min="1"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.maxUses
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.maxUses && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.maxUses}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Service-Specific Discounts */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Service-Specific Discounts *
              </h2>
              <p className="text-gray-600 mb-6">
                Configure different discount rates for each service. Select at
                least one service.
              </p>
              {errors.services && (
                <p className="mb-4 text-sm text-red-600">{errors.services}</p>
              )}

              <div className="space-y-6">
                {formData.serviceDiscounts.map((serviceDiscount, index) => (
                  <div
                    key={serviceDiscount.serviceType}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      serviceDiscount.enabled
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {/* Service Toggle Header */}
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviceDiscount.enabled}
                          onChange={() => handleServiceToggle(index)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-lg font-semibold text-gray-800">
                          {getServiceName(serviceDiscount.serviceType)}
                        </span>
                      </label>
                      {serviceDiscount.enabled && (
                        <span className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Service Discount Configuration */}
                    {serviceDiscount.enabled && (
                      <div className="space-y-4 mt-4 pt-4 border-t border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Discount Amount */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Discount Amount *
                            </label>
                            <input
                              type="number"
                              value={serviceDiscount.discount}
                              onChange={(e) =>
                                handleServiceInputChange(
                                  index,
                                  "discount",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 20"
                              min="0"
                              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                                errors[`service_${index}_discount`]
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-300 focus:border-blue-500"
                              }`}
                            />
                            {errors[`service_${index}_discount`] && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors[`service_${index}_discount`]}
                              </p>
                            )}
                          </div>

                          {/* Discount Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Discount Type *
                            </label>
                            <select
                              value={serviceDiscount.discountType}
                              onChange={(e) =>
                                handleServiceInputChange(
                                  index,
                                  "discountType",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                          </div>

                          {/* Min Order Amount */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Minimum Order Amount (₹)
                            </label>
                            <input
                              type="number"
                              value={serviceDiscount.minOrderAmount}
                              onChange={(e) =>
                                handleServiceInputChange(
                                  index,
                                  "minOrderAmount",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              min="0"
                              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                                errors[`service_${index}_minOrder`]
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-300 focus:border-blue-500"
                              }`}
                            />
                            {errors[`service_${index}_minOrder`] && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors[`service_${index}_minOrder`]}
                              </p>
                            )}
                          </div>

                          {/* Max Discount Amount (for percentage only) */}
                          {serviceDiscount.discountType === "percentage" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Discount Cap (₹)
                              </label>
                              <input
                                type="number"
                                value={serviceDiscount.maxDiscountAmount}
                                onChange={(e) =>
                                  handleServiceInputChange(
                                    index,
                                    "maxDiscountAmount",
                                    e.target.value
                                  )
                                }
                                placeholder="No limit"
                                min="0"
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                                  errors[`service_${index}_maxDiscount`]
                                    ? "border-red-300 focus:border-red-500"
                                    : "border-gray-300 focus:border-blue-500"
                                }`}
                              />
                              {errors[`service_${index}_maxDiscount`] && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors[`service_${index}_maxDiscount`]}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Discount Summary */}
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 text-blue-600 mr-2 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div className="text-sm text-gray-700">
                              <strong>Summary:</strong> This coupon will give{" "}
                              {serviceDiscount.discount
                                ? serviceDiscount.discountType === "percentage"
                                  ? `${serviceDiscount.discount}%`
                                  : `₹${serviceDiscount.discount}`
                                : "___"}{" "}
                              off on{" "}
                              {getServiceName(serviceDiscount.serviceType)}
                              {serviceDiscount.minOrderAmount &&
                                ` for orders above ₹${serviceDiscount.minOrderAmount}`}
                              {serviceDiscount.discountType === "percentage" &&
                                serviceDiscount.maxDiscountAmount &&
                                ` (capped at ₹${serviceDiscount.maxDiscountAmount})`}
                              .
                            </div>
                          </div>
                        </div>

                        {/* Plan-Specific Discounts (Optional) */}
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800">
                                Plan-Specific Discounts (Optional)
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                Override the default discount for specific
                                session plans
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddPlanDiscount(index)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Add Plan
                            </button>
                          </div>

                          {serviceDiscount.planDiscounts.length > 0 && (
                            <div className="space-y-3">
                              {serviceDiscount.planDiscounts.map(
                                (planDiscount, planIndex) => (
                                  <div
                                    key={planIndex}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-medium text-gray-700">
                                        Plan #{planIndex + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemovePlanDiscount(
                                            index,
                                            planIndex
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                      >
                                        Remove
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {/* Sessions */}
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Sessions
                                        </label>
                                        <input
                                          type="number"
                                          value={planDiscount.sessions}
                                          onChange={(e) =>
                                            handlePlanDiscountChange(
                                              index,
                                              planIndex,
                                              "sessions",
                                              e.target.value
                                            )
                                          }
                                          placeholder="e.g., 1"
                                          min="1"
                                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>

                                      {/* Duration */}
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Duration (min)
                                        </label>
                                        <input
                                          type="number"
                                          value={planDiscount.duration}
                                          onChange={(e) =>
                                            handlePlanDiscountChange(
                                              index,
                                              planIndex,
                                              "duration",
                                              e.target.value
                                            )
                                          }
                                          placeholder="e.g., 30"
                                          min="1"
                                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>

                                      {/* Discount */}
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Discount
                                        </label>
                                        <input
                                          type="number"
                                          value={planDiscount.discount}
                                          onChange={(e) =>
                                            handlePlanDiscountChange(
                                              index,
                                              planIndex,
                                              "discount",
                                              e.target.value
                                            )
                                          }
                                          placeholder="e.g., 25"
                                          min="0"
                                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>

                                      {/* Discount Type */}
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Type
                                        </label>
                                        <select
                                          value={planDiscount.discountType}
                                          onChange={(e) =>
                                            handlePlanDiscountChange(
                                              index,
                                              planIndex,
                                              "discountType",
                                              e.target.value
                                            )
                                          }
                                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                          <option value="percentage">%</option>
                                          <option value="fixed">₹</option>
                                        </select>
                                      </div>

                                      {/* Max Discount (for percentage) */}
                                      {planDiscount.discountType ===
                                        "percentage" && (
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Max Cap (₹)
                                          </label>
                                          <input
                                            type="number"
                                            value={
                                              planDiscount.maxDiscountAmount
                                            }
                                            onChange={(e) =>
                                              handlePlanDiscountChange(
                                                index,
                                                planIndex,
                                                "maxDiscountAmount",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Optional"
                                            min="0"
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          />
                                        </div>
                                      )}
                                    </div>

                                    {/* Plan Discount Summary */}
                                    <div className="mt-3 bg-white rounded p-2 border border-gray-200">
                                      <p className="text-xs text-gray-600">
                                        <strong>Plan Override:</strong>{" "}
                                        {planDiscount.planName || "___"} (
                                        {planDiscount.sessions || "_"} sessions,{" "}
                                        {planDiscount.duration || "_"} min) →{" "}
                                        {planDiscount.discount
                                          ? planDiscount.discountType ===
                                            "percentage"
                                            ? `${planDiscount.discount}%`
                                            : `₹${planDiscount.discount}`
                                          : "___"}{" "}
                                        off
                                        {planDiscount.discountType ===
                                          "percentage" &&
                                          planDiscount.maxDiscountAmount &&
                                          ` (max ₹${planDiscount.maxDiscountAmount})`}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {serviceDiscount.planDiscounts.length === 0 && (
                            <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
                              No plan-specific discounts added. The default
                              service discount will apply to all plans.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Validity Period */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Validity Period
              </h2>

              {/* Quick Date Selection */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quick Date Selection
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickDate("today")}
                    className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate("week")}
                    className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate("month")}
                    className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    1 Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate("3months")}
                    className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    3 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate("6months")}
                    className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    6 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate("year")}
                    className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    1 Year
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Click a button to quickly set the validity period from now
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Valid From */}
                <div>
                  <label
                    htmlFor="validFrom"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Valid From *
                  </label>
                  <input
                    type="datetime-local"
                    id="validFrom"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    min={getCurrentDateTime()}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.validFrom
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.validFrom && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.validFrom}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Select the start date and time for this coupon
                  </p>
                </div>

                {/* Valid Till */}
                <div>
                  <label
                    htmlFor="validTill"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Valid Till *
                  </label>
                  <input
                    type="datetime-local"
                    id="validTill"
                    name="validTill"
                    value={formData.validTill}
                    onChange={handleInputChange}
                    min={formData.validFrom || getCurrentDateTime()}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.validTill
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.validTill && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.validTill}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Select the end date and time for this coupon
                  </p>
                </div>
              </div>
            </div>

            {/* Description and Status */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Additional Details
              </h2>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief description of the coupon..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">
                      Coupon is Active
                    </span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-8">
                    Inactive coupons cannot be used by customers
                  </p>
                </div>

                {/* New User Only */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isNewUserOnly"
                      checked={formData.isNewUserOnly}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">
                      New User Only
                    </span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-8">
                    This coupon can only be used by users who haven&apos;t
                    booked any meetings previously
                  </p>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  messageType === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <div className="flex items-start">
                  {messageType === "success" ? (
                    <svg
                      className="w-5 h-5 mr-2 mt-0.5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 mr-2 mt-0.5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Coupon...
                  </div>
                ) : (
                  "Create Coupon"
                )}
              </button>

              <button
                type="button"
                onClick={clearForm}
                disabled={loading}
                className="flex-1 py-4 bg-gray-500 text-white font-bold text-lg rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📝 Advanced Coupon System Guidelines
          </h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>
              • <strong>Service-Specific Discounts:</strong> Set different
              discount rates for each service with the same coupon code
            </li>
            <li>
              • <strong>Example:</strong> &quot;SAVE20&quot; can give 20% off
              for mental health and 15% off for cosmetology
            </li>
            <li>
              • <strong>Plan-Specific Overrides:</strong> Configure different
              discounts for specific session plans (e.g., 30% off for &quot;5
              sessions 45min&quot; plan)
            </li>
            <li>
              • Each service can have its own minimum order amount and maximum
              discount cap
            </li>
            <li>
              • Plan-specific discounts override the default service discount
              for matching plans
            </li>
            <li>
              • Percentage discounts can be capped with a maximum discount
              amount
            </li>
            <li>
              • Fixed discounts apply a specific rupee amount regardless of
              order value
            </li>
            <li>
              • Enable &quot;New User Only&quot; to restrict coupon usage to
              first-time customers
            </li>
            <li>
              • Set validity period carefully - expired coupons cannot be used
            </li>
            <li>
              • You must select at least one service to create a valid coupon
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
