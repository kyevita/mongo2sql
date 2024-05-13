export type SqlConditionOperatorType =
    | '='
    | '!='
    | '>='
    | '>'
    | '<'
    | '<='
    | 'IN';
export type SqlLogicalOperatorType = 'AND' | 'OR';
export type SqlOperatorType = SqlConditionOperatorType | SqlLogicalOperatorType;
export type SqlValueType = string | number | any[];

export enum SqlLogicalOperatorEnum {
    AND = 'AND',
    OR = 'OR',
}

export default class SqlCondition {
    private _operator: SqlOperatorType;
    private _field: string;
    private _value: SqlValueType;
    private _children: SqlCondition[];

    constructor(operator: SqlOperatorType);
    constructor(operator: SqlOperatorType, field: string, value: string);
    constructor(operator: SqlOperatorType, field?: string, value?: string) {
        this._operator = operator;
        this._field = field ?? '';
        this._value = value ?? '';
        this._children = [];
    }

    public static isLogicalOperator(
        value: any
    ): value is SqlLogicalOperatorType {
        return !!SqlLogicalOperatorEnum[value];
    }

    private _parseValue(value: SqlValueType) {
        if (typeof value === 'string') {
            return `'${value}'`;
        } else if (Array.isArray(value)) {
            return `(${value.map((v) => this._parseValue(v)).join(', ')})`;
        } else {
            return value;
        }
    }

    private _buildLogicalOperator() {
        const childrenLength = this._children.length;
        let output = childrenLength > 1 ? '(' : '';

        for (let i = 0; i < childrenLength; i++) {
            output += this._children[i].buildCondition();

            if (i + 1 < childrenLength) {
                output += ` ${this._operator} `;
            }
        }

        output += childrenLength > 1 ? ')' : '';

        return output;
    }

    public buildCondition() {
        if (SqlCondition.isLogicalOperator(this._operator)) {
            return this._buildLogicalOperator();
        }

        return `${this._field} ${this._operator} ${this._parseValue(this._value)}`;
    }

    public addChildCondition(condition: SqlCondition) {
        this._children.push(condition);
    }
}
