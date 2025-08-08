// Main file of this Folder

import { 
  User, 
  Edit3, 
  MapPin, 
  Phone, 
  Shield, 
  Globe, 
  Heart, 
  UtensilsCrossed, 
  Clock,
  Calendar,
  Info,
  Mail
} from "lucide-react";
import { useState } from "react";
import { PersonalDetailsEditModal } from "./PersonalDetailsEditModal";
import { useDispatch } from "react-redux";
import { updateClient } from "../../../components/redux/slice/clients";
import toast from "react-hot-toast";
import { InfoBlock } from "../../../components/layout/InfoBlock";
import { Button } from "../../../components/ui/Button";

export function PersonalTab({ client, onClientUpdate }) {
  const [showPersonalEditModal, setShowPersonalEditModal] = useState(false);
  const [savingPersonalInfo, setSavingPersonalInfo] = useState(false);

  const dispatch = useDispatch();

  const handleEditPersonalInfo = () => {
    setShowPersonalEditModal(true);
  };

  const handleSavePersonalInfo = async (personalData) => {
    setSavingPersonalInfo(true);
    try {
      // Update the client's personal information
      const updatedClient = {
        ...client,
        personalDetails: personalData.personalDetails,
        addressInformation: personalData.addressInformation,
        contactInformation: personalData.contactInformation,
        preferences: personalData.preferences,
        consent: personalData.consent,
        startDate: personalData.startDate,
        reviewDate: personalData.reviewDate,
      };

      const result = await dispatch(
        updateClient({
          clientId: client._id,
          clientData: updatedClient,
        })
      ).unwrap();

      if (result && result.data && result.data.client) {
        toast.success("Personal information updated successfully");
        setShowPersonalEditModal(false);

        // Notify parent component about the update
        if (onClientUpdate) {
          onClientUpdate(result.data.client);
        }
      } else if (result) {
        // Fallback if the response structure is different
        toast.success("Personal information updated successfully");
        setShowPersonalEditModal(false);

        if (onClientUpdate) {
          onClientUpdate(result);
        }
      }
    } catch (error) {
      console.error("Error updating personal information:", error);
      toast.error("Failed to update personal information");
    } finally {
      setSavingPersonalInfo(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Modern Header with Edit Button */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Personal Details</h2>
                <p className="text-gray-600 mt-1">Complete personal and preference information</p>
              </div>
            </div>
            <Button
              onClick={handleEditPersonalInfo}
              icon={Edit3}
              variant="default"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Edit Personal Info
            </Button>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Basic Information</h3>
                  <p className="text-blue-100 mt-1">Essential personal details and background</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {/* History & Background - Full Width */}
              <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">History & Background</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {client.personalDetails?.historyandBackground || "No history or background information provided yet."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Details Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                          Field
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                          Information
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">Title</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {client.personalDetails?.title || "Not specified"}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">Full Name</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {client.personalDetails?.fullName || "Not specified"}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">Preferred Name</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {client.personalDetails?.preferredName || "Not specified"}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">Gender</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {client.personalDetails?.gender || "Not specified"}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">Date of Birth</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {client.personalDetails?.dateOfBirth
                              ? new Date(client.personalDetails.dateOfBirth).toLocaleDateString("en-GB")
                              : "Not specified"}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Heart className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">Marital Status</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {client.personalDetails?.relationshipStatus || "Not specified"}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Globe className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">Ethnicity</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {client.personalDetails?.ethnicity || "Not specified"}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">Start Date</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {client.startDate
                              ? new Date(client.startDate).toLocaleDateString("en-GB")
                              : "Not specified"}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Address Information */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Address & Access</h3>
                    <p className="text-green-100 mt-1">Location and access information</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Full Address</label>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-gray-800 leading-relaxed">
                      {client.addressInformation?.address || "Not provided"}
                      {client.addressInformation?.city && <><br />{client.addressInformation.city}</>}
                      {client.addressInformation?.postCode && <>, {client.addressInformation.postCode}</>}
                      {client.addressInformation?.country && <><br />{client.addressInformation.country}</>}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Access Instructions</label>
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-gray-800">
                      {client.addressInformation?.accessInstructions || "No special access instructions provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Preferences */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Contact Preferences</h3>
                    <p className="text-purple-100 mt-1">Communication preferences and details</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-200">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                            Contact Field
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Mail className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="text-sm font-semibold text-gray-900">Preferred Contact Method</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {client.contactInformation?.preferredContactMethod || "Not specified"}
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-50 transition-colors bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Clock className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="text-sm font-semibold text-gray-900">Best Time to Contact</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {client.contactInformation?.bestTimeToContact || "Not specified"}
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Phone className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="text-sm font-semibold text-gray-900">Secondary Phone</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {client.contactInformation?.secondaryPhone || "Not provided"}
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-50 transition-colors bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Phone className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="text-sm font-semibold text-gray-900">Primary Phone</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {client.contactInformation?.primaryPhone || "Not provided"}
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Mail className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="text-sm font-semibold text-gray-900">Email Address</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {client.contactInformation?.email || "Not provided"}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consent & Permissions */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Consent & Permissions</h3>
                  <p className="text-indigo-100 mt-1">Privacy and data handling permissions</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-indigo-900">Photo Consent</h4>
                      <p className="text-indigo-700 text-sm">Permission to take and use photos</p>
                    </div>
                    {client.consent?.photoConsent ? (
                      <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold">
                        Granted
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold">
                        Not Granted
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-900">Data Processing</h4>
                      <p className="text-blue-700 text-sm">Permission to process personal data</p>
                    </div>
                    {client.consent?.dataProcessingConsent ? (
                      <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold">
                        Granted
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold">
                        Not Granted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cultural Preferences */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Cultural Preferences</h3>
                    <p className="text-teal-100 mt-1">Cultural background and needs</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Cultural Background</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {client.preferences.cultural.background || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Languages</label>
                  {Array.isArray(client?.preferences?.cultural?.languagePreferences) && 
                   client.preferences.cultural.languagePreferences.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {client.preferences.cultural.languagePreferences.map((lang, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">Not specified</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cultural Needs</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {client.preferences.cultural.culturalNeeds || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Religious Preferences */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Religious Preferences</h3>
                    <p className="text-violet-100 mt-1">Spiritual beliefs and practices</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Religion</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.religious.religion || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Denomination</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.religious.denomination || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Practice Level</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.religious.practiceLevel || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Prayer Requirements</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.religious.prayerRequirements || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-violet-900">Requires Spiritual Support</span>
                    {client?.preferences?.religious?.spiritualSupport ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                        Yes
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                        No
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dietary & Personal Preferences */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Dietary Requirements */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <UtensilsCrossed className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Dietary Requirements</h3>
                    <p className="text-orange-100 mt-1">Food preferences and restrictions</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Diet Type</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.dietary.dietType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assistance Level</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.dietary.assistanceLevel || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Food Preferences</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.dietary.preferences || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Food Dislikes</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.dietary.dislikes || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-900">Texture Modification</span>
                      {client?.preferences.dietary.textureModification ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                          Required
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                          Not Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-900">Fluid Thickening</span>
                      {client?.preferences.dietary.fluidThickening ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                          Required
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                          Not Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Preferences */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Personal Preferences</h3>
                    <p className="text-pink-100 mt-1">Daily routines and personal interests</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-pink-50 rounded-xl border border-pink-200 text-center">
                    <Calendar className="w-5 h-5 text-pink-600 mx-auto mb-2" />
                    <label className="text-sm font-medium text-gray-500 block">Wake Up Time</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.personal.wakeUpTime || "Not set"}
                    </p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-center">
                    <Clock className="w-5 h-5 text-rose-600 mx-auto mb-2" />
                    <label className="text-sm font-medium text-gray-500 block">Bed Time</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.personal.bedTime || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hobbies & Interests</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.personal.hobbies || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobility Aids</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.personal.mobilityAids || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Likes & Dislikes</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {client.preferences.personal.likesAndDislikes || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details Edit Modal */}
      {showPersonalEditModal && (
        <PersonalDetailsEditModal
          isOpen={showPersonalEditModal}
          onClose={() => setShowPersonalEditModal(false)}
          personalDetails={{
            ...client.personalDetails,
            startDate: client.startDate,
            reviewDate: client.reviewDate,
          }}
          addressInformation={client.addressInformation}
          contactInformation={client.contactInformation}
          preferences={client.preferences}
          consent={client.consent}
          onSave={handleSavePersonalInfo}
          isLoading={savingPersonalInfo}
        />
      )}
    </div>
  );
}
