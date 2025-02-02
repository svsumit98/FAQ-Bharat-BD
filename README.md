Steps:

- initialising the npm, nodemon and created a gitignore files and write node_modeules in it.
- Setup the Database and Created the Schema for FAQ.
- Creating the faqRouter post route for posting the frequently asked questions.
- installed redis in windows using Chocolatey.
- Created faqRouter.get to retrieve all the faq in all the languages.
- Added testing images(postman) in src/images.
- Created faqRouter.delete to delete a specific id of record from the database.
- Now there is a error, when i'm creating or deleting the faq, redis cache is not getting updated, So for that i'm clearing the faq cache.
