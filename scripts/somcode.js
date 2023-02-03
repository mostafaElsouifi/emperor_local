const access_key = "-vqFvdu0k3Z2wVSu4wk3kN-gF9EJ5syaNb2ex6uC5KM";
const secret_key = "VODlQgedtClep2U52aOBWnL9iKskZeFuSQc5JYcxB_U";
const search_term = "Vitamin C";

axios
  .get("https://api.unsplash.com/search/photos", {
    params: {
      query: search_term,
      client_id: access_key,
    },
  })
  .then((response) => {
    console.log(response.data.results);
    // You can access the url of the first photo using response.data.results[0].urls.raw
  })
  .catch((error) => {
    console.log(error);
  });
