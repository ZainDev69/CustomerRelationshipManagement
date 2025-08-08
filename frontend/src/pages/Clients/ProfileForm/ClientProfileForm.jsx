import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { checkClientId } from "../../../components/redux/slice/clients";
import { Button } from "../../../components/ui/Button";
import { PhotoUpload } from "./PhotoUpload";
import { PersonalFormTab } from "./PersonalFormTab";
import { HealthFormTab } from "./HealthFormTab";
import { MedicalFormTab } from "./MedicalFormTab";
import { PrefrencesFormTab } from "./PrefrencesFormTab";
import { FormTabs } from "./FormTabs";

export function ClientProfileForm({ client, onBack, onSave }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("personal");
  const isEditing = !!client;
  const [clientIdExists, setClientIdExists] = useState(false);
  const [checkingClientId, setCheckingClientId] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const toInputDate = (val) => (val ? val.slice(0, 10) : "");

  const [formData, setFormData] = useState({
    clientId: client?.clientId || "",
    personalDetails: {
      title: client?.personalDetails.title || "",
      fullName: client?.personalDetails.fullName || "",
      preferredName: client?.personalDetails.preferredName || "",
      dateOfBirth: toInputDate(client?.personalDetails.dateOfBirth),
      gender: client?.personalDetails.gender || "",
      nhsNumber: client?.personalDetails.nhsNumber || "",
      relationshipStatus: client?.personalDetails.relationshipStatus || "",
      ethnicity: client?.personalDetails.ethnicity || "",
      historyandBackground: client?.personalDetails.historyandBackground || "",
    },
    status: client?.status || "active",
    addressInformation: {
      address: client?.addressInformation.address || "",
      city: client?.addressInformation.city || "",
      county: client?.addressInformation.county || "",
      postCode: client?.addressInformation.postCode || "",
      country: client?.addressInformation.country || "United Kingdom",
      accessInstructions: client?.addressInformation.accessInstructions || "",
    },
    contactInformation: {
      primaryPhone: client?.contactInformation.primaryPhone || "",
      secondaryPhone: client?.contactInformation.secondaryPhone || "",
      email: client?.contactInformation.email || "",
      preferredContactMethod:
        client?.contactInformation.preferredContactMethod || "",
      bestTimeToContact: client?.contactInformation.bestTimeToContact || "",
    },
    consent: {
      photoConsent: client?.consent.photoConsent || false,
      dataProcessingConsent: client?.consent.dataProcessingConsent || false,
    },
    healthcareContacts: {
      gp: {
        id: client?.healthcareContacts?.gp?.id || "",
        name: client?.healthcareContacts?.gp?.name || "",
        role: "General Practitioner",
        organization: client?.healthcareContacts?.gp?.organization || "",
        phone: client?.healthcareContacts?.gp?.phone || "",
        email: client?.healthcareContacts?.gp?.email || "",
      },
      surgery: {
        name: client?.healthcareContacts?.surgery?.name || "",
        phone: client?.healthcareContacts?.surgery?.phone || "",
        email: client?.healthcareContacts?.surgery?.email || "",
        outOfHoursNumber:
          client?.healthcareContacts?.surgery?.outOfHoursNumber || "",
        address: client?.healthcareContacts?.surgery?.address || "",
      },
    },
    medicalInformation: {
      conditions: client?.medicalInformation?.conditions || [],
      allergies: client?.medicalInformation?.allergies || [],
      medications: client?.medicalInformation?.medications || [],
      mentalCapacity: {
        hasCapacity:
          client?.medicalInformation?.mentalCapacity?.hasCapacity || true,
        assessmentDate:
          client?.medicalInformation?.mentalCapacity?.assessmentDate || "",
        assessedBy:
          client?.medicalInformation?.mentalCapacity?.assessedBy || "",
        specificDecisions:
          client?.medicalInformation?.mentalCapacity?.specificDecisions || [],
        supportNeeds:
          client?.medicalInformation?.mentalCapacity?.supportNeeds || [],
        reviewDate:
          client?.medicalInformation?.mentalCapacity?.reviewDate || "",
        notes: client?.medicalInformation?.mentalCapacity?.notes || "",
      },
      dnr: {
        hasDNR: client?.medicalInformation?.dnr?.hasDNR || false,
        dateIssued: client?.medicalInformation?.dnr?.dateIssued || "",
        issuedBy: client?.medicalInformation?.dnr?.issuedBy || "",
        reviewDate: client?.medicalInformation?.dnr?.reviewDate || "",
        location: client?.medicalInformation?.dnr?.location || "",
        familyAware: client?.medicalInformation?.dnr?.familyAware || false,
        notes: client?.medicalInformation?.dnr?.notes || "",
      },
    },
    preferences: {
      cultural: {
        background: client?.preferences?.cultural?.background || "",
        languagePreferences: client?.preferences?.cultural
          ?.languagePreferences || ["English"],
        culturalNeeds: client?.preferences?.cultural?.culturalNeeds || [],
      },
      religious: {
        religion: client?.preferences?.religious?.religion || "",
        denomination: client?.preferences?.religious?.denomination || "",
        practiceLevel:
          client?.preferences?.religious?.practiceLevel || "non-practicing",
        prayerRequirements:
          client?.preferences?.religious?.prayerRequirements || "",
        spiritualSupport:
          client?.preferences?.religious?.spiritualSupport || false,
      },
      dietary: {
        dietType: client?.preferences?.dietary?.dietType || [],
        dislikes: client?.preferences?.dietary?.dislikes || [],
        preferences: client?.preferences?.dietary?.preferences || [],
        textureModification:
          client?.preferences?.dietary?.textureModification || false,
        fluidThickening: client?.preferences?.dietary?.fluidThickening || false,
        assistanceLevel:
          client?.preferences?.dietary?.assistanceLevel || "independent",
      },
      personal: {
        wakeUpTime: client?.preferences?.personal?.wakeUpTime || "",
        bedTime: client?.preferences?.personal?.bedTime || "",
        mobilityAids: client?.preferences?.personal?.mobilityAids || [],
        likesAndDislikes: client?.preferences?.personal?.likesAndDislikes || [],
        hobbies: client?.preferences?.personal?.hobbies || [],
      },
    },
  });

  // Real-time check for Client ID existence
  useEffect(() => {
    const id = formData.clientId;
    if (!id || isEditing) {
      setClientIdExists(false);
      setCheckingClientId(false);
      return;
    }

    setCheckingClientId(true);

    const timeoutId = setTimeout(() => {
      const checkId = async () => {
        try {
          const result = await dispatch(checkClientId(id)).unwrap();
          setClientIdExists(Array.isArray(result) && result.length > 0);
        } catch (error) {
          console.error("Error checking client ID:", error);
          setClientIdExists(false);
        } finally {
          setCheckingClientId(false);
        }
      };
      checkId();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.clientId, isEditing, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if client ID already exists (only for new clients)
    if (!isEditing && clientIdExists) {
      toast.error(
        "This Client ID already exists. Please choose a different one."
      );
      return;
    }

    // Check if client ID is empty
    if (!formData.clientId.trim()) {
      toast.error("Client ID is required.");
      return;
    }

    try {
      let photoUrl = formData.photo || "";
      if (photoFile) {
        const formDataImg = new FormData();
        formDataImg.append("photo", photoFile);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/clients/${
            client?._id || formData.clientId
          }/photo`,
          {
            method: "PATCH",
            body: formDataImg,
          }
        );
        const data = await res.json();
        if (data.data && data.data.photo) {
          photoUrl = data.data.photo;
        }
      }
      await onSave({ ...formData, photo: photoUrl });
    } catch (err) {
      // Display error using toast or similar
      if (err && err.message) {
        toast.error(
          Array.isArray(err.message)
            ? err.message.map((e) => e.msg || e).join(", ")
            : err.message
        );
      } else {
        toast.error("An error occurred while saving the client");
      }
    }
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Modern Header */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={onBack}
                className="group p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft className="w-6 h-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </button>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {isEditing ? "Edit Client Profile" : "Create New Client"}
                  </h1>
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  {isEditing
                    ? "Update comprehensive client information and care requirements"
                    : "Enter complete client details to begin their care journey"}
                </p>
              </div>
            </div>
          </div>
          {/* Modern Navigation Tabs */}
          <div className="mb-8">
            <FormTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Modern Form Container */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details */}
            {activeTab === "personal" && (
              <PersonalFormTab
                formData={formData}
                setFormData={setFormData}
                client={client}
                clientIdExists={clientIdExists}
                checkingClientId={checkingClientId}
                setPhotoFile={setPhotoFile}
              />
            )}
            {/* Healthcare Contacts Tab */}
            {activeTab === "healthcare" && (
              <HealthFormTab
                handleNestedChange={handleNestedChange}
                formData={formData}
              />
            )}

            {/* Medical Information Tab */}
            {activeTab === "medical" && (
              <MedicalFormTab formData={formData} setFormData={setFormData} />
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <PrefrencesFormTab
                formData={formData}
                handleNestedChange={handleNestedChange}
              />
            )}

            {/* Modern Form Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mt-8">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  All required fields marked with * must be completed
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={onBack}
                    className="group px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-md"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span>Cancel</span>
                  </button>

                  <Button
                    type="submit"
                    variant="default"
                    icon={Save}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    style={{ minWidth: 200 }}
                  >
                    {isEditing ? "Update Profile" : "Create Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
