Steps:

- Initialising the npm, nodemon and created a gitignore files and write node_modeules in it.
- Setup the Database and Created the Schema for FAQ.
- Creating the faqRouter post route for posting the frequently asked questions.
- installed redis in windows using Chocolatey.
- Created faqRouter.get to retrieve all the faq in all the languages.
- Added testing images(postman) in src/images.
- Created faqRouter.delete to delete a specific id of record from the database.
- Now there is a error, when i'm creating or deleting the faq, redis cache is not getting updated, So for that i'm clearing the faq cache.
- Created the user Schema Model.
- Created the authentication middleware for user.
- Created the post authRouter for signup API.

Features:

Create FAQ (POST /faqs)

- Stores a new FAQ with its original question and answer.
- Automatically translates the FAQ into Hindi (hi), French (fr), and Russian (ru) and stores translations in the database.
- Clears Redis cache after insertion.

Get FAQs (GET /faqs)

- Retrieves FAQs from MongoDB or Redis cache.
- Supports querying in different languages (default: English).
- If FAQs are found, they are translated into the requested language using pre-stored translations.
- Delete FAQ (DELETE /faqs/:id)

Deletes an FAQ by ID.

- Clear the Redis cache after deletion.
