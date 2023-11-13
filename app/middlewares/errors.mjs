export const errors = (err, _req, res, _next) => {
  if (err === 401) {
    res.status(401).render("errors/401", { layout: false });
    return;
  }
  console.log(err.stack);
  res.status(500).render("errors/500", { layout: false });
  return;
};

export const pageNotFound = (_req, res, _next) => {
  res.status(404).render("errors/404", { layout: false });
  return;
};
