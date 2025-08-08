import {
  Heart,
  Shield,
  Users,
  Calendar,
  Mail,
  Phone,
  Plus,
  Clock,
  MessageSquare,
  Edit3,
  Trash,
  Bell,
  Home,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContactForm } from "./ContactForm";
import { formatOptionLabel } from "../../../utils/formatOptionLabel";
import {
  addContact,
  editContact,
  deleteContact,
  fetchContactOptions,
} from "../../../components/redux/slice/contacts";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/Button";

export function ContactTab({ client }) {
  const [contactFilter, setContactFilter] = useState("all");
  const [contactView, setContactView] = useState("list");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.items) || [];

  const { contactOptions, contactOptionsLoading } = useSelector(
    (state) => state.contacts
  );

  useEffect(() => {
    dispatch(fetchContactOptions());
  }, [dispatch]);

  const contactTypeIconMap = {
    family: { icon: Heart, bg: "bg-red-100", text: "text-red-600" },
    friend: { icon: Users, bg: "bg-blue-100", text: "text-blue-600" },
    neighbor: { icon: Home, bg: "bg-green-100", text: "text-green-600" },
    other: { icon: User, bg: "bg-gray-100", text: "text-gray-600" },
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contactFilter === "all" || contact.contactType === contactFilter
  );

  const getContactTypeIconStyles = (type) => {
    return contactTypeIconMap[type] || contactTypeIconMap["other"];
  };

  const contactStats = {
    total: contacts.length,
    family: contacts.filter((c) => c.contactType === "family").length,
    friends: contacts.filter((c) => c.contactType === "friend").length,
    neighbors: contacts.filter((c) => c.contactType === "neighbor").length,
    regularVisitors: contacts.filter((c) => c.isRegularVisitor).length,
    keyHolders: contacts.filter((c) => c.hasKeyAccess).length,
    decisionMakers: contacts.filter((c) => c.canMakeDecisions).length,
    canReceiveUpdates: contacts.filter((c) => c.canReceiveUpdates).length,
    hasConsent: contacts.filter((c) => c.consentToContact).length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "no-contact":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const handleAddContact = () => {
    setSelectedContact(null);
    setContactView("form");
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setContactView("form");
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (contactData._id) {
        await dispatch(
          editContact({
            clientId: client._id,
            contactId: contactData._id,
            contactData,
          })
        ).unwrap();
        toast.success("Contact updated successfully");
      } else {
        await dispatch(
          addContact({
            clientId: client._id,
            contactData,
          })
        ).unwrap();
        toast.success("Contact added successfully");
      }
      setContactView("list");
      setSelectedContact(null);
    } catch {
      toast.error("Something went wrong while saving the contact");
    }
  };

  const handleDeleteContact = (contactId) => {
    setContactToDelete(contactId);
    setShowDeleteModal(true);
  };

  const confirmDeleteContact = async () => {
    try {
      await dispatch(
        deleteContact({ clientId: client._id, contactId: contactToDelete })
      ).unwrap();
      toast.success("Contact deleted");
    } catch {
      toast.error("Failed to delete contact");
    } finally {
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const cancelDeleteContact = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const handleBackToContactList = () => {
    setContactView("list");
    setSelectedContact(null);
  };

  if (contactView === "form") {
    return (
      <ContactForm
        contact={selectedContact}
        onBack={handleBackToContactList}
        onSave={handleSaveContact}
      />
    );
  }

  const DeleteContactModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Contact?
        </h2>
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this contact? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-2">
          <Button onClick={cancelDeleteContact} variant="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteContact} variant="destructive">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
  return (
    <div className="space-y-6">
      {/* Contact Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-blue-900">
                {contactStats.total}
              </p>
              <p className="text-xs text-blue-700 font-medium">Total</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-red-900">
                {contactStats.family}
              </p>
              <p className="text-xs text-red-700 font-medium">Family</p>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-900">
                {contactStats.friends}
              </p>
              <p className="text-xs text-green-700 font-medium">Friends</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-purple-900">
                {contactStats.canReceiveUpdates}
              </p>
              <p className="text-xs text-purple-700 font-medium">Updates</p>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-amber-900">
                {contactStats.hasConsent}
              </p>
              <p className="text-xs text-amber-700 font-medium">Consent</p>
            </div>
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Family & Friends Contacts
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and connect with client contacts
              </p>
            </div>
            <Button
              onClick={handleAddContact}
              icon={Plus}
              variant="default"
              style={{ minWidth: 180 }}
            >
              Add Contact
            </Button>
          </div>
          <div className="mb-6" />
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={contactFilter}
                disabled={contactOptionsLoading}
                onChange={(e) => setContactFilter(e.target.value)}
                className="w-full pl-11 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Filter</option>
                {contactOptions.types?.map((t) => (
                  <option key={t} value={t}>
                    {formatOptionLabel(t)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contacts Clinical Table */}
        <div className="p-8">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Type & Relationship
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact, idx) => {
                    const {
                      icon: ContactTypeIcon,
                      bg,
                      text,
                    } = getContactTypeIconStyles(contact.contactType);

                    return (
                      <tr
                        key={contact._id}
                        className={`hover:bg-blue-50 transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${bg}`}>
                              <ContactTypeIcon className={`w-4 h-4 ${text}`} />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {contact.name}
                              </div>
                              {contact.lastContactDate && (
                                <div className="text-xs text-gray-500">
                                  Last:{" "}
                                  {new Date(
                                    contact.lastContactDate
                                  ).toLocaleDateString("en-GB")}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">
                              {contact.contactType.charAt(0).toUpperCase() +
                                contact.contactType.slice(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {contact.relationship || "Not specified"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 space-y-1">
                            {contact.phone && (
                              <div className="flex items-center text-xs">
                                <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                {contact.phone}
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center text-xs">
                                <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                {contact.email}
                              </div>
                            )}
                            {!contact.phone && !contact.email && (
                              <span className="text-xs text-gray-400">
                                No contact info
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1 grid grid-cols-1 gap-2">
                            {contact.canMakeDecisions && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Decision Maker
                              </span>
                            )}
                            {contact.hasKeyAccess && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                                Key Holder
                              </span>
                            )}
                            {contact.canReceiveUpdates && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                <Bell className="w-3 h-3 mr-1" />
                                Updates
                              </span>
                            )}
                            {contact.isRegularVisitor && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                <Calendar className="w-3 h-3 mr-1" />
                                Regular
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(
                                contact.status
                              )}`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  contact.status === "active"
                                    ? "bg-green-400"
                                    : contact.status === "inactive"
                                    ? "bg-gray-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                              {contact.status || "Unknown"}
                            </span>
                            {contact.consentToContact && (
                              <div className="flex items-center justify-center text-xs text-green-600">
                                <span>
                                  {" "}
                                  <Shield className="w-3 h-3 mr-1" />
                                </span>
                                <span>Consent Given</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditContact(contact)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                              title="Edit Contact"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setContactToDelete(contact);
                                setShowDeleteModal(true);
                              }}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                              title="Delete Contact"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Contacts Found
                </h4>
                <p className="text-gray-600">
                  {contactFilter === "all"
                    ? "No contacts have been added yet."
                    : `No ${contactFilter} contacts found.`}
                </p>
                <Button
                  onClick={handleAddContact}
                  icon={Plus}
                  variant="default"
                  className="mt-4"
                >
                  Add First Contact
                </Button>
              </div>
            )}

            {/* Contacts Summary Footer */}
            {filteredContacts.length > 0 && (
              <div className="bg-blue-50 border-t border-blue-200 px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-green-800 font-medium">
                        {
                          filteredContacts.filter((c) => c.status === "active")
                            .length
                        }{" "}
                        Active
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                      <span className="text-indigo-800 font-medium">
                        {
                          filteredContacts.filter((c) => c.canMakeDecisions)
                            .length
                        }{" "}
                        Decision Makers
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-800 font-medium">
                        {filteredContacts.filter((c) => c.hasKeyAccess).length}{" "}
                        Key Holders
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-600 font-medium">
                    {contactFilter === "all"
                      ? "Total"
                      : `${
                          contactFilter.charAt(0).toUpperCase() +
                          contactFilter.slice(1)
                        }`}
                    : {filteredContacts.length} contacts
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteModal && <DeleteContactModal />}
    </div>
  );
}
