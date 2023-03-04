"use strict";

/**
 * fdciabdul
 * @date 2023-03-05
 */
const axios = require("axios");
const URL = require("url");

const googleDrive = {};

// A module definition
/**
 * fdciabdul
 * @date 2023-03-05
 * @param {any} docId
 * @returns {any}
 */
googleDrive.getMediaLink = async function (docId) {
  try {
    // Send a GET request to retrieve the thumbnail related to the given doc ID
    const thumbnail = await axios
      .request({
        method: "get",
        url: `https://drive.google.com/thumbnail?sz=w1000&id=${docId}`,
        maxRedirects: 0,
      })
      .catch((error) => {
        // Return the URL of the redirected request if an error occurs
        return error.response.headers.location;
      });

    // Retrieve the media file using a GET request with a download key
    const resData = await axios.request({
      method: "GET",
      url: `https://drive.google.com/uc?id=${docId}&export=download`,
      maxRedirects: 0,
      // Validate status codes between 200 and 399 to resolve only if the result is successful
      validateStatus: (status) => status >= 200 && status < 400,
    });

    // Check if the status code implies success, otherwise return information about the error
    if (resData.status === 200) {
      // Got something to work with.
    } else if (resData.status === 303) {
      // Handle redirect location URLs
      const u = URL.parse(resData.headers.location);
      // Check if the hostname ends with googleusercontent.com 
      if (u.hostname?.endsWith("googleusercontent.com")) {
        // Create a success response object including the location and the thumbnail
        return createSuccessResponse(resData.headers.location, thumbnail);
      } else {
        // Returns 401 Unauthorized response object for anything other than Googleusercontent.com that got redirected
        return createFailedResponse(401, "Unauthorized");
      }
    } else {
      // Creates a new failed response object by including the status, status text and headers from resData
      return createFailedResponse(resData.status, {
        statusText: resData.statusText,
        headers: resData.headers,
      });
    }

    // Parse cookies from the response header
    const responseCookies = resData.headers["set-cookie"] || "";
    const cookies = responseCookies.split(";").map((x) => x.trim());

    // Load the HTML data from resData using Cheerio library
    const $ = cheerio.load(resData.data);
    // Retrieve the next action URL from the forms attrs
    const nextActionURL = $("form").attr("action");

    // Prepare form data (docID in this case) in POST request URL encoded
    const postData = new URLSearchParams();
    postData.append("docid", docId);

    // Send a POST request for media confirmation, including cookies and post data
    const reqMediaConfirm = await axios.request({
      method: "POST",
      url: nextActionURL,
      headers: {
        cookie: cookies,
      },
      data: postData.toString(),
      maxRedirects: 0,
    });

    // Take location header in the response as video source
    const videoSource = reqMediaConfirm.headers.location;
    // use the thumbnail if there's one available
    const thumbSource = thumbnail || "";

    // Create a success response object by including the video source and thumbnail
    return createSuccessResponse(videoSource, thumbSource);
  } catch (error) {
    // Throw an error if it fails trying to fetch the media link from Google Drive
    throw new Error("Error while fetching the media link. " + error.message);
  }
};


function createFailedResponse(status, error) {
  return {
    statusCode: status,
    error: error,
  };
}

function createSuccessResponse(videoSource, thumbSource) {
  return {
    src: videoSource,
    thumbnail: thumbSource,
  };
}

module.exports = googleDrive;
