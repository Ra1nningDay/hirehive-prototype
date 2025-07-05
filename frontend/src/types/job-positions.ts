export interface JobPosition {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  description: string[];
}

export const jobPositions: JobPosition[] = [
  {
    id: "corporate-strategy",
    title: "CORPORATE STRATEGY OFFICER",
    subtitle: "FINANCIAL INDUSTRY",
    color: "bg-[#5c4394]",
    description: [
      "Plan and define project strategies to align with the organization's goals and objectives.",
      "Manage project resources, personnel, timelines, and budget effectively.",
      "Oversee project implementation to ensure tasks are completed as planned.",
      "Monitor and evaluate project progress, and prepare regular reports for management.",
      "Identify and manage project risks, and implement solutions to resolve issues.",
      "Coordinate and communicate with cross-functional teams and stakeholders.",
      "Organize meetings and present project updates both internally and externally.",
      "Close projects with final reports and provide recommendations for future improvements.",
    ],
  },
  {
    id: "detail-strategy",
    title: "DETAIL STRATEGY & SPACE ANALYST",
    subtitle: "RETAIL INDUSTRY",
    color: "bg-[#f28b1b]",
    description: [
      "Analyze market trends and customer behavior patterns.",
      "Develop strategic plans for retail space optimization.",
      "Create detailed reports on space utilization and performance metrics.",
      "Collaborate with design teams to optimize store layouts.",
      "Monitor competitor strategies and market positioning.",
      "Provide data-driven recommendations for business growth.",
      "Support decision-making with comprehensive market analysis.",
    ],
  },
  {
    id: "service-engineer",
    title: "SERVICE ENGINEER",
    subtitle: "AUTOMOTIVE INDUSTRY",
    color: "bg-[#5c4394]",
    description: [
      "Provide technical support and maintenance services for automotive systems.",
      "Diagnose and troubleshoot complex technical issues.",
      "Develop and implement service protocols and procedures.",
      "Train technical staff on new technologies and procedures.",
      "Maintain relationships with clients and provide exceptional service.",
      "Document service activities and create technical reports.",
      "Ensure compliance with industry standards and regulations.",
    ],
  },
  {
    id: "data-analyst",
    title: "DATA ANALYST",
    subtitle: "LOGISTIC INDUSTRY",
    color: "bg-[#f28b1b]",
    description: [
      "Analyze logistics data to identify trends and optimization opportunities.",
      "Create dashboards and reports for supply chain performance.",
      "Develop predictive models for demand forecasting.",
      "Collaborate with operations teams to improve efficiency.",
      "Monitor KPIs and provide actionable insights.",
      "Support data-driven decision making across the organization.",
      "Maintain data quality and integrity standards.",
    ],
  },
  {
    id: "project-management",
    title: "PROJECT MANAGEMENT",
    subtitle: "HEALTHCARE INDUSTRY",
    color: "bg-[#5c4394]",
    description: [
      "Plan and define project strategies to align with the organization's goals and objectives.",
      "Manage project resources, personnel, timelines, and budget effectively.",
      "Oversee project implementation to ensure tasks are completed as planned.",
      "Monitor and evaluate project progress, and prepare regular reports for management.",
      "Identify and manage project risks, and implement solutions to resolve issues.",
      "Coordinate and communicate with cross-functional teams and stakeholders.",
      "Organize meetings and present project updates both internally and externally.",
      "Close projects with final reports and provide recommendations for future improvements.",
    ],
  },
  {
    id: "school-nanny",
    title: "SCHOOL NANNY",
    subtitle: "INTERNATIONAL SCHOOL",
    color: "bg-[#f28b1b]",
    description: [
      "Provide childcare and supervision for school-age children.",
      "Assist with homework and educational activities.",
      "Ensure children's safety and well-being at all times.",
      "Communicate regularly with parents about children's progress.",
      "Organize recreational and educational activities.",
      "Support children's social and emotional development.",
      "Maintain a safe and nurturing environment.",
    ],
  },
];

export const getJobPositionById = (id: string): JobPosition | undefined => {
  return jobPositions.find((job) => job.id === id);
};
