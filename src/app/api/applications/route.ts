import { Applicant } from "@/app/lib/Applicant";
import { Application } from "@/app/lib/Application";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "jobs.json");
const jobApplications = JSON.parse(fs.readFileSync(filePath, "utf-8"));

interface OnboardingResult {
    matches: {
        id: number;
        employer: string;
        position: string;
        score: number;
    }[];
}

export async function POST(req: Request) {
    try {
        // Load job applications JSON file

        const applicant = (await req.json()) as Applicant;

        if (!applicant) {
            return Response.json({
                message: "Applicant data is required.",
                status: 400,
            });
        }

        const calculateScore = (applicant: Applicant, job: Application) => {
            let score = 0;

            // Soft skills matching
            const matchingSoftSkills = job.soft_skills.filter((skill) =>
                applicant.soft_skills.includes(skill)
            );
            score += matchingSoftSkills.length * 10;

            // Hard skills matching
            const matchingCodingSkills = job.hard_skills.coding.filter(
                (skill) => applicant.hard_skills.coding.includes(skill)
            );
            score += matchingCodingSkills.length * 15;

            const matchingTools = job.hard_skills.tools.filter((tool) =>
                applicant.hard_skills.tools.includes(tool)
            );
            score += matchingTools.length * 10;

            // Experience matching
            const experienceScore =
                Math.min(
                    (applicant.experience.coding / job.experience.coding) * 20,
                    20
                ) +
                Math.min(
                    (applicant.experience.project_management /
                        job.experience.project_management) *
                        20,
                    20
                ) +
                Math.min(
                    (applicant.experience.data_analysis /
                        job.experience.data_analysis) *
                        20,
                    20
                );
            score += experienceScore;

            // Education level matching
            const educationLevels = [
                "high_school",
                "associate",
                "bachelor",
                "master",
                "phd",
                "doctorate",
            ];
            const applicantLevelIndex = educationLevels.indexOf(
                applicant.education.level
            );
            const jobLevelIndex = educationLevels.indexOf(job.education.level);

            if (applicantLevelIndex >= jobLevelIndex) {
                score += 20;
            }

            // Return the final score
            return score;
        };

        const results: OnboardingResult["matches"] = jobApplications.map(
            (job: Application, index: number) => {
                const suitabilityScore = calculateScore(applicant, job);
                return {
                    id: index,
                    employer: job.employer,
                    position: job.position,
                    score: suitabilityScore,
                } as OnboardingResult["matches"][number];
            }
        );

        // Sort results by suitability score in descending order
        results.sort((a, b) => b.score - a.score);

        Response.json({ matches: results, status: 200 });
    } catch (error) {
        console.error(error);
        Response.json({
            status: 500,
            message: "An error occurred while processing the request.",
        });
    }
}
