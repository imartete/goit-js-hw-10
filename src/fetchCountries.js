export default async countryName => {
  // no need to declare that the function is async
  /* fetch(`https://restcountries.com/v3.1/name/${countryName}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  }); */

  const response = await fetch(
    `https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,flags,languages`
  );
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
};
