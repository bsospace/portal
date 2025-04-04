import React from "react";

export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4 text-gray-700">
            At <strong>BSO Portal</strong>, we value your privacy. This policy explains what data we collect, how we use it, and how we protect it.
        </p>

        <h2 className="text-2xl font-semibold mb-4 mt-8">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
            <li>Portal content you create (username, portal name, and links).</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Data</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
            <li>We store portal data to display your links via your unique slug.</li>
            <li>Private portals use a key-based access method for limited visibility.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
        <p className="text-gray-700 mb-6">
            We do not share your data with any third parties. Your portals are only accessible through the links you share.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
        <p className="text-gray-700 mb-6">
            Your portals will be stored for a minimum of <strong>90 days</strong> in accordance with Thailand’s Personal Data Protection Act (PDPA). After this period, content may be subject to cleanup unless actively maintained. You may request removal at any time, and we will delete your content from our database upon verification.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Changes to This Policy</h2>
        <p className="text-gray-700 mb-6">
            We may update this Privacy Policy as needed. Any changes will be posted on this page.
        </p>

        <p className="text-gray-700">
            If you have questions or concerns about this policy, please contact us at{" "}
            <a href="mailto:contact@bsospace.com" className="underline text-blue-600">
            contact@bsospace.com
            </a>.
        </p>
        </main>
    );
}
