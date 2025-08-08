import React, { useState, useEffect } from "react";
import { ContactTab } from "../Contacts/ContactTab";
import { ActivityTab } from "../ActivityLog/ActivityTab";
import { RiskAssessmentManager } from "../RiskAssessments/RiskAssessmentManager";
import { CarePlanManager } from "../CarePlan/CarePlanManager";
import { VisitScheduleManager } from "../Visits/VisitScheduleManager";
import { DocumentationManager } from "../Documents/DocumentationManager";
import { ComplianceTracker } from "../Compliance/ComplianceTracker";
import { useDispatch } from "react-redux";
import { OverviewTab } from "../Overview/OverviewTab";
import { PersonalTab } from "../Personal/PersonalTab";
import { MedicalTab } from "../Medical/MedicalTab";
import { fetchContacts } from "../../../components/redux/slice/contacts";
import { CommunicationTab } from "../Communication/CommunicationTab";
import {
  ArrowLeft,
  User,
  Heart,
  Shield,
  Users,
  AlertTriangle,
  Calendar,
  FileText,
  MessageSquare,
  Activity,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  Zap,
  Brain,
  Skull,
} from "lucide-react";
import { getClientImage } from "../../../utils/avatarUtils";
import {
  getClientInitials,
  getInitialsColor,
} from "../../../utils/initialsUtils";
import { Button } from "../../../components/ui/Button";

export function ClientProfileDetails({ client, onBack, onClientUpdate }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  const dispatch = useDispatch();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5500";

  useEffect(() => {
    if (client?._id) {
      dispatch(fetchContacts(client._id));
    }
  }, [dispatch, client?._id]);

  const initials = getClientInitials(client.personalDetails?.fullName);
  const initialsColor = getInitialsColor(client.personalDetails?.fullName);

  // Helper function to identify critical medical conditions
  const getCriticalMedicalAlerts = () => {
    const alerts = [];

    // Check for DNAR
    if (client.medicalInformation?.dnr?.hasDNR) {
      alerts.push({
        type: "DNAR",
        icon: AlertCircle,
        color: "bg-red-500",
        textColor: "text-white",
        priority: 1,
      });
    }

    // Check conditions for serious issues
    const conditions = client.medicalInformation?.conditions || [];
    conditions.forEach((condition) => {
      const conditionName = condition.condition?.toLowerCase() || "";

      if (
        conditionName.includes("dementia") ||
        conditionName.includes("alzheimer")
      ) {
        alerts.push({
          type: "Dementia",
          icon: Brain,
          color: "bg-orange-500",
          textColor: "text-white",
          priority: 2,
        });
      } else if (
        conditionName.includes("diabetes") &&
        condition.severity === "severe"
      ) {
        alerts.push({
          type: "Severe Diabetes",
          icon: AlertCircle,
          color: "bg-red-500",
          textColor: "text-white",
          priority: 3,
        });
      } else if (
        conditionName.includes("heart") ||
        conditionName.includes("cardiac")
      ) {
        alerts.push({
          type: "Heart Condition",
          icon: Heart,
          color: "bg-red-500",
          textColor: "text-white",
          priority: 3,
        });
      } else if (
        conditionName.includes("stroke") ||
        conditionName.includes("seizure")
      ) {
        alerts.push({
          type: "Neurological",
          icon: Zap,
          color: "bg-purple-500",
          textColor: "text-white",
          priority: 3,
        });
      }
    });

    // Check for severe allergies
    const allergies = client.medicalInformation?.allergies || [];
    const severeAllergies = allergies.filter(
      (allergy) => allergy.severity === "severe"
    );
    if (severeAllergies.length > 0) {
      alerts.push({
        type: "Severe Allergies",
        icon: AlertTriangle,
        color: "bg-yellow-500",
        textColor: "text-white",
        priority: 4,
      });
    }

    // Remove duplicates and sort by priority
    const uniqueAlerts = alerts.filter(
      (alert, index, self) =>
        index === self.findIndex((a) => a.type === alert.type)
    );

    return uniqueAlerts.sort((a, b) => a.priority - b.priority).slice(0, 4); // Max 4 alerts
  };

  const criticalAlerts = getCriticalMedicalAlerts();

  // Main dashboard view with modern spacious layout
  if (activeSection === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Modern Header */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={onBack}
                className="group p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </button>

              <div className="flex items-center space-x-8 flex-1">
                <div className="relative">
                  <div
                    className={`w-24 h-24 rounded-full ${initialsColor} flex items-center justify-center border-4 border-white shadow-lg`}
                  >
                    <span className="text-white text-2xl font-bold">
                      {initials}
                    </span>
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white ${
                      client.status === "active"
                        ? "bg-green-500"
                        : client.status === "inactive"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {client.personalDetails?.fullName || "Client Name"}
                    </h1>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-mono">
                      ID: {client.ClientID || "Not available"}
                    </span>
                    <span
                      className={`px-4 py-2 rounded-md text-sm font-semibold ${
                        client.status === "active"
                          ? "bg-green-100 text-green-800"
                          : client.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {client.status || "No Status"}
                    </span>

                    {/* Critical Medical Alert Icons */}
                    {criticalAlerts.map((alert, index) => {
                      const IconComponent = alert.icon;
                      return (
                        <div
                          key={index}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-md ${alert.color} ${alert.textColor} text-xs font-bold shadow-lg animate-pulse`}
                          title={`Critical Alert: ${alert.type}`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{alert.type}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-lg text-gray-600">
                    NHS: {client.personalDetails?.nhsNumber || "N/A"} • DOB:{" "}
                    {client.personalDetails?.dateOfBirth
                      ? new Date(
                          client.personalDetails.dateOfBirth
                        ).toLocaleDateString("en-GB")
                      : "N/A"}{" "}
                    • Age:{" "}
                    {client.personalDetails?.dateOfBirth
                      ? Math.floor(
                          (new Date().getTime() -
                            new Date(
                              client.personalDetails.dateOfBirth
                            ).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000)
                        )
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Sections with Spacious Layout */}
          <div className="space-y-8">
            {/* Personal Information Section - Similar to Add Client Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Personal Information
                      </h2>
                      <p className="text-blue-100 mt-1">
                        Essential client details and contact information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection("personal")}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Primary Phone
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.contactInformation?.primaryPhone ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email Address
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.contactInformation?.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Preferred Contact
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.contactInformation?.preferredContactMethod ||
                        "Not specified"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">
                      Address
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.addressInformation?.address || "Not provided"}
                      {client.addressInformation?.city &&
                        `, ${client.addressInformation.city}`}
                      {client.addressInformation?.postCode &&
                        ` ${client.addressInformation.postCode}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Gender
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.personalDetails?.gender || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Summary Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Medical Summary
                      </h2>
                      <p className="text-red-100 mt-1">
                        Key medical information and health status
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection("medical")}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Medical Conditions */}
                  <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <Activity className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-2xl font-bold text-red-600">
                        {client.medicalInformation?.conditions?.length || 0}
                      </span>
                    </div>
                    <h4 className="font-semibold text-red-900 mb-3">
                      Medical Conditions
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {client.medicalInformation?.conditions?.length > 0 ? (
                        client.medicalInformation.conditions
                          .slice(0, 3)
                          .map((condition, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-gray-700 truncate flex-1 mr-2">
                                {condition.condition || "Unnamed condition"}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-md text-xs font-medium ${
                                  condition.severity === "severe"
                                    ? "bg-red-200 text-red-800"
                                    : condition.severity === "moderate"
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-green-200 text-green-800"
                                }`}
                              >
                                {condition.severity || "mild"}
                              </span>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-500 text-xs">
                          No conditions recorded
                        </p>
                      )}
                      {client.medicalInformation?.conditions?.length > 3 && (
                        <p className="text-red-600 text-xs font-medium">
                          +{client.medicalInformation.conditions.length - 3}{" "}
                          more...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-yellow-100 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      </div>
                      <span className="text-2xl font-bold text-yellow-600">
                        {client.medicalInformation?.allergies?.length || 0}
                      </span>
                    </div>
                    <h4 className="font-semibold text-yellow-900 mb-3">
                      Known Allergies
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {client.medicalInformation?.allergies?.length > 0 ? (
                        client.medicalInformation.allergies
                          .slice(0, 3)
                          .map((allergy, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-gray-700 truncate flex-1 mr-2">
                                {allergy.allergen || "Unknown allergen"}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-md text-xs font-medium ${
                                  allergy.severity === "severe"
                                    ? "bg-red-200 text-red-800"
                                    : allergy.severity === "moderate"
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-green-200 text-green-800"
                                }`}
                              >
                                {allergy.severity || "mild"}
                              </span>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-500 text-xs">
                          No allergies recorded
                        </p>
                      )}
                      {client.medicalInformation?.allergies?.length > 3 && (
                        <p className="text-yellow-600 text-xs font-medium">
                          +{client.medicalInformation.allergies.length - 3}{" "}
                          more...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {client.medicalInformation?.medications?.length || 0}
                      </span>
                    </div>
                    <h4 className="font-semibold text-blue-900 mb-3">
                      Current Medications
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {client.medicalInformation?.medications?.length > 0 ? (
                        client.medicalInformation.medications
                          .slice(0, 3)
                          .map((medication, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700 truncate flex-1 mr-2 font-medium">
                                  {medication.name || "Unnamed medication"}
                                </span>
                                <span className="text-blue-600 text-xs">
                                  {medication.dosage || "N/A"}
                                </span>
                              </div>
                              <div className="text-gray-500 text-xs mt-1">
                                {medication.frequency ||
                                  "Frequency not specified"}
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-500 text-xs">
                          No medications recorded
                        </p>
                      )}
                      {client.medicalInformation?.medications?.length > 3 && (
                        <p className="text-blue-600 text-xs font-medium">
                          +{client.medicalInformation.medications.length - 3}{" "}
                          more...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Critical Medical Alerts Section */}
                {criticalAlerts.length > 0 && (
                  <div className="mt-8 p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <h4 className="text-lg font-semibold text-red-900">
                        Critical Medical Alerts
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {criticalAlerts.map((alert, index) => {
                        const IconComponent = alert.icon;
                        return (
                          <div
                            key={index}
                            className="p-4 bg-white rounded-xl border border-red-200 shadow-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 ${alert.color} rounded-lg`}>
                                <IconComponent
                                  className={`w-5 h-5 ${alert.textColor}`}
                                />
                              </div>
                              <div>
                                <h5 className="font-semibold text-red-900 text-sm">
                                  {alert.type}
                                </h5>
                                <p className="text-red-700 text-xs">
                                  Requires special attention
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Care & Communication Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Care Management */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Care Management
                      </h2>
                      <p className="text-green-100 mt-1">
                        Care plans and assessments
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <Button
                    onClick={() => setActiveSection("care-plan")}
                    variant="outline"
                    className="w-full justify-between py-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>Care Plan</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setActiveSection("visits")}
                    variant="outline"
                    className="w-full justify-between py-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>Visit Schedule</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setActiveSection("risk-assessments")}
                    variant="outline"
                    className="w-full justify-between py-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span>Risk Assessments</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Communication & Records */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Communication & Records
                      </h2>
                      <p className="text-purple-100 mt-1">
                        Contacts and documentation
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <Button
                    onClick={() => setActiveSection("contacts")}
                    variant="outline"
                    className="w-full justify-between py-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span>Family & Friends</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setActiveSection("communications")}
                    variant="outline"
                    className="w-full justify-between py-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <span>Communication Log</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setActiveSection("documents")}
                    variant="outline"
                    className="w-full justify-between py-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span>Documentation</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setActiveSection("activity-log")}
                    variant="outline"
                    className="w-full justify-between py-3 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-gray-600" />
                      <span>Activity Log</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Individual section views
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back to Dashboard Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveSection("dashboard")}
              className="group p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {client.personalDetails?.fullName || "Client Name"} -{" "}
                {activeSection === "personal"
                  ? "Personal Details"
                  : activeSection === "medical"
                  ? "Medical Information"
                  : activeSection === "care-plan"
                  ? "Care Plan"
                  : activeSection === "visits"
                  ? "Visit Schedule"
                  : activeSection === "risk-assessments"
                  ? "Risk Assessments"
                  : activeSection === "contacts"
                  ? "Family & Friends"
                  : activeSection === "communications"
                  ? "Communications"
                  : activeSection === "documents"
                  ? "Documentation"
                  : activeSection === "compliance"
                  ? "Compliance"
                  : activeSection === "activity-log"
                  ? "Activity Log"
                  : "Details"}
              </h1>

              {/* Critical Medical Alert Icons */}
              {criticalAlerts.map((alert, index) => {
                const IconComponent = alert.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full ${alert.color} ${alert.textColor} text-xs font-bold shadow-lg`}
                    title={`Critical Alert: ${alert.type}`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{alert.type}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {activeSection === "personal" && (
            <PersonalTab client={client} onClientUpdate={onClientUpdate} />
          )}
          {activeSection === "medical" && (
            <MedicalTab client={client} onClientUpdate={onClientUpdate} />
          )}
          {activeSection === "contacts" && <ContactTab client={client} />}
          {activeSection === "risk-assessments" && (
            <RiskAssessmentManager
              clientId={client._id}
              clientName={
                client?.personalDetails.fullName
                  ? `${client.personalDetails.fullName}`
                  : "Unknown Client"
              }
            />
          )}
          {activeSection === "care-plan" && <CarePlanManager client={client} />}
          {activeSection === "visits" && (
            <VisitScheduleManager clientId={client._id} />
          )}
          {activeSection === "documents" && (
            <DocumentationManager client={client} />
          )}
          {activeSection === "communications" && (
            <CommunicationTab clientId={client._id} client={client} />
          )}
          {activeSection === "compliance" && (
            <ComplianceTracker client={client} compliance={client.compliance} />
          )}
          {activeSection === "activity-log" && <ActivityTab client={client} />}
        </div>
      </div>
    </div>
  );
}
