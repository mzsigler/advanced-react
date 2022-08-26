export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  };

  // check if it's an even dollar amount
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  // this is a built in javascript function and it's super rad

  const formatter = Intl.NumberFormat('en-us', options);

  return formatter.format(amount / 100);
}
