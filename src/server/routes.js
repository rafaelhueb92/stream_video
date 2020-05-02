const route = require("express").Router();
const services = require("./services");
const Path = require("path");

function videoValidation(req, res, next) {
  const { video } = req.query;
  if (!video) {
    return res.sendStatusCode(400);
  }
  next();
}

route.get("/video", videoValidation, (req, res) => {
  const { headers, query } = req;
  const { range } = headers;

  console.log("REQUEST", headers, query);

  const { video } = query;

  const { head, file, path } = services.processVideo(range, video);
  
  if (path) {
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  } else {
    res.writeHead(206, head);
    file.pipe(res);
  }
});

route.get("/", (_, res) =>
  res.sendFile(Path.resolve(__dirname, "..", "client", "index.html"))
);

module.exports = route;
