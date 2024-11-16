import { Applicant } from "./Applicant";

export interface Application {
    id: 5;
    employer: string;
    position: string;
    soft_skills: string[];
    experience: {
        coding: number;
        project_management: number;
        data_analysis: number;
    };
    hard_skills: {
        coding: string[];
        tools: string[];
    };
    education: Applicant["education"];
    contact: {
        email: string[];
        phone: string;
        linkedin: string;
        application: string;
    };
}
