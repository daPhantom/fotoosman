require('package-script').spawn([{
  command: "npm",
  args: ["install", "-g", "browserify"]
}, {
  command: "npm",
  args: ["install", "-g", "watchify"]
}, {
  command: "npm",
  args: ["link", "../shared"]
}]);
