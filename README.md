# mongo2sql

This project is meant to translate raw Mongo `.find` queries into valid SQL queries.
A raw Mongo query will look like this:

```typescript
db.users.find();
db.users.find({ username: 'test' });
db.users.find({ age: { $gte: 23 } }, { name: 1, email: 1 });
```

The output for those queries translated to SQL will look something like:

```typescript
db.users.find(); // => SELECT * FROM users;
db.users.find({ username: 'test' }); // => SELECT * FROM users WHERE username = 'test';
db.users.find({ age: { $gte: 23 } }, { name: 1, email: 1 }); // => SELECT name, email FROM users WHERE age >= 23;
```

## Setup

You need Node v20 >= to run this project.

To install the dependencies, just run `npm i` on the main root of the project.
Once dependencies are installed we can run the application on development mode using:

```typescript
npm run start:dev
```

To compile a production version you can use the `npm run build` command, and then use `npm start` to run the program.

You can also personalize the input file path and output folder by using a .env file, there is an example on the root of the project, you can copy it, rename it as `.env`, and change the options according to your needs.

## Inputs

There is a default `input.js` file containing a few query examples, you can create a copy of this file and name it as you wish, and then just modify the INPUT_FILE_NAME variable on your .env with the new name of your input file.

## Outputs

Once the program has run successfully, a new file should be created under the `output` folder, containing the input and output for each of the queries listed in the `inputs.js` file.

If there are any errors through the program's execution, there will be error outputs specifying the error and the output that causes it.

## Testing
The application includes unit tests for the classes, to run these you can use the following command:
```
npm t
```

If you want to get a coverage report of the tests, you can use:
```
npm run test:coverage
```
