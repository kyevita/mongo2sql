import SqlLogicalOperator from '../SqlLogicalOperator';
import Query from './Query';

export enum SqlActions {
    Select = 'SELECT',
}

export default class SqlQuery extends Query<
    SqlActions,
    string[],
    SqlLogicalOperator
> {
    constructor(
        action: SqlActions,
        fields: string[],
        table: string,
        condition: SqlLogicalOperator
    ) {
        super(action, table, condition, fields);
    }

    public build(): string {
        let fields = this.fields.join(', ');

        if (!fields.length) {
            fields = '*';
        }

        return `${this.action} ${fields} FROM ${
            this.collection
        } WHERE ${this.conditions.build()};`;
    }
}
