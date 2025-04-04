import React from "react";

export default function AboutPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">About BSO Portal</h1>

        <p className="mb-4 text-gray-700">
            <strong>BSO Portal</strong> is a lightweight link-sharing tool designed for simplicity and speed. Whether you're organizing personal tools, curating resources for a team, or showcasing your projects — BSO Portal helps you build a shareable page in seconds.
        </p>

        <p className="mb-8 text-gray-700">No sign-ups, no complications — just you and your portal.</p>

        <h2 className="text-2xl font-semibold mb-4">🔗 What Can You Do?</h2>
        <ul className="list-disc list-inside mb-8 text-gray-700 space-y-2">
            <li>Create a <strong>custom portal</strong> using a unique URL like <code>/username/portalname</code></li>
            <li>Add and manage <strong>links</strong> with titles, descriptions, and icons</li>
            <li>Make your portal <strong>public</strong> or <strong>private</strong> with a secret access key</li>
            <li>Share your personalized space easily with friends, teams, or online</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">💡 Use Case Examples</h2>
        <ul className="mb-8 text-gray-700 space-y-2">
            <li><code>/smart/home</code> – Your personal dashboard of useful links</li>
            <li><code>/studio/designkit</code> – A public kit of design resources</li>
            <li><code>/team/notes?key=abc123</code> – A private portal for internal team notes</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">⚙️ Tech Stack</h2>
        <ul className="mb-8 text-gray-700 space-y-2 list-disc list-inside">
            <li><strong>Frontend</strong>: React.js + Vite</li>
            <li><strong>Backend</strong>: Express.js (Node.js)</li>
            <li><strong>Database</strong>: MongoDB</li>
            <li><strong>Hosting</strong>: Docker-ready</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">📂 Open Source</h2>
        <p className="mb-8 text-gray-700">
            BSO Portal is open-source and maintained by the BSO Space community. Feel free to explore the code, report issues, or contribute on{" "}
            <a
            href="https://github.com/bsospace"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
            >
            GitHub
            </a>.
        </p>

        <p className="text-gray-700">
            BSO Portal is a project from the <strong>BSO Space</strong> community — built to <em>be simple but outstanding</em>.
        </p>
        </main>
    );
}
