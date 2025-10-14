Project Documentation: The Configurable Incident Assistant
1. Project Overview
The Configurable Incident Assistant is a comprehensive, single-file, zero-dependency web application designed to streamline and standardize the entire incident management lifecycle. It operates entirely within the browser, requiring no backend or build process.
Its primary goal is to help individuals and teams respond to incidents faster, maintain consistent communication, and create detailed records for post-mortem analysis and reporting, all while being highly adaptable to any organization's specific terminology and workflow.

2. Core Features
The application is built around a guided wizard and a powerful configuration system.
User-Facing Features
5-Step Guided Wizard
Walks the user through every stage of an incident, from initial report to post-mortem analysis.
Live Preview Panel
A real-time preview of communication templates updates as you fill out the form, providing immediate feedback.
Audience-Specific Templates
Generates distinct, tailored communications for Internal, Customer, and Executive audiences.
Post-Mortem Generation
Step 5 is dedicated to capturing detailed root cause analysis, resolution steps, and lessons learned for a complete post-mortem report.
Professional HTML Report Export
Generates a clean, styled, and theme-aware HTML report in a new tab. This report dynamically includes the communication log and post-mortem details if they exist, and it can be easily printed or saved as a PDF.
Incident History & Communication Log

Automatically saves every incident and its communication events to local storage
The "History" modal allows you to review past incidents, expand them to see a detailed log of every message sent, and load any incident's data back into the form to create an update

Advanced Configuration Features (via ⚙️ Configure Modal)
General Settings

Time Zone: Set a preferred time zone for all timestamps in the application
Import/Export Configuration: Export the entire application setup (categories, severity, etc.) to a JSON file to share with your team, or import a file to ensure a consistent setup

Category Management

Fully Customizable: Enable or disable entire incident categories or individual incident types (sub-categories) to tailor the dropdowns to your specific business needs
Industry Profiles: One-click buttons to apply pre-configured setups for "Tech/SaaS" or "General Business"

Customizable Severity Levels

Rename Acronyms: Change the default "S0," "S1," etc., to your company's terminology, like "P0," "P1" (for Priority)
Edit Descriptions: Customize the names, descriptions, and SLA response times for each level

Personnel & Snippets

Personnel: Pre-define roles and names (like "Incident Commander") to populate autocomplete fields
Snippets: Create custom placeholders (e.g., {{status_page}}) that are automatically replaced in all generated templates for maximum consistency


3. Typical User Workflow
Here is a step-by-step guide on how to use the tool during an incident:
One-Time Setup

Click ⚙️ Configure
In the Categories tab, apply an industry profile or manually toggle the categories/types relevant to your business
In the Severity tab, rename acronyms and adjust descriptions to match your company's policies
In the General, Personnel, and Snippets tabs, fill in your time zone and other presets
Click Save Configuration - your setup is now saved in your browser

An Incident Begins

Open the application
Step 1: Fill out the basic info. The "Incident ID" can be auto-generated
Step 2: Write a clear "Impact Summary." Use the Smart Suggestion feature by selecting an "Incident Type" first. Add the first timeline entry (e.g., "Initial alert received")
Step 3: Select the target audiences for your first communication (e.g., Internal)

Sending the First Communication

Step 4: Review all details for accuracy
Click ✓ Generate Comms
The output section appears. Use the "Copy" buttons to get the templates and paste them into Slack, email, etc.
The incident is now automatically saved to the history

During the Incident (Sending an Update)

Click the 📜 History button in the header
Find the current incident and expand it
Click the 📝 Create Update button
The page reloads with all the incident data
Update the "Current Status" and add new "Timeline" entries
Repeat the process from Step 3 to generate and log the update communication

After the Incident is Resolved

After sending the "Resolved" communication, click the 📄 Go to Post-Mortem button in the output section
Step 5: You are taken to the Post-Mortem section. Fill in the detailed analysis
Click 📄 Generate Post-Mortem to create a text-based version

Final Reporting

At the bottom of the wizard, the 🖨️ Generate Report button is now visible
Click it to open a professionally styled HTML report in a new tab
This report includes everything: summary, timeline, the full communication log, and the post-mortem analysis
Use your browser's Print function (Ctrl/Cmd + P) to save this report as a PDF


4. Technical Architecture
Stack
A single, self-contained index.html file using pure HTML, CSS, and modern JavaScript (ES6). It has zero dependencies, meaning it runs in any modern browser without needing an internet connection or any setup.
Data Storage
The application cleverly uses the browser's built-in storage mechanisms:
localStorage
Used for data that needs to persist indefinitely:

bita-config: Stores the entire application configuration
bita-incident-history: Stores the array of all past incidents
bita-theme: Stores the user's light/dark mode preference

sessionStorage
Used for temporary data:

bita-progress: Stores the data of the current, in-progress incident form. This data is cleared when the browser tab is closed, preventing stale data on the next visit
