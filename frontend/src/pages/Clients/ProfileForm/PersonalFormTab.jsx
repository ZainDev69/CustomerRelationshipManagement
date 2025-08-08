import { useState } from "react";
import { Section } from "../../../components/ui/Section";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import { TextArea } from "../../../components/ui/TextArea";
import { User, MapPin, Phone, Users } from "lucide-react";
import { PhotoUpload } from "./PhotoUpload";
import { useApp } from "../../../components/Context/AppContext";
import { useSelector } from "react-redux";

export function PersonalFormTab({
  setFormData,
  client,
  formData,
  checkingClientId,
  clientIdExists,
  setPhotoFile,
}) {
  const [isPvt, setIsPvt] = useState(false);
  const isEditing = !!client;

  const { clientOptionsLoading } = useSelector((state) => state.clients);

  const {
    titleOptions,
    genderOptions,
    statusOptions,
    relationshipStatusOptions,
    ethnicityOptions,
    contactMethodOptions,
  } = useApp();

  // Handle checkbox toggle
  const handlePvtToggle = (checked) => {
    setIsPvt(checked);
    setFormData((prev) => {
      let newId = prev.clientId;
      if (checked && !newId.startsWith("PVT")) {
        newId = "PVT" + newId.replace(/^PVT/, "");
      } else if (!checked && newId.startsWith("PVT")) {
        newId = newId.replace(/^PVT/, "");
      }
      return { ...prev, clientId: newId };
    });
  };

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };
  return (
    <div className="space-y-8">
      {/* Photo Upload Section */}
      <PhotoUpload
        client={client}
        setPhotoFile={setPhotoFile}
        formData={formData}
      />
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Modern Section Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Basic Information
              </h2>
              <p className="text-blue-100 mt-1 text-sm">
                Essential client details and identification
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* PVT Checkbox */}
          <div className="mb-6">
            <Checkbox
              id="pvt-checkbox"
              checked={isPvt}
              disabled={isEditing}
              label={`Prefix Client ID with PVT ${
                isEditing ? "(cannot be changed when editing)" : ""
              }`}
              onChange={handlePvtToggle}
            />
          </div>

          {/* Row 1: Client ID, Title, Full Name, Preferred Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col space-y-2">
              <Input
                label="Client ID *"
                value={formData.clientId}
                required
                disabled={isEditing}
                placeholder={isEditing ? "Cannot change" : "Auto-generate"}
                onChange={(val) => {
                  if (isEditing) return;
                  let newVal = val.replace(/^PVT+/, "");
                  if (isPvt) newVal = "PVT" + newVal;
                  setFormData((prev) => ({ ...prev, clientId: newVal }));
                }}
              />
              {checkingClientId && !isEditing && (
                <span className="text-xs text-blue-500">Checking...</span>
              )}
              {clientIdExists && !isEditing && (
                <span className="text-xs text-red-500">ID exists!</span>
              )}
              {isEditing && (
                <span className="text-xs text-gray-500">Cannot modify</span>
              )}
            </div>
            <Select
              label="Title"
              value={formData.personalDetails.title}
              onChange={(val) => handleChange("personalDetails", "title", val)}
              options={clientOptionsLoading ? ["Loading..."] : titleOptions}
              disabled={clientOptionsLoading}
            />
            <Input
              label="Full Name *"
              value={formData.personalDetails.fullName}
              required
              onChange={(val) =>
                handleChange("personalDetails", "fullName", val)
              }
            />
            <Input
              label="Preferred Name"
              value={formData.personalDetails.preferredName}
              onChange={(val) =>
                handleChange("personalDetails", "preferredName", val)
              }
            />
          </div>

          {/* Row 2: Date of Birth, NHS Number, Gender, Relationship Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              label="Date of Birth *"
              type="date"
              value={formData.personalDetails.dateOfBirth}
              required
              onChange={(val) =>
                handleChange("personalDetails", "dateOfBirth", val)
              }
            />
            <Input
              label="NHS Number"
              value={formData.personalDetails.nhsNumber}
              onChange={(val) =>
                handleChange("personalDetails", "nhsNumber", val)
              }
            />
            <Select
              label="Gender"
              value={formData.personalDetails.gender}
              onChange={(val) => handleChange("personalDetails", "gender", val)}
              options={clientOptionsLoading ? ["Loading..."] : genderOptions}
              disabled={clientOptionsLoading}
            />
            <Select
              label="Relationship Status"
              value={formData.personalDetails.relationshipStatus}
              onChange={(val) =>
                handleChange("personalDetails", "relationshipStatus", val)
              }
              options={
                clientOptionsLoading
                  ? ["Loading..."]
                  : relationshipStatusOptions
              }
              disabled={clientOptionsLoading}
            />
          </div>

          {/* Row 3: Ethnicity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Ethnicity"
              value={formData.personalDetails.ethnicity}
              onChange={(val) =>
                handleChange("personalDetails", "ethnicity", val)
              }
              options={clientOptionsLoading ? ["Loading..."] : ethnicityOptions}
              disabled={clientOptionsLoading}
            />
          </div>
        </div>
      </div>

      {/* Special History Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Client History & Background
              </h2>
              <p className="text-amber-100 mt-1 text-sm">
                Personal history and background information
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <TextArea
            label="History & Background"
            placeholder="Provide detailed history and background information about the client..."
            value={formData.personalDetails.historyandBackground}
            rows={4}
            full
            onChange={(val) =>
              handleChange("personalDetails", "historyandBackground", val)
            }
          />
        </div>
      </div>

      {/* Status Selection - only show when editing */}
      {isEditing && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Client Status
                </h2>
                <p className="text-orange-100 mt-1 text-sm">
                  Current status and availability
                </p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Status"
                value={formData.status}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val }))
                }
                options={
                  clientOptionsLoading ? ["Loading options..."] : statusOptions
                }
                disabled={clientOptionsLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Address Information */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Address Information
              </h2>
              <p className="text-emerald-100 mt-1 text-sm">
                Location and access details
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Address Row 1: Address (full width) */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            <Input
              label="Address *"
              type="text"
              required
              value={formData.addressInformation.address}
              onChange={(val) =>
                handleChange("addressInformation", "address", val)
              }
            />
          </div>

          {/* Address Row 2: City, County, Post Code, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              label="City"
              value={formData.addressInformation.city}
              onChange={(val) =>
                handleChange("addressInformation", "city", val)
              }
            />
            <Input
              label="County"
              value={formData.addressInformation.county}
              onChange={(val) =>
                handleChange("addressInformation", "county", val)
              }
            />
            <Input
              label="Post Code"
              value={formData.addressInformation.postCode}
              onChange={(val) =>
                handleChange("addressInformation", "postCode", val)
              }
            />
            <Input
              label="Country"
              placeholder="Enter country"
              value={formData.addressInformation.country}
              onChange={(val) =>
                handleChange("addressInformation", "country", val)
              }
            />
          </div>

          {/* Address Row 3: Access Instructions (full width) */}
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Access Instructions"
              placeholder="Special instructions for accessing the property"
              value={formData.addressInformation.accessInstructions}
              onChange={(val) =>
                handleChange("addressInformation", "accessInstructions", val)
              }
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Contact Information
              </h2>
              <p className="text-purple-100 mt-1 text-sm">
                Communication preferences and details
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Contact Row 1: Primary Phone, Secondary Phone, Email, Preferred Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              label="Primary Phone"
              type="tel"
              value={formData.contactInformation.primaryPhone}
              onChange={(val) =>
                handleChange("contactInformation", "primaryPhone", val)
              }
            />
            <Input
              label="Secondary Phone"
              type="tel"
              value={formData.contactInformation.secondaryPhone}
              onChange={(val) =>
                handleChange("contactInformation", "secondaryPhone", val)
              }
            />
            <Input
              label="Email"
              type="email"
              value={formData.contactInformation.email}
              onChange={(val) =>
                handleChange("contactInformation", "email", val)
              }
            />
            <Select
              label="Contact Method"
              value={formData.contactInformation.preferredContactMethod}
              onChange={(val) =>
                handleChange(
                  "contactInformation",
                  "preferredContactMethod",
                  val
                )
              }
              options={
                clientOptionsLoading ? ["Loading..."] : contactMethodOptions
              }
              disabled={clientOptionsLoading}
            />
          </div>

          {/* Contact Row 2: Best Time to Contact (full width) */}
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Best Time to Contact"
              placeholder="e.g, Weekday mornings, Evenings after 6pm"
              value={formData.contactInformation.bestTimeToContact}
              onChange={(val) =>
                handleChange("contactInformation", "bestTimeToContact", val)
              }
            />
          </div>
        </div>
      </div>

      {/* Consent & Data Processing */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Consent & Data Processing
              </h2>
              <p className="text-indigo-100 mt-1 text-sm">
                Privacy and data handling agreements
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-200">
            <Checkbox
              label="
Consent to photography for care documentation"
              checked={formData.consent.photoConsent}
              onChange={(val) => handleChange("consent", "photoConsent", val)}
            />
            <Checkbox
              label="Consent to data processing for care provision (Required)"
              checked={formData.consent.dataProcessingConsent}
              onChange={(val) =>
                handleChange("consent", "dataProcessingConsent", val)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
