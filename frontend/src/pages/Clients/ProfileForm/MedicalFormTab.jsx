import { Button } from "../../../components/ui/Button";
import { Plus, Trash2, Activity, AlertTriangle, Pill } from "lucide-react";
import { Section } from "../../../components/ui/Section";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { useSelector } from "react-redux";
import { useApp } from "../../../components/Context/AppContext";

export function MedicalFormTab({ formData, setFormData }) {
  const { clientOptionsLoading } = useSelector((state) => state.clients);

  const {
    conditionSeverityOptions,
    conditionStatusOptions,
    allergySeverityOptions,
    medicationRouteOptions,
  } = useApp();

  const addItem = (type, item) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [type]: [...prev.medicalInformation[type], item],
      },
    }));
  };

  const updateItem = (type, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [type]: prev.medicalInformation[type].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const removeItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [type]: prev.medicalInformation[type].filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-8">
      {/* Medical Conditions */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Medical Conditions</h2>
                <p className="text-red-100 mt-1 text-sm">Diagnosed medical conditions and health status</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() =>
                addItem("conditions", {
                  id: Date.now().toString(),
                  condition: "",
                  diagnosisDate: "",
                  severity: "mild",
                  status: "active",
                  notes: "",
                })
              }
              variant="secondary"
              icon={Plus}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Add Condition
            </Button>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            {formData.medicalInformation.conditions.map((item, i) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 space-y-4"
              >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Condition"
                value={item.condition}
                onChange={(val) =>
                  updateItem("conditions", i, "condition", val)
                }
              />

              <Select
                label="Severity"
                value={item.severity}
                onChange={(val) => updateItem("conditions", i, "severity", val)}
                options={
                  clientOptionsLoading
                    ? ["Loading options..."]
                    : conditionSeverityOptions
                }
                disabled={clientOptionsLoading}
              />

              <Select
                label="Status"
                value={item.status}
                onChange={(val) => updateItem("conditions", i, "status", val)}
                options={
                  clientOptionsLoading
                    ? ["Loading options..."]
                    : conditionStatusOptions
                }
                disabled={clientOptionsLoading}
              />
              <Input
                type="date"
                label="Diagnosis Date"
                value={item.diagnosisDate}
                onChange={(val) =>
                  updateItem("conditions", i, "diagnosisDate", val)
                }
              />
              <Input
                label="Notes"
                value={item.notes}
                onChange={(val) => updateItem("conditions", i, "notes", val)}
                full
              />
            </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem("conditions", i)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
            {formData.medicalInformation.conditions.length === 0 && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No medical conditions added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Allergies</h2>
                <p className="text-yellow-100 mt-1 text-sm">Known allergies and adverse reactions</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() =>
                addItem("allergies", {
                  id: Date.now().toString(),
                  allergen: "",
                  reaction: "",
                  severity: "mild",
                  treatment: "",
                  notes: "",
                })
              }
              variant="secondary"
              icon={Plus}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Add Allergy
            </Button>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            {formData.medicalInformation.allergies.map((item, i) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 space-y-4"
              >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Allergen"
                value={item.allergen}
                onChange={(val) => updateItem("allergies", i, "allergen", val)}
              />
              <Input
                label="Reaction"
                value={item.reaction}
                onChange={(val) => updateItem("allergies", i, "reaction", val)}
              />
              <Select
                label="Severity"
                value={item.severity}
                onChange={(val) => updateItem("allergies", i, "severity", val)}
                options={
                  clientOptionsLoading
                    ? ["Loading options..."]
                    : allergySeverityOptions
                }
                disabled={clientOptionsLoading}
              />
              <Input
                label="Treatment"
                value={item.treatment}
                onChange={(val) => updateItem("allergies", i, "treatment", val)}
              />
            </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem("allergies", i)}
                    className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 hover:text-yellow-800 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
            {formData.medicalInformation.allergies.length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No allergies added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medications */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Medications</h2>
                <p className="text-blue-100 mt-1 text-sm">Current and prescribed medications</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() =>
                addItem("medications", {
                  id: Date.now().toString(),
                  name: "",
                  dosage: "",
                  frequency: "",
                  route: "",
                  prescribedBy: "",
                  startDate: "",
                  indication: "",
                  status: "active",
                })
              }
              variant="secondary"
              icon={Plus}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Add Medication
            </Button>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            {formData.medicalInformation.medications.map((item, i) => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 space-y-4"
              >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Medication Name"
                value={item.name}
                onChange={(val) => updateItem("medications", i, "name", val)}
              />
              <Input
                label="Dosage"
                value={item.dosage}
                onChange={(val) => updateItem("medications", i, "dosage", val)}
              />
              <Input
                label="Frequency"
                value={item.frequency}
                onChange={(val) =>
                  updateItem("medications", i, "frequency", val)
                }
              />
              <Select
                label="Route"
                value={item.route}
                onChange={(val) => updateItem("medications", i, "route", val)}
                options={
                  clientOptionsLoading
                    ? ["Loading options..."]
                    : medicationRouteOptions
                }
                disabled={clientOptionsLoading}
              />
              <Input
                label="Prescribed By"
                value={item.prescribedBy}
                onChange={(val) =>
                  updateItem("medications", i, "prescribedBy", val)
                }
              />
              <Input
                type="date"
                label="Start Date"
                value={item.startDate}
                onChange={(val) =>
                  updateItem("medications", i, "startDate", val)
                }
              />
              <Input
                label="Indication"
                value={item.indication}
                onChange={(val) =>
                  updateItem("medications", i, "indication", val)
                }
                full
              />
            </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem("medications", i)}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
            {formData.medicalInformation.medications.length === 0 && (
              <div className="text-center py-8">
                <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No medications added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
