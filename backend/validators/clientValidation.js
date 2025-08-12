// Using Zod

const { z } = require("zod");

// Helpers
const stringOpt = z.string().optional();
const boolOpt = z.boolean().optional();
const dateOpt = z.coerce.date().optional();
const stringArrayOpt = z.array(z.string()).optional();


// Personal Details
const personalDetailsSchema = z.object({
    title: stringOpt,
    fullName: z.string().min(4, "Full name is required"),
    preferredName: stringOpt,
    dateOfBirth: z.coerce.date({ required_error: "Date of birth is required" }),
    gender: stringOpt,
    nhsNumber: z.coerce.number().optional(),
    relationshipStatus: stringOpt,
    ethnicity: stringOpt,
    historyandBackground: stringOpt,
});

// Address Info
const addressInformationSchema = z.object({
    address: z.string().min(1, "Address is required"),
    city: stringOpt,
    county: stringOpt,
    postCode: stringOpt,
    country: z.string().default("United Kingdom"),
    accessInstructions: stringOpt,
});

// Contact Info
const contactInformationSchema = z.object({
    primaryPhone: stringOpt,
    secondaryPhone: stringOpt,
    email: z.string().email("Invalid email").optional(),
    preferredContactMethod: stringOpt,
    bestTimeToContact: stringOpt,
});

// Consent
const consentSchema = z.object({
    photoConsent: boolOpt,
    dataProcessingConsent: boolOpt,
});

// Healthcare Contacts
const healthcareContactsSchema = z.object({
    gp: z.object({
        id: stringOpt,
        name: stringOpt,
        role: stringOpt,
        organization: stringOpt,
        phone: stringOpt,
        email: stringOpt,
    }).optional(),
    surgery: z.object({
        name: stringOpt,
        phone: stringOpt,
        email: stringOpt,
        outOfHoursNumber: stringOpt,
        address: stringOpt,
    }).optional(),
});

// Medical Information
const medicalInformationSchema = z.object({
    conditions: z.array(z.object({
        id: stringOpt,
        condition: stringOpt,
        diagnosisDate: stringOpt,
        severity: stringOpt,
        status: stringOpt,
        notes: stringOpt,
    })).optional(),
    allergies: z.array(z.object({
        id: stringOpt,
        allergen: stringOpt,
        reaction: stringOpt,
        severity: stringOpt,
        treatment: stringOpt,
        notes: stringOpt,
    })).optional(),
    medications: z.array(z.object({
        id: stringOpt,
        name: stringOpt,
        dosage: stringOpt,
        frequency: stringOpt,
        route: stringOpt,
        prescribedBy: stringOpt,
        startDate: stringOpt,
        indication: stringOpt,
        status: stringOpt,
    })).optional(),
    mentalCapacity: z.object({
        hasCapacity: boolOpt,
        assessmentDate: stringOpt,
        assessedBy: stringOpt,
        specificDecisions: stringArrayOpt,
        supportNeeds: stringArrayOpt,
        reviewDate: stringOpt,
        notes: stringOpt,
    }).optional(),
    dnr: z.object({
        hasDNR: boolOpt,
        dateIssued: stringOpt,
        issuedBy: stringOpt,
        reviewDate: stringOpt,
        location: stringOpt,
        familyAware: boolOpt,
        notes: stringOpt,
    }).optional(),
});

// Preferences
const preferencesSchema = z.object({
    cultural: z.object({
        background: stringOpt,
        languagePreferences: stringArrayOpt,
        culturalNeeds: stringArrayOpt,
    }).optional(),
    religious: z.object({
        religion: stringOpt,
        denomination: stringOpt,
        practiceLevel: stringOpt,
        prayerRequirements: stringOpt,
        spiritualSupport: boolOpt,
    }).optional(),
    dietary: z.object({
        dietType: stringArrayOpt,
        dislikes: stringArrayOpt,
        preferences: stringArrayOpt,
        textureModification: boolOpt,
        fluidThickening: boolOpt,
        assistanceLevel: stringOpt,
    }).optional(),
    personal: z.object({
        wakeUpTime: stringOpt,
        bedTime: stringOpt,
        mobilityAids: stringArrayOpt,
        likesAndDislikes: stringArrayOpt,
        hobbies: stringArrayOpt,
    }).optional(),
});

// Main Schema
const clientValidationSchema = z.object({
    ClientID: z.string().min(3, "ClientID must be at least 3 characters"),
    startDate: dateOpt,
    reviewDate: dateOpt,
    personalDetails: personalDetailsSchema,
    status: stringOpt,
    addressInformation: addressInformationSchema,
    contactInformation: contactInformationSchema,
    consent: consentSchema.optional(),
    healthcareContacts: healthcareContactsSchema.optional(),
    medicalInformation: medicalInformationSchema.optional(),
    preferences: preferencesSchema.optional(),
    Archived: boolOpt,
    photo: stringOpt,
});

const clientPartialValidation = clientValidation.partial();
module.exports = { clientValidationSchema, clientPartialValidation };

