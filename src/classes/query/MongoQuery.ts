import mongoQueryParser, {
    isFilterValid,
    toJSString,
} from 'mongodb-query-parser';
import Query from './Query';

const MONGO_SPLIT_ACTION = '.';
const MONGO_SPLIT_PARAMS = '(';
const TO_REPLACE_FROM_PARAMS = [
    ['(', '['],
    [')', ']'],
];

export type MongoOperatorType =
    | '$or'
    | '$and'
    | '$lt'
    | '$lte'
    | '$gt'
    | '$gte'
    | '$ne'
    | '$in';
export type MongoConditionsType = {
    [k: string]: MongoConditionsType[] | string | number;
};
export type MongoFieldsType = { [field: string]: 1 | 0 };
export enum MongoActionsEnum {
    find = 'find',
}

export default class MongoQuery extends Query<
    MongoActionsEnum,
    MongoFieldsType,
    MongoConditionsType
> {
    private _rawQuery: any;

    private static parseRawQuery(rawQuery: string) {
        rawQuery = rawQuery.replace(/;/g, '');

        let [actionRaw, params] = rawQuery.split(MONGO_SPLIT_PARAMS);
        const [, collection, action] = actionRaw.split(MONGO_SPLIT_ACTION);

        params = '(' + params;
        TO_REPLACE_FROM_PARAMS.forEach(
            (char) => (params = params.replace(char[0], char[1]))
        );

        if (!isFilterValid(params)) {
            throw new Error(
                `Invalid Mongo Raw Query: '${rawQuery}' is not a valid query`
            );
        }

        const [query, fields] = mongoQueryParser(params);

        return { action, query, fields, collection };
    }

    public static fromRawQuery(rawQuery: string) {
        const { action, query, fields, collection } =
            this.parseRawQuery(rawQuery);

        if (!MongoActionsEnum[action]) {
            throw new Error(
                `Invalid Mongo Raw Query: Action '${action}' is not supported`
            );
        }

        return new MongoQuery(
            MongoActionsEnum[action],
            collection,
            query,
            fields
        );
    }

    constructor(
        action: MongoActionsEnum,
        collection: string,
        conditions: MongoConditionsType,
        fields: MongoFieldsType = {}
    ) {
        super(action, collection, conditions, fields);

        this._rawQuery = this.buildRawQuery();
    }

    private buildRawQuery() {
        const hasFields = Object.keys(this.fields).length > 0;
        const statement = `db.${this.collection}.${this.action}`;
        const params = `(${toJSString(this.conditions, 0)}${
            hasFields ? `, ${toJSString(this.fields, 0)}` : ''
        })`;

        return statement + params;
    }

    public buildQuery(): string {
        return this._rawQuery;
    }
}
