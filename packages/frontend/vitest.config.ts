/// <reference types="vitest" />
import { defineConfig } from "vite";
import { resolve } from "path";
console.log("__dirname", __dirname);

export default defineConfig({
	resolve: {
		alias: [
			{ find: "~/util", replacement: resolve(__dirname, "./app/util") },
		],
	},
});
