const { default: Axios } = require("axios");

module.exports = ({ token, profileId, bdless }) => {
  const axiosInstance = Axios.create({
    baseURL: "https://api.transferwise.com",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const toData = (r) => r.data;
  const getProfile = () => axiosInstance.get("/v1/profiles").then(toData);
  const getStatement = (query) =>
    axiosInstance
      .get(
        `/v3/profiles/${profileId}/borderless-accounts/${bdless}/statement.csv`,
        { params: query }
      )
      .then(toData);
  return { getProfile, getStatement };
};
