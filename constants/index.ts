export const GenderOptions = ["Homem", "Mulher", "Praga_pj"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Homem" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Carteira de Identidade Nacional (CIN ou RG)",
  "Carteira Nacional de Habilitação (CNH)",
  "Cadastro de Pessoas Físicas (CPF)",
  "Comprovante de Seguro de Saúde",
  "Carteira de Identidade Militar",
  "Certidão de Nascimento",
  "Carteira de Trabalho e Previdência Social (CTPS)",
];

export const Doctors = [
  {
    image: "/assets/images/dr-hknight.png",
    name: "Raimundo Neto",
  },
  {
    image: "/assets/images/dr-gatinho.png",
    name: "Gatinho Bunitinho",
  },
  {
    image: "/assets/images/dr-pombo.png",
    name: "Pombo da Silva",
  },
  {
    image: "/assets/images/dr-pochita.png",
    name: "Pochita Ferreira",
  },
  {
    image: "/assets/images/dr-cyrus.png",
    name: "Miliciana Cyrus",
  },
  {
    image: "/assets/images/dr-mae.png",
    name: "Mae Pereira",
  },
  {
    image: "/assets/images/dr-laranjo.png",
    name: "Gatinho Laranjo",
  },
];

export const StatusIcon = {
  agendado: "/assets/icons/check.svg",
  pendente: "/assets/icons/pending.svg",
  cancelado: "/assets/icons/cancelled.svg",
};