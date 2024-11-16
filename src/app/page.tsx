import React, { useState } from "react";
//education level, enrolled, experience, skills
export default function Home() {
    // State to store user's input
    const [education, setEducation] = useState("");
    const [enrolled, setEnrolled] = useState("");
    const [yearsExperience, setExperience] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState("");
    const [response, setResponse] = useState<string | null>(null); // To store the AI response
    const [loading, setLoading] = useState(false); // To show loading state

    // Handle education level change
    const handleEducationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setEducation(event.target.value);
    };

    // Handle name input change
    const handleEnrolledChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setEnrolled(event.target.value);
    };
    // Handle years of experience change
    const handleExperienceChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setExperience(event.target.value);
    };
    const handleSkillsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewSkill(event.target.value);
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!enrolled || !education || !skills) {
            alert("Please fill in all of the fields.");
            return;
        }
        const skillsArray = newSkill
            .split(",")
            .map((skill) => skill.trim()) // Remove leading/trailing spaces
            .filter((skill) => skill !== ""); // Remove empty skills
        setSkills(skillsArray); // Set the skills array as state
        setNewSkill(""); // Clear the input field

        // Set loading state while waiting for the response
        setLoading(true);

        try {
            // Send the form data to the AI API
            const response = await fetch("___", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    education,
                    enrolled,
                    yearsExperience,
                    newSkill,
                }),
            });

            // Check if the response is ok (status 200-299)
            if (!response.ok) {
                throw new Error("Failed to fetch data from AI");
            }

            // Parse the AI response
            const data = await response.json();
            setResponse(data.message); // Assuming the AI response contains a "message" field
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error while submitting the data.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            <h1>Personal Details</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Choose your highest level of education:
                    <select value={education} onChange={handleEducationChange}>
                        <option value="">Select an option</option>
                        <option value="High School">High School</option>
                        <option value="Associate Degree">
                            Associate Degree
                        </option>
                        <option value="Bachelor's Degree">
                            Bachelor's Degree
                        </option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate">Doctorate</option>
                    </select>
                </label>
                <br />
                <label>
                    Choose your academic standing:
                    <select value={enrolled} onChange={handleEnrolledChange}>
                        <option value="">Select an option</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Graduated">Graduated</option>
                    </select>
                </label>
                <br />
                <label>
                    Enter your years of applicable experience:
                    <input
                        type="text"
                        value={yearsExperience}
                        onChange={handleExperienceChange}
                    />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            {response && (
                <div>
                    <h3>AI Response:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}
