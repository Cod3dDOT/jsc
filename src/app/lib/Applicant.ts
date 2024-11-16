export interface Applicant {
    name: string;

    soft_skills: string[];
    hard_skills: {
        coding: string[];
        tools: string[];
    };
    experience: {
        coding: number;
        project_management: number;
        data_analysis: number;
    };
    education: {
        level:
            | "high_school"
            | "associate"
            | "bachelor"
            | "master"
            | "phd"
            | "doctorate";
        status: "enrolled" | "graduated";
    };
    interests: string[];
    contact: {
        email: string;
        phone: string;
        linkedin: string;
        application: string;
    };
}
