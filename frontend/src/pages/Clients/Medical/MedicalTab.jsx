import {
  Heart,
  AlertTriangle,
  Edit3,
  Pill,
  Brain,
  ShieldCheck,
  Activity,
  Calendar,
  User,
  FileText,
  Clock,
  MapPin,
  AlertCircle,
  Skull,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateClient } from "../../../components/redux/slice/clients";
import toast from "react-hot-toast";
import { MedicalInfoEditModal } from "./MedicalInfoEditModal";
import { Button } from "../../../components/ui/Button";

export function MedicalTab({ client, onClientUpdate }) {
  const [showMedicalEditModal, setShowMedicalEditModal] = useState(false);
  const [savingMedicalInfo, setSavingMedicalInfo] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  const dispatch = useDispatch();

  const toggleNotes = (section, index = null) => {
    const key = index !== null ? `${section}-${index}` : section;
    setExpandedNotes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEditMedicalInfo = () => setShowMedicalEditModal(true);

  const handleSaveMedicalInfo = async (medicalData) => {
    setSavingMedicalInfo(true);
    try {
      const updatedClient = { ...client, medicalInformation: medicalData };
      const result = await dispatch(
        updateClient({ clientId: client._id, clientData: updatedClient })
      ).unwrap();

      toast.success("Medical information updated successfully");
      setShowMedicalEditModal(false);
      if (onClientUpdate) onClientUpdate(result?.data?.client || result);
    } catch (error) {
      console.error("Error updating medical information:", error);
      toast.error("Failed to update medical information");
    } finally {
      setSavingMedicalInfo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Modern Header with Edit Button */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Medical Information
                </h2>
                <p className="text-gray-600 mt-1">
                  Complete medical history and care requirements
                </p>
              </div>
            </div>
            <Button
              onClick={handleEditMedicalInfo}
              icon={Edit3}
              variant="default"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Edit Medical Info
            </Button>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* Medical Conditions */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Medical Conditions
                  </h3>
                  <p className="text-red-100 mt-1">
                    Diagnosed medical conditions and health status
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {client.medicalInformation?.conditions?.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-red-900 uppercase tracking-wider">
                            Condition
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-red-900 uppercase tracking-wider">
                            Severity
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-red-900 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-red-900 uppercase tracking-wider">
                            Diagnosis Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-red-900 uppercase tracking-wider">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {client.medicalInformation.conditions.map(
                          (cond, idx) => (
                            <tr
                              key={idx}
                              className={`hover:bg-red-50 transition-colors ${
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-red-100 rounded-lg">
                                    <Heart className="w-4 h-4 text-red-600" />
                                  </div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {cond.condition || "Unnamed condition"}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    cond.severity === "severe"
                                      ? "bg-red-100 text-red-800"
                                      : cond.severity === "moderate"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                      cond.severity === "severe"
                                        ? "bg-red-400"
                                        : cond.severity === "moderate"
                                        ? "bg-yellow-400"
                                        : "bg-green-400"
                                    }`}
                                  ></div>
                                  {cond.severity || "mild"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    cond.status === "active"
                                      ? "bg-blue-100 text-blue-800"
                                      : cond.status === "resolved"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                      cond.status === "active"
                                        ? "bg-blue-400"
                                        : cond.status === "resolved"
                                        ? "bg-gray-400"
                                        : "bg-purple-400"
                                    }`}
                                  ></div>
                                  {cond.status || "active"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {cond.diagnosisDate
                                    ? new Date(
                                        cond.diagnosisDate
                                      ).toLocaleDateString("en-GB")
                                    : "Not specified"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-600">
                                  {cond.notes ? (
                                    <div>
                                      <div
                                        className={`${
                                          expandedNotes[`condition-${idx}`]
                                            ? ""
                                            : "max-w-xs truncate"
                                        }`}
                                      >
                                        {cond.notes}
                                      </div>
                                      {cond.notes.length > 50 && (
                                        <button
                                          onClick={() =>
                                            toggleNotes("condition", idx)
                                          }
                                          className="flex items-center mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                                        >
                                          {expandedNotes[`condition-${idx}`] ? (
                                            <>
                                              <ChevronUp className="w-3 h-3 mr-1" />
                                              Show Less
                                            </>
                                          ) : (
                                            <>
                                              <ChevronDown className="w-3 h-3 mr-1" />
                                              Show More
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    "No notes"
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Conditions Summary Footer */}
                  <div className="bg-red-50 border-t border-red-200 px-6 py-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span className="text-blue-800 font-medium">
                            {
                              client.medicalInformation.conditions.filter(
                                (c) => c.status === "active" || !c.status
                              ).length
                            }{" "}
                            Active
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <span className="text-gray-800 font-medium">
                            {
                              client.medicalInformation.conditions.filter(
                                (c) => c.status === "resolved"
                              ).length
                            }{" "}
                            Resolved
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span className="text-red-800 font-medium">
                            {
                              client.medicalInformation.conditions.filter(
                                (c) => c.severity === "severe"
                              ).length
                            }{" "}
                            Severe
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-600 font-medium">
                        Total: {client.medicalInformation.conditions.length}{" "}
                        conditions
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                    <Heart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Medical Conditions
                  </h4>
                  <p className="text-gray-600">
                    No medical conditions have been recorded for this client.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Allergies & Adverse Reactions
                  </h3>
                  <p className="text-yellow-100 mt-1">
                    Known allergies and emergency response information
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {client.medicalInformation?.allergies?.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-900 uppercase tracking-wider">
                            Allergen
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-900 uppercase tracking-wider">
                            Severity
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-900 uppercase tracking-wider">
                            Reaction
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-900 uppercase tracking-wider">
                            Treatment
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-yellow-900 uppercase tracking-wider">
                            Alert
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {client.medicalInformation.allergies.map(
                          (allergy, idx) => (
                            <tr
                              key={idx}
                              className={`hover:bg-yellow-50 transition-colors ${
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      allergy.severity === "severe"
                                        ? "bg-red-100"
                                        : allergy.severity === "moderate"
                                        ? "bg-yellow-100"
                                        : "bg-green-100"
                                    }`}
                                  >
                                    <AlertTriangle
                                      className={`w-4 h-4 ${
                                        allergy.severity === "severe"
                                          ? "text-red-600"
                                          : allergy.severity === "moderate"
                                          ? "text-yellow-600"
                                          : "text-green-600"
                                      }`}
                                    />
                                  </div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {allergy.allergen || "Unknown allergen"}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    allergy.severity === "severe"
                                      ? "bg-red-100 text-red-800"
                                      : allergy.severity === "moderate"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                      allergy.severity === "severe"
                                        ? "bg-red-400"
                                        : allergy.severity === "moderate"
                                        ? "bg-yellow-400"
                                        : "bg-green-400"
                                    }`}
                                  ></div>
                                  {allergy.severity || "mild"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {allergy.reaction ? (
                                    <div>
                                      <div
                                        className={`${
                                          expandedNotes[
                                            `allergy-reaction-${idx}`
                                          ]
                                            ? ""
                                            : "max-w-xs truncate"
                                        }`}
                                      >
                                        {allergy.reaction}
                                      </div>
                                      {allergy.reaction.length > 30 && (
                                        <button
                                          onClick={() =>
                                            toggleNotes("allergy-reaction", idx)
                                          }
                                          className="flex items-center mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                                        >
                                          {expandedNotes[
                                            `allergy-reaction-${idx}`
                                          ] ? (
                                            <>
                                              <ChevronUp className="w-3 h-3 mr-1" />
                                              Less
                                            </>
                                          ) : (
                                            <>
                                              <ChevronDown className="w-3 h-3 mr-1" />
                                              More
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    "Not specified"
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {allergy.treatment ? (
                                    <div>
                                      <div
                                        className={`${
                                          expandedNotes[
                                            `allergy-treatment-${idx}`
                                          ]
                                            ? ""
                                            : "max-w-xs truncate"
                                        }`}
                                      >
                                        {allergy.treatment}
                                      </div>
                                      {allergy.treatment.length > 30 && (
                                        <button
                                          onClick={() =>
                                            toggleNotes(
                                              "allergy-treatment",
                                              idx
                                            )
                                          }
                                          className="flex items-center mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                                        >
                                          {expandedNotes[
                                            `allergy-treatment-${idx}`
                                          ] ? (
                                            <>
                                              <ChevronUp className="w-3 h-3 mr-1" />
                                              Less
                                            </>
                                          ) : (
                                            <>
                                              <ChevronDown className="w-3 h-3 mr-1" />
                                              More
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    "Not specified"
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {allergy.severity === "severe" && (
                                  <span className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                                    URGENT
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Allergies Summary Footer */}
                  <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span className="text-red-800 font-medium">
                            {
                              client.medicalInformation.allergies.filter(
                                (a) => a.severity === "severe"
                              ).length
                            }{" "}
                            Severe
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span className="text-yellow-800 font-medium">
                            {
                              client.medicalInformation.allergies.filter(
                                (a) => a.severity === "moderate"
                              ).length
                            }{" "}
                            Moderate
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-green-800 font-medium">
                            {
                              client.medicalInformation.allergies.filter(
                                (a) => a.severity === "mild" || !a.severity
                              ).length
                            }{" "}
                            Mild
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-600 font-medium">
                        Total: {client.medicalInformation.allergies.length}{" "}
                        allergies
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                    <AlertTriangle className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Allergies Recorded
                  </h4>
                  <p className="text-gray-600">
                    No allergies or adverse reactions have been documented.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Current Medications
                  </h3>
                  <p className="text-blue-100 mt-1">
                    Prescribed medications and pharmaceutical information
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {client.medicalInformation?.medications?.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                            Medication Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                            Dosage & Route
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                            Frequency
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                            Prescriber
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                            Start Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {client.medicalInformation.medications.map(
                          (med, idx) => (
                            <tr
                              key={idx}
                              className={`hover:bg-blue-50 transition-colors ${
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <Pill className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                      {med.name || "Unnamed medication"}
                                    </div>
                                    {med.indication && (
                                      <div className="text-xs text-gray-500 italic">
                                        {med.indication.length > 20 ? (
                                          <div>
                                            <div
                                              className={`${
                                                expandedNotes[
                                                  `med-indication-${idx}`
                                                ]
                                                  ? ""
                                                  : "truncate"
                                              }`}
                                            >
                                              For: {med.indication}
                                            </div>
                                            <button
                                              onClick={() =>
                                                toggleNotes(
                                                  "med-indication",
                                                  idx
                                                )
                                              }
                                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                            >
                                              {expandedNotes[
                                                `med-indication-${idx}`
                                              ] ? (
                                                <>
                                                  <ChevronUp className="w-3 h-3 inline mr-1" />
                                                  Less
                                                </>
                                              ) : (
                                                <>
                                                  <ChevronDown className="w-3 h-3 inline mr-1" />
                                                  More
                                                </>
                                              )}
                                            </button>
                                          </div>
                                        ) : (
                                          `For: ${med.indication}`
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {med.dosage || "Not specified"}
                                </div>
                                {med.route && (
                                  <div className="text-xs text-gray-500 uppercase font-medium">
                                    {med.route}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 font-mono">
                                  {med.frequency || "Not specified"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {med.prescribedBy || "Not specified"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {med.startDate
                                    ? new Date(
                                        med.startDate
                                      ).toLocaleDateString("en-GB")
                                    : "Not specified"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                    med.status === "active" || !med.status
                                      ? "bg-green-100 text-green-800"
                                      : med.status === "discontinued"
                                      ? "bg-red-100 text-red-800"
                                      : med.status === "on-hold"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                      med.status === "active" || !med.status
                                        ? "bg-green-400"
                                        : med.status === "discontinued"
                                        ? "bg-red-400"
                                        : med.status === "on-hold"
                                        ? "bg-yellow-400"
                                        : "bg-gray-400"
                                    }`}
                                  ></div>
                                  {med.status || "Active"}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Medication Summary Footer */}
                  <div className="bg-blue-50 border-t border-blue-200 px-6 py-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-green-800 font-medium">
                            {
                              client.medicalInformation.medications.filter(
                                (m) => m.status === "active" || !m.status
                              ).length
                            }{" "}
                            Active
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span className="text-yellow-800 font-medium">
                            {
                              client.medicalInformation.medications.filter(
                                (m) => m.status === "on-hold"
                              ).length
                            }{" "}
                            On Hold
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span className="text-red-800 font-medium">
                            {
                              client.medicalInformation.medications.filter(
                                (m) => m.status === "discontinued"
                              ).length
                            }{" "}
                            Discontinued
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-600 font-medium">
                        Total: {client.medicalInformation.medications.length}{" "}
                        medications
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                    <Pill className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Medications
                  </h4>
                  <p className="text-gray-600">
                    No medications have been recorded for this client.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Critical Care Information */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Critical Care Information
                  </h3>
                  <p className="text-indigo-100 mt-1">
                    Mental capacity and DNR status information
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                          Assessment Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                          Responsible Person
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                          Additional Info
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Mental Capacity Row */}
                      {client.medicalInformation?.mentalCapacity && (
                        <tr className="hover:bg-indigo-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Brain className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="text-sm font-semibold text-gray-900">
                                Mental Capacity
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                client.medicalInformation.mentalCapacity
                                  .hasCapacity
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  client.medicalInformation.mentalCapacity
                                    .hasCapacity
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                              {client.medicalInformation.mentalCapacity
                                .hasCapacity
                                ? "Yes"
                                : "Lack"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {client.medicalInformation.mentalCapacity
                                .assessmentDate
                                ? new Date(
                                    client.medicalInformation.mentalCapacity.assessmentDate
                                  ).toLocaleDateString("en-GB")
                                : "Not specified"}
                            </div>
                            {client.medicalInformation.mentalCapacity
                              .reviewDate && (
                              <div className="text-xs text-gray-500">
                                Review:{" "}
                                {new Date(
                                  client.medicalInformation.mentalCapacity.reviewDate
                                ).toLocaleDateString("en-GB")}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {client.medicalInformation.mentalCapacity
                                .assessedBy || "Not specified"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-gray-600">
                              Assessment Type: Mental Capacity Act
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">
                              {client.medicalInformation.mentalCapacity
                                .notes ? (
                                <div>
                                  <div
                                    className={`${
                                      expandedNotes["mental-capacity-notes"]
                                        ? ""
                                        : "max-w-xs truncate"
                                    }`}
                                  >
                                    {
                                      client.medicalInformation.mentalCapacity
                                        .notes
                                    }
                                  </div>
                                  {client.medicalInformation.mentalCapacity
                                    .notes.length > 50 && (
                                    <button
                                      onClick={() =>
                                        toggleNotes("mental-capacity-notes")
                                      }
                                      className="flex items-center mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                                    >
                                      {expandedNotes[
                                        "mental-capacity-notes"
                                      ] ? (
                                        <>
                                          <ChevronUp className="w-3 h-3 mr-1" />
                                          Less
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-3 h-3 mr-1" />
                                          More
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                "No notes"
                              )}
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* DNR Row */}
                      {client.medicalInformation?.dnr && (
                        <tr className="hover:bg-indigo-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-red-100 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              </div>
                              <div className="text-sm font-semibold text-gray-900">
                                DNR Status
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {client.medicalInformation.dnr.hasDNR ? (
                              <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse inline-flex items-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-md mr-1.5"></div>
                                ACTIVE
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <div className="w-1.5 h-1.5 rounded-full mr-1.5 bg-gray-400"></div>
                                No DNR
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {client.medicalInformation.dnr.dateIssued
                                ? new Date(
                                    client.medicalInformation.dnr.dateIssued
                                  ).toLocaleDateString("en-GB")
                                : "Not specified"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {client.medicalInformation.dnr.issuedBy ||
                                "Not specified"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-gray-600">
                              Location:{" "}
                              {client.medicalInformation.dnr.location ||
                                "Not specified"}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Family Aware:
                              <span
                                className={`ml-1 font-medium ${
                                  client.medicalInformation.dnr.familyAware
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {client.medicalInformation.dnr.familyAware
                                  ? "Yes"
                                  : "No"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">
                              {client.medicalInformation.dnr.notes ? (
                                <div>
                                  <div
                                    className={`${
                                      expandedNotes["dnr-notes"]
                                        ? ""
                                        : "max-w-xs truncate"
                                    }`}
                                  >
                                    {client.medicalInformation.dnr.notes}
                                  </div>
                                  {client.medicalInformation.dnr.notes.length >
                                    50 && (
                                    <button
                                      onClick={() => toggleNotes("dnr-notes")}
                                      className="flex items-center mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                                    >
                                      {expandedNotes["dnr-notes"] ? (
                                        <>
                                          <ChevronUp className="w-3 h-3 mr-1" />
                                          Less
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-3 h-3 mr-1" />
                                          More
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                "No notes"
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Critical Care Summary Footer */}
                <div className="bg-indigo-50 border-t border-indigo-200 px-6 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-6">
                      {client.medicalInformation?.mentalCapacity && (
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              client.medicalInformation.mentalCapacity
                                .hasCapacity
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                          ></div>
                          <span
                            className={`font-medium ${
                              client.medicalInformation.mentalCapacity
                                .hasCapacity
                                ? "text-green-800"
                                : "text-red-800"
                            }`}
                          >
                            Mental Capacity:{" "}
                            {client.medicalInformation.mentalCapacity
                              .hasCapacity
                              ? "Yes"
                              : "Lack"}
                          </span>
                        </div>
                      )}

                      {client.medicalInformation?.dnr && (
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              client.medicalInformation.dnr.hasDNR
                                ? "bg-red-400"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <span
                            className={`font-medium ${
                              client.medicalInformation.dnr.hasDNR
                                ? "text-red-800"
                                : "text-gray-800"
                            }`}
                          >
                            DNR:{" "}
                            {client.medicalInformation.dnr.hasDNR
                              ? "Active"
                              : "Not Active"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-gray-600 font-medium">
                      Critical assessments documented
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showMedicalEditModal && (
        <MedicalInfoEditModal
          isOpen={showMedicalEditModal}
          onClose={() => setShowMedicalEditModal(false)}
          medicalInfo={client.medicalInformation}
          onSave={handleSaveMedicalInfo}
          isLoading={savingMedicalInfo}
        />
      )}
    </div>
  );
}
