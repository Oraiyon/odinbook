import expressAsyncHandler from "express-async-handler";

const testIndex = expressAsyncHandler(async (req, res, next) => {
  res.json({ name: "frodo" });
});

export default testIndex;
