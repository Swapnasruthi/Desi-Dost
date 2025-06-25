# Desi Dost - Your AI Bro

Welcome to Desi Dost! This isn't just another chatbot. It's a hyper-personalized, culturally-aware AI companion designed to mimic the witty, slang-filled banter you'd have with a close friend from India.

The experience is tailored to you. You kickstart the conversation by uploading your resume and selecting your state. From that moment, the AI knows a bit about your professional life and hobbies and adjusts its language and slang to match your region, creating a conversation that's uniquely yours.

## Core Features

*   **Hyper-Personalization**: The AI uses details from your resume (profession, skills, hobbies) to make the conversation relevant and engaging.
*   **Dynamic Persona Adaptation**: The AI dynamically alters its linguistic style, using regional languages (in Roman script) and local slang based on the user's selected state (e.g., Marathi for Maharashtra, Telugu for Telangana).
*   **Creative AI Content Generation**: Features a specialized AI flow to generate witty, personalized "Shayaris" (rhyming couplets) in Hinglish based on the user's unique details.
*   **Intelligent Intent Routing**: The backend logic analyzes user prompts to detect intent and routes requests to different, specialized AI flows for the most relevant response.

## Tech Stack

*   **Framework**: Next.js 15 (with App Router)
*   **Language**: TypeScript
*   **AI Framework**: Google Genkit
*   **AI Model**: Google Gemini 1.5 Flash
*   **Backend Logic**: Next.js Server Actions
*   **UI**: React, ShadCN UI
*   **Styling**: Tailwind CSS
*   **Deployment**: Firebase App Hosting

## How to Run the Project Locally

1.  **Install Dependencies**:
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables**:
    Create a `.env` file in the project root. You will need to add your Google AI API key.
    ```env
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

3.  **Run the Development Servers**:
    This project requires two terminal windows running concurrently.

    *   **Terminal 1: Start the Genkit AI server:**
        ```bash
        npm run genkit:dev
        ```
        This starts the Genkit flows and makes them available for the app.

    *   **Terminal 2: Start the Next.js frontend:**
        ```bash
        npm run dev
        ```
        This will start the web application, usually on `http://localhost:9002`.

4.  **Open the App**:
    Open your browser and navigate to `http://localhost:9002` to start chatting with Desi Dost!
