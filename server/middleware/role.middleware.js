export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

export const authorizeUserOrAdmin = (req, res, next) => {
  try {
    // req.user comes from the verifyToken middleware
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user._id.toString() === req.params.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message:
          "Access denied. You can only update your own account or must be an admin.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
