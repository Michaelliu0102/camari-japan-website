import { getCliClient } from "sanity/cli";

const client = getCliClient();

async function main() {
  const cat = await client.fetch<{ _id: string }>(
    `*[_type == "materialCategory" && slug.current == "italian-genuine-leather"][0]`
  );

  if (!cat) {
    console.error("Category not found");
    process.exit(1);
  }

  await client
    .patch(cat._id)
    .set({ slug: { _type: "slug", current: "leather" } })
    .commit();

  console.log(`Updated slug to "leather" for: ${cat._id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
