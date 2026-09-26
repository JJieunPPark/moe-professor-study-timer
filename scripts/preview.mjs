process.env.STATIC_DIR = "dist";
process.env.PORT ||= "4173";

const { default: app } = await import("../server.js");

app.listen(process.env.PORT, () => {
  console.log(`Production preview is running at http://localhost:${process.env.PORT}`);
});
