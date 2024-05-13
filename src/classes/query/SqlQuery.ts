import SqlCondition from '../SqlCondition';
import Query from './Query';

export enum SqlActions {
    Select = 'SELECT',
}

export default class SqlQuery extends Query<
    SqlActions,
    string[],
    SqlCondition
> {
    constructor(
        action: SqlActions,
        fields: string[],
        table: string,
        condition: SqlCondition
    ) {
        super(action, table, condition, fields);
    }

    public buildQuery(): string {
        let fields = this.fields.join(', ');

        if (!fields.length) {
            fields = '*';
        }

        return `${this.action} ${fields} FROM ${
            this.collection
        } WHERE ${this.conditions.buildCondition()};`;
    }
}
