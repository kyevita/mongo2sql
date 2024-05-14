import MongoQuery from './classes/query/MongoQuery';
import OutputService from './service/OutputService';
import QueryTranslatorService from './service/QueryTranslatorService';

interface OutputType {
    mongoInput: string;
    sqlOutput: string;
}

interface InputErrors {
    input: string;
    error: any;
}

export default class App {
    private _queryTranslatorService: QueryTranslatorService;

    constructor() {
        this._queryTranslatorService = new QueryTranslatorService();
    }

    private async _generateOutputs(
        output: OutputType[],
        inputErrors: InputErrors[]
    ) {
        const outputService = new OutputService();

        const outputFilename = await outputService.generateOutputFile(output);
        let inputErrorsFilename: string | null = null;

        if (inputErrors.length > 0) {
            inputErrorsFilename = await outputService.generateOutputFile(
                inputErrors,
                'errors_' + outputFilename
            );
        }

        return { outputFilename, inputErrorsFilename };
    }

    private _generateOutputMessage(
        outputFilenames: string,
        hasErrorOutput = false
    ) {
        let message = `New output files were generated at ${outputFilenames}`;

        return (
            'Success!' +
            (hasErrorOutput ? 'But there were issues. ' : '') +
            message
        );
    }

    private _executeTranslateQuery(rawQuery: string): OutputType {
        const mongoQuery = MongoQuery.fromRawQuery(rawQuery);
        const sqlQuery =
            this._queryTranslatorService.buildSqlQueryFromMongoQuery(
                mongoQuery
            );

        return {
            mongoInput: rawQuery,
            sqlOutput: sqlQuery.build(),
        };
    }

    private _validateInputItem(input: string) {
        if (typeof input !== 'string') {
            throw new Error(
                `Application error: Input ${input} is not a valid string`
            );
        }
    }

    async main(input: string[]) {
        const output: OutputType[] = [];
        const inputErrors: InputErrors[] = [];

        for (const rawQuery of input) {
            try {
                this._validateInputItem(rawQuery);
                output.push(this._executeTranslateQuery(rawQuery));
            } catch (error: any) {
                inputErrors.push({
                    input: rawQuery,
                    error: error.message,
                });
            }
        }

        const { outputFilename, inputErrorsFilename } =
            await this._generateOutputs(output, inputErrors);

        return this._generateOutputMessage(
            [outputFilename, inputErrorsFilename].join(', '),
            inputErrors.length > 0
        );
    }
}
