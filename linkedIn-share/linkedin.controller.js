const { uploadImagesToLinkedIn, registerImageOnLinkedIn, shareImagesToLinkedIn, getShareLink }  = require('./linkedin.service')
const fs = require('fs');

async function sharePostOnLinkedIn(req, res, imagePath){
    try {

        // destructuring req object
        let {companyId, postText, title} = req.body;

        // manual validation of input fields, can use validator like joi as well
        if(typeof companyId !== 'string' && companyId.trim() == ''){
            return res.json({
                status: false,
                message: 'Invalid data type for companyId',
            });
        }
        
        if(typeof postText !== 'string' && postText.trim() == ''){
            return res.json({
                status: false,
                message: 'Invalid data type for postText',
            });
        }

        if(typeof title !== 'string' && title.trim() == ''){
            return res.json({
                status: false,
                message: 'Invalid data type for title',
            });
        }

        const token = req.headers.authorization

        // step 1 : register image to linkedin and get upload url
        const registerPost = await registerImageOnLinkedIn(token, companyId)
        const { uploadMechanism, asset } = registerPost.value;
        const uploadUrl = uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        
        // step 2: upload image to linkedIn
        const imageData = fs.readFileSync(imagePath);

        const mimetype = req.files[0].mimetype
        await uploadImagesToLinkedIn(token, uploadUrl, imageData, mimetype)
        
        // step 3 : share the uploaded asset on linkedin business page / profile
        const resp = await shareImagesToLinkedIn(token, companyId, postText, asset, title)
        
        // throw an error if post is not shared on linkedIn
        if(resp.status !== 201){
            return res.json({
                status: false,
                message: 'Error posting on LinkedIn',
                statusCode: resp?.data?.status ? resp.data.status : 500
            });
        }

        // TODO: step 4: get share url, this is giving authentication error so commenting this part for now.
        const postIdArray = resp.data.id.split(':')
        const postId = postIdArray[postIdArray.length -1]
        const shareUrl = await getShareLink(token, postId)


        // successful response
        return res.json({
            status: true,
            message: 'Post successful!',
            statusCode: resp?.data?.status,
            linkedinResponse: resp.data,
            shareUrl: shareUrl
        });
       
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Error posting on LinkedIn',
            statusCode: 500,
            error: error
        });
    }

}


module.exports = {
    sharePostOnLinkedIn
};