const isRestaurantOpen = (openingTime, closingTime) => {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = openingTime.split(':').map(Number);
  const [closeH, closeM] = closingTime.split(':').map(Number);

  const open = openH * 60 + openM;
  const close = closeH * 60 + closeM;

  if (close < open) {
    return current >= open || current <= close;
  }

  return current >= open && current <= close;
};

module.exports = { isRestaurantOpen };