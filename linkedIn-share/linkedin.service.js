const axios = require('axios');


async function registerImageOnLinkedIn(token, companyId) {
  try {
    const postBody = {
      "registerUploadRequest": {
          "recipes": [
              "urn:li:digitalmediaRecipe:feedshare-image"
          ],
          "owner": `urn:li:person:${companyId}`,
          "serviceRelationships": [
                {
                  "relationshipType": "OWNER",
                  "identifier": "urn:li:userGeneratedContent"
                }
              ]
           }
        };
  
      const uploadUrl = 'https://api.linkedin.com/v2/assets?action=registerUpload';
      const response = await axios.post(uploadUrl, postBody, {
        headers: {
            'Authorization': token, 
            'Content-Type': 'application/octet-stream',
            'LinkedIn-Version': 202310 // can change the version or use env variable for this
          },
      });

      return response.data 
  } catch (error) {
      throw new Error('Error uploading images to LinkedIn');
  }
}


// upload image to linkedin and get asset 
async function uploadImagesToLinkedIn(token, uploadUrl, imageData, mimetype) {
    try {
        const response = await axios.put(uploadUrl, imageData, {
          headers: {
            Authorization: token,
            'Content-Type': mimetype
          },
        });
          return true
        } catch (error) {
          throw new Error('Error uploading images to LinkedIn');
        }
}

async function shareImagesToLinkedIn(token, companyId, postTitle, asset, title) {
  try {
        const request = {
          author: `urn:li:person:${companyId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: postTitle
              },
              shareMediaCategory: "IMAGE",
              media: [
                {
                  status: "READY",
                  media: asset,
                  title: {
                    text: title
                }
                }
              ]
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': "PUBLIC",
          }
        };
          // LinkedIn API endpoint for posting
          const postUrl = 'https://api.linkedin.com/v2/ugcPosts';
          const response = await axios.post(postUrl, request,
            {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/octet-stream',
            },
          }
        );

          return response; 
  } catch (error) {
      throw new Error('Error uploading images to LinkedIn');
  }
}

// get link to share this post
async function getShareLink(token, postId) {
  try {
    const shareUrl = `https://api.linkedin.com/v2/ugcPosts/${postId}`
      const response = await axios.get(shareUrl, {
        headers: {
          Authorization: token,
        },
      });
        return response.data
      } catch (error) {
        throw new Error('Error uploading images to LinkedIn');
      }
}

// Function to post an article to company's Webpage, not in use right now
async function postArticleToCompany(companyId, postText) {
  try {
    const {companyId, postText} = req.body;
    const token = req.headers.authorization
    const postUrl = `https://api.linkedin.com/v2/ugcPosts`
    const postData = {
        author: `urn:li:person:${companyId}`, 
        lifecycleState: 'PUBLISHED',
        specificContent: {
            'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                    text: `${postText}`,
                },
                shareMediaCategory: 'NONE'
            },
        },
        visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': "PUBLIC"
        }
    };
    // Make the POST request to LinkedIn
    const response = await axios.post(postUrl, postData, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
        },
    });
    // Respond with success message and LinkedIn API response
    res.json({
        success: true,
        message: 'Post successful!',
        linkedinResponse: response.data,
    });
} catch (error) {
    // Handle errors and respond with an error message
        res.status(500).json({
        success: false,
        message: 'Error posting on LinkedIn',
        error: error
    });
}
}
 



module.exports = {
    uploadImagesToLinkedIn,
    registerImageOnLinkedIn,
    shareImagesToLinkedIn,
    getShareLink
};