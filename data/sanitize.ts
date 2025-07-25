import type { Question } from "@/types/types";
import slugify from "slugify";

const dataFile = Bun.file("./data.json");

const data: Record<string, Question[]> = await dataFile.json()

const payload: Record<string, { name: string, questions: Question[] }> = {};

for (let [key, items] of Object.entries(data)) {
	const validKey = slugify(key, { lower: true, strict: true });
	payload[validKey] = {
		"name": key,
		"questions": items.slice(1),
	};
}

await Bun.write("question_bank.json", JSON.stringify(payload, null, 2));