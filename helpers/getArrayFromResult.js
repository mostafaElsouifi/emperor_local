module.exports = getArrayFromResult = (string) => {
  let output = string
    .replaceAll(/\D\d+\D/gi, "")
    .replaceAll(/\[/g, "")
    .replaceAll(/\]/g, "")
    .replaceAll(/-/g, "")
    .replaceAll("'", "")
    .replaceAll('"', "")
    .trim();
  if (output.includes(",")) {
    output = output.split(",");
  } else {
    output = output.split("\n");
  }

  output = output.filter((e) => e != "").map((e) => e.trim());
  return output;
};
