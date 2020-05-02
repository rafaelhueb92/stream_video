const fs = require("fs");
const Path = require("path");

function processVideo(range, video) {
  const path = Path.resolve(__dirname, "assets", video);
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    return { head, file };
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    return { head, path };
  }
}

module.exports = { processVideo };
