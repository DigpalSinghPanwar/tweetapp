exports.updateUser = (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
    });
  }
};

exports.deleteUser = (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
    });
  }
};

exports.getAllUser = (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
    });
  }
};

exports.getUser = (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
    });
  }
};
