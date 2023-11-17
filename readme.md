# LinkedIn Post Image and Text

This Node.js application demonstrates how to upload an image post on LinkedIn using the LinkedIn APIs.

## Installation

1. Clone the repository:

    git clone https://github.com/parthatara123/LinkedIn.git

2. Install dependencies:

    npm install


## Usage

1. Ensure you have a LinkedIn Developer account and have registered your application to obtain the access token. Generate the access token using newly created app in developer account. Us auth tab to create a new token and give required access.


2. Run the application:

    npm run start

3. Use Postman or any other tool to make a POST request to `http://localhost:3000/media` with the following parameters in `multipart/form-data` format:
   - `accessToken`: Your LinkedIn access token in Auth tab as Bearer token.
   - `companyId`: Your LinkedIn company ID.
   - `postText`: Text for the post.
   - `image`: Image file to upload.
   - `title`: Image title
  
   - Make sure that while selecting an image from local, it should be in 'Media' folder.

4. The application will upload the image to LinkedIn and create a text post with the uploaded image and provided text.

## Configuration

- `app.js`: Contains the Node.js code for handling image upload and post creation.
- `package.json`: Manages project dependencies and scripts.
