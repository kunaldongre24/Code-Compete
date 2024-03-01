import axios from "axios";
import API_BASE_URL from "../constant/Api_base_url";

const muteUser = async (userId, status, config) => {
  const response = await axios.post(
    `${API_BASE_URL}/room/muteUser`,
    { userId, status },
    config
  );
  return response;
};
const kickUser = async (userId, config) => {
  const response = await axios.post(
    `${API_BASE_URL}/room/kickUser`,
    { userId },
    config
  );
  return response;
};
const sendMessage = async (message, config) => {
  const response = await axios.post(
    `${API_BASE_URL}/room/sendMessage`,
    { message },
    config
  );
  return response;
};
const updateStatus = async (status, config) => {
  const response = await axios.post(
    `${API_BASE_URL}/room/updateStatus`,
    { status },
    config
  );
  return response;
};
const updateSpectate = async (status, config) => {
  const response = await axios.post(
    `${API_BASE_URL}/room/updateSpectate`,
    { status },
    config
  );
  return response;
};

const handleTpp = async (val, config) => {
  const response = await axios.post(
    `${API_BASE_URL}/room/updateTpp`,
    { val },
    config
  );
  return response;
};
const handleRounds = async (val, config) => {
  const response = await axios.post(
    `${API_BASE_URL}/room/updateRounds`,
    { val },
    config
  );
  return response;
};

const handleMinRating = async (val, config) => {
  const response = await axios.post(
    `${API_BASE_URL}/room/updateMinRating`,
    { val },
    config
  );
  return response;
};
const handleMaxRating = async (val, config) => {
  const response = await axios.post(
    `${API_BASE_URL}/room/updateMaxRating`,
    { val },
    config
  );
  return response;
};

export {
  muteUser,
  kickUser,
  sendMessage,
  updateStatus,
  updateSpectate,
  handleTpp,
  handleRounds,
  handleMinRating,
  handleMaxRating,
};
