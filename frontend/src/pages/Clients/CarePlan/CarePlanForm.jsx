import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Shield,
  Target,
  User,
  Heart,
} from "lucide-react";
import { useSelector } from "react-redux";

export function CarePlanForm({ carePlan, onBack, onSave }) {
  const isEditing = !!carePlan;
  const [activeTab, setActiveTab] = useState("overview");

  const { carePlanOptions, carePlanOptionsLoading } = useSelector(
    (state) => state.carePlans
  );

  const statuses = carePlanOptions?.status || [];

  // Helper function to format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  // Helper to format date as local datetime-local string
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  // Function to calculate review date (6 months from assessment date)
  const calculateReviewDate = (assessmentDate) => {
    const date = new Date(assessmentDate);
    date.setMonth(date.getMonth() + 6);
    return formatDateTimeLocal(date);
  };

  const [formData, setFormData] = useState({
    assessmentDate: formatDateForInput(carePlan?.assessmentDate),
    assessedBy: carePlan?.assessedBy || "",
    approvedBy: carePlan?.approvedBy || "",
    startDate: isEditing
      ? formatDateForInput(carePlan?.startDate)
      : new Date().toISOString().split("T")[0], // Auto-set to current date for new care plans
    reviewDate: isEditing
      ? formatDateTimeLocal(carePlan?.reviewDate)
      : calculateReviewDate(formatDateForInput(carePlan?.assessmentDate)),
    status: carePlan?.status || "draft",
    personalCare: {
      washing: {
        required: carePlan?.personalCare?.washing?.required || false,
        frequency: carePlan?.personalCare?.washing?.frequency || "",
        assistanceLevel:
          carePlan?.personalCare?.washing?.assistanceLevel || "independent",
        equipment: carePlan?.personalCare?.washing?.equipment || [],
        techniques: carePlan?.personalCare?.washing?.techniques || [],
        preferences: carePlan?.personalCare?.washing?.preferences || [],
        risks: carePlan?.personalCare?.washing?.risks || [],
        notes: carePlan?.personalCare?.washing?.notes || "",
      },
      bathing: {
        required: carePlan?.personalCare?.bathing?.required || false,
        frequency: carePlan?.personalCare?.bathing?.frequency || "",
        assistanceLevel:
          carePlan?.personalCare?.bathing?.assistanceLevel || "independent",
        equipment: carePlan?.personalCare?.bathing?.equipment || [],
        techniques: carePlan?.personalCare?.bathing?.techniques || [],
        preferences: carePlan?.personalCare?.bathing?.preferences || [],
        risks: carePlan?.personalCare?.bathing?.risks || [],
        notes: carePlan?.personalCare?.bathing?.notes || "",
      },
      dressing: {
        required: carePlan?.personalCare?.dressing?.required || false,
        frequency: carePlan?.personalCare?.dressing?.frequency || "",
        assistanceLevel:
          carePlan?.personalCare?.dressing?.assistanceLevel || "independent",
        equipment: carePlan?.personalCare?.dressing?.equipment || [],
        techniques: carePlan?.personalCare?.dressing?.techniques || [],
        preferences: carePlan?.personalCare?.dressing?.preferences || [],
        risks: carePlan?.personalCare?.dressing?.risks || [],
        notes: carePlan?.personalCare?.dressing?.notes || "",
      },
    },
    dailyLiving: {
      housework: {
        required: carePlan?.dailyLiving?.housework?.required || false,
        frequency: carePlan?.dailyLiving?.housework?.frequency || "",
        assistanceLevel:
          carePlan?.dailyLiving?.housework?.assistanceLevel || "independent",
        equipment: carePlan?.dailyLiving?.housework?.equipment || [],
        techniques: carePlan?.dailyLiving?.housework?.techniques || [],
        preferences: carePlan?.dailyLiving?.housework?.preferences || [],
        risks: carePlan?.dailyLiving?.housework?.risks || [],
        notes: carePlan?.dailyLiving?.housework?.notes || "",
      },
      shopping: {
        required: carePlan?.dailyLiving?.shopping?.required || false,
        frequency: carePlan?.dailyLiving?.shopping?.frequency || "",
        assistanceLevel:
          carePlan?.dailyLiving?.shopping?.assistanceLevel || "independent",
        equipment: carePlan?.dailyLiving?.shopping?.equipment || [],
        techniques: carePlan?.dailyLiving?.shopping?.techniques || [],
        preferences: carePlan?.dailyLiving?.shopping?.preferences || [],
        risks: carePlan?.dailyLiving?.shopping?.risks || [],
        notes: carePlan?.dailyLiving?.shopping?.notes || "",
      },
      cooking: {
        required: carePlan?.dailyLiving?.cooking?.required || false,
        frequency: carePlan?.dailyLiving?.cooking?.frequency || "",
        assistanceLevel:
          carePlan?.dailyLiving?.cooking?.assistanceLevel || "independent",
        equipment: carePlan?.dailyLiving?.cooking?.equipment || [],
        techniques: carePlan?.dailyLiving?.cooking?.techniques || [],
        preferences: carePlan?.dailyLiving?.cooking?.preferences || [],
        risks: carePlan?.dailyLiving?.cooking?.risks || [],
        notes: carePlan?.dailyLiving?.cooking?.notes || "",
      },
    },

    version: carePlan?.version || 1,
  });

  // Update review date when assessment date changes (only for new care plans)
  useEffect(() => {
    if (!isEditing && formData.assessmentDate) {
      setFormData((prev) => ({
        ...prev,
        reviewDate: calculateReviewDate(formData.assessmentDate),
      }));
    }
  }, [formData.assessmentDate, isEditing]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "personal-care", label: "Personal Care", icon: User },
    { id: "daily-living", label: "Daily Living", icon: Heart },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert reviewDate string (local) to Date object
    const reviewDateObj = formData.reviewDate
      ? new Date(formData.reviewDate)
      : null;
    const carePlanData = {
      ...formData,
      reviewDate: reviewDateObj,
      id: carePlan?.id || Date.now().toString(),
    };

    onSave(carePlanData);
  };

  const updateCareTask = (section, task, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [task]: {
          ...prev[section][task],
          [field]: value,
        },
      },
    }));
  };

  const renderCareTaskForm = (section, taskKey, taskLabel) => {
    const task = formData[section][taskKey];

    return (
      <div key={taskKey} className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">{taskLabel}</h4>
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`${section}-${taskKey}-required`}
              checked={task.required}
              onChange={(e) =>
                updateCareTask(section, taskKey, "required", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`${section}-${taskKey}-required`}
              className="ml-2 block text-sm text-gray-900"
            >
              Required
            </label>
          </div>
        </div>

        {task.required && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={task.frequency}
                onChange={(e) =>
                  updateCareTask(section, taskKey, "frequency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="Daily">Daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Twice weekly">Twice weekly</option>
                <option value="As needed">As needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assistance Level
              </label>
              <select
                value={task.assistanceLevel}
                onChange={(e) =>
                  updateCareTask(
                    section,
                    taskKey,
                    "assistanceLevel",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="independent">Independent</option>
                <option value="supervision">Supervision</option>
                <option value="partial-assistance">Partial Assistance</option>
                <option value="full-assistance">Full Assistance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Required
              </label>
              <input
                type="text"
                value={task.equipment.join(", ")}
                onChange={(e) =>
                  updateCareTask(
                    section,
                    taskKey,
                    "equipment",
                    e.target.value.split(", ").filter((item) => item.trim())
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List equipment needed..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Techniques
              </label>
              <input
                type="text"
                value={task.techniques.join(", ")}
                onChange={(e) =>
                  updateCareTask(
                    section,
                    taskKey,
                    "techniques",
                    e.target.value.split(", ").filter((item) => item.trim())
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Special techniques or methods..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Preferences
              </label>
              <textarea
                value={task.preferences.join(", ")}
                onChange={(e) =>
                  updateCareTask(
                    section,
                    taskKey,
                    "preferences",
                    e.target.value.split(", ").filter((item) => item.trim())
                  )
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Client preferences and choices..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={task.notes}
                onChange={(e) =>
                  updateCareTask(section, taskKey, "notes", e.target.value)
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes or instructions..."
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Care Plan" : "Create Care Plan"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update comprehensive care plan"
              : "Create a detailed care plan following CQC guidelines"}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />

                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Care Plan Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.assessmentDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        assessmentDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessed By *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.assessedBy}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        assessedBy: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approved By
                  </label>
                  <input
                    type="text"
                    value={formData.approvedBy}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        approvedBy: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !isEditing
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                    title={
                      !isEditing
                        ? "Start date is automatically set to current date for new care plans"
                        : ""
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.reviewDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reviewDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    disabled={carePlanOptionsLoading}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    {carePlanOptionsLoading ? (
                      <option>Loading options...</option>
                    ) : (
                      statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Care Tab */}
        {activeTab === "personal-care" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Care Needs
                </h3>
              </div>

              <div className="space-y-6">
                {renderCareTaskForm(
                  "personalCare",
                  "washing",
                  "Washing & Hygiene"
                )}
                {renderCareTaskForm(
                  "personalCare",
                  "bathing",
                  "Bathing & Showering"
                )}
                {renderCareTaskForm(
                  "personalCare",
                  "dressing",
                  "Dressing & Undressing"
                )}
              </div>
            </div>
          </div>
        )}

        {/* Daily Living Tab */}
        {activeTab === "daily-living" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Daily Living Support
                </h3>
              </div>

              <div className="space-y-6">
                {renderCareTaskForm(
                  "dailyLiving",
                  "housework",
                  "Housework & Cleaning"
                )}
                {renderCareTaskForm(
                  "dailyLiving",
                  "shopping",
                  "Shopping & Errands"
                )}
                {renderCareTaskForm(
                  "dailyLiving",
                  "cooking",
                  "Cooking & Meal Preparation"
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? "Update Care Plan" : "Save Care Plan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
