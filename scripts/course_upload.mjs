// import_ucr_courses_v3.js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// -------------------------------------------------------
// 1. SUPABASE CLIENT
// -------------------------------------------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -------------------------------------------------------
// 2. LOAD RAW JSON
// -------------------------------------------------------
const raw = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src/data/ucr-courses.json"), "utf8")
);

// -------------------------------------------------------
// 3. PARSING HELPERS
// -------------------------------------------------------

function extractCredits(description) {
  if (!description) return 0;
  const match = description.match(/(\d+)\s+Unit/);
  return match ? parseInt(match[1], 10) : 0;
}

// Flatten → unique course codes
const flattenPrereqs = (tree) => {
  if (!tree) return [];
  if (tree.id) return [tree.id];
  if (tree.children) return tree.children.flatMap(flattenPrereqs);
  return [];
};

const flattenCoreqs = (tree) => {
  if (!tree) return [];
  if (tree.id && tree.isCoreq === true) return [tree.id];
  if (tree.children) return tree.children.flatMap(flattenCoreqs);
  return [];
};

// Default terms
// const DEFAULT_TERMS = ["Fall 2024", "Winter 2025", "Spring 2025"];

// -------------------------------------------------------
// 4. STEP 1: INSERT ALL COURSES WITHOUT PREREQS
// -------------------------------------------------------

async function insertBaseCourses() {
  console.log('total raw courses', { courses: Object.keys(raw)});
  const baseRows = Object.values(raw).map((c) => ({
    course_code: c.id,
    title: c.title ?? "",
    description: c.description ?? "",
    credits: extractCredits(c.description),
    // catalog_terms: DEFAULT_TERMS,
  }));

  console.log('total base rows', baseRows.length);

  const { data, error } = await supabase
    .from("courses")
    .upsert(baseRows, { onConflict: "course_code" })
    .select("id, course_code");

  if (error) {
    console.error("❌ Error inserting base courses:", error);
    process.exit(1);
  }

  console.log(`✅ Inserted ${baseRows.length} base courses`);

  // Build course_code → uuid map
  const map = {};
  for (const row of data) {
    map[row.course_code] = row.id;
  }

  return map;
}

// -------------------------------------------------------
// 5. STEP 2: UPDATE COURSE PREREQS + COREQS USING UUIDs
// -------------------------------------------------------

async function updateCourseRelations(codeToUuid) {
  let updateCount = 0;

  for (const rawCourse of Object.values(raw)) {
    const code = rawCourse.id;
    const uuid = codeToUuid[code];

    if (!uuid) continue; // Skip if course wasn't inserted

    const prereqCodes = flattenPrereqs(rawCourse.prerequisites);
    const coreqCodes = flattenCoreqs(rawCourse.prerequisites);

    const prereqUUIDs = prereqCodes
      .map((c) => codeToUuid[c])
      .filter(Boolean); // remove missing

    const coreqUUIDs = coreqCodes
      .map((c) => codeToUuid[c])
      .filter(Boolean);

    const { error } = await supabase
      .from("courses")
      .update({
        prereqs: prereqUUIDs,
        coreqs: coreqUUIDs,
      })
      .eq("id", uuid);

    if (error) {
      console.error(`❌ Error updating ${code}:`, error);
      process.exit(1);
    }

    updateCount++;
  }

  console.log(`✅ Updated ${updateCount} courses with relations`);
}

// -------------------------------------------------------
// 6. MAIN FLOW
// -------------------------------------------------------

async function run() {
  console.log("Inserting base courses...");
  const map = await insertBaseCourses();

  console.log("Updating prereqs and coreqs...");
  await updateCourseRelations(map);

  console.log("🎉 Import complete!");
}

run();
