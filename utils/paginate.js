exports.getPaginatedResults = async (Model, query = {}, options = {}) => {
  const {
    page,
    limit = 10,
    sort = "-createdAt",
    projection = "",
    populate = "",
  } = options;

  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    Model.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection)
      .populate(populate),
    Model.countDocuments(query),
  ]);

  return {
    results,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};
