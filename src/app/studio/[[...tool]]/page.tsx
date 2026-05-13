import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  if (!projectId || projectId === "replace-me") {
    return (
      <main style={{ padding: 48, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
        <h1>Sanity project is not configured</h1>
        <p>
          Add your Sanity project ID to <code>.env.local</code>, then restart the dev server.
        </p>
        <pre style={{ background: "#f6f6f6", padding: 16, overflowX: "auto" }}>
          NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id{"\n"}
          NEXT_PUBLIC_SANITY_DATASET=production
        </pre>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
