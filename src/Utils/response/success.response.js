export const successResponse = ({
  res,
  statuscode = 200,
  message,
  data = {},
}) => {
  return res.status(statuscode).json({ message, data });
};
