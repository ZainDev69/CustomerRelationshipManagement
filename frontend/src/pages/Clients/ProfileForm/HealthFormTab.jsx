import { Heart } from "lucide-react";
import { Input } from "../../../components/ui/Input";

export function HealthFormTab({ formData, handleNestedChange }) {
  return (
    <div className="space-y-8">
      {/* GP Information */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">General Practitioner</h2>
              <p className="text-blue-100 mt-1 text-sm">Primary healthcare provider information</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="GP Name"
            value={formData.healthcareContacts.gp.name}
            onChange={(value) =>
              handleNestedChange(
                "healthcareContacts",
                "gp",
                "name",
                value
              )
            }
          />
          <Input
            label="Surgery Name"
            value={formData.healthcareContacts.surgery.name}
            onChange={(value) =>
              handleNestedChange(
                "healthcareContacts",
                "surgery",
                "name",
                value
              )
            }
          />
          <Input
            label="Phone"
            type="tel"
            value={formData.healthcareContacts.gp.phone}
            onChange={(value) =>
              handleNestedChange(
                "healthcareContacts",
                "gp",
                "phone",
                value
              )
            }
          />
          <Input
            label="Email"
            type="email"
            value={formData.healthcareContacts.gp.email}
            onChange={(value) =>
              handleNestedChange(
                "healthcareContacts",
                "gp",
                "email",
                value
              )
            }
          />
          </div>
        </div>
      </div>

      {/* Surgery Information */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Surgery Information</h2>
              <p className="text-emerald-100 mt-1 text-sm">Medical practice and facility details</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Surgery Phone"
            type="tel"
            value={formData.healthcareContacts.surgery.phone}
            onChange={(value) =>
              handleNestedChange(
                "healthcareContacts",
                "surgery",
                "phone",
                value
              )
            }
          />
          <Input
            label="Out of Hours Number"
            type="tel"
            value={formData.healthcareContacts.surgery.outOfHoursNumber}
            onChange={(value) =>
              handleNestedChange(
                "healthcareContacts",
                "surgery",
                "outOfHoursNumber",
                value
              )
            }
          />
          <Input
            label="Surgery Address"
            full
            value={formData.healthcareContacts.surgery.address}
            onChange={(value) =>
              handleNestedChange(
                "healthcareContacts",
                "surgery",
                "address",
                value
              )
            }
          />
          </div>
        </div>
      </div>
    </div>
  );
}
