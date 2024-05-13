import dotevn from 'dotenv';
import App from './app';

dotevn.config();

const INPUT_FILE_PATH = '../' + (process.env.INPUT_FILE_NAME || 'input');
const input = require(INPUT_FILE_PATH);

const app = new App();

app.main(input)
    .then((message: string) => {
        console.log(message);
        process.exit();
    })
    .catch((err) => {
        console.error(`There was an error on the execution: ${err.message}`);
        process.exit(1);
    });
