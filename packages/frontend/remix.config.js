/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
	ignoredRouteFiles: ["**/.*"],
	serverModuleFormat: "cjs",
	// appDirectory: "app",
	// assetsBuildDirectory: "public/build",
	// publicPath: "/build/",
	// serverBuildPath: "build/index.js",

	watchPaths: ["../form/dist/", "../ui/dist"],
	serverDependenciesToBundle: [/^@marcianosrs\/ui/, /^@marcianosrs\/form/],
};
