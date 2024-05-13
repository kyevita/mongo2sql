import path from 'path';
import { access, mkdir, writeFile } from 'fs/promises';

const DEFAULT_OUTPUT_PATH = './output';

export default class OutputService {
    private _outputPath: string;

    constructor(overrideOutputPath?: string) {
        let outputPath =
            overrideOutputPath ?? (process.env.OUTPUT_PATH as string);

        this._outputPath = outputPath ?? DEFAULT_OUTPUT_PATH;
    }

    private _generateFilename() {
        const date = new Date();

        return `output_${date.toISOString()}.json`;
    }

    private async _checkOutputFolder() {
        try {
            await access(this._outputPath);
        } catch (error) {
            await mkdir(this._outputPath);
        }
    }

    public async generateOutputFile<OutputType extends {}>(
        output: OutputType,
        filename?: string
    ) {
        await this._checkOutputFolder();

        const name = filename ?? this._generateFilename();

        await writeFile(
            path.join(this._outputPath, name),
            JSON.stringify(output, null, 4)
        );

        return name;
    }
}
