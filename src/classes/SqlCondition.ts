import { SqlLogicalOperatorType } from './SqlLogicalOperator';
import { BuilderInterface } from '../interfaces/BuilderInterface';

export type SqlConditionOperatorType =
    | '='
    | '!='
    | '>='
    | '>'
    | '<'
    | '<='
    | 'IN';

export enum SqlConditionOperatorEnum {
    '=' = '=',
    '!=' = '!=',
    '>=' = '>=',
    '>' = '>',
    '<' = '<',
    '<=' = '<=',
    'IN' = 'IN',
}

export type SqlOperatorType = SqlConditionOperatorType | SqlLogicalOperatorType;
export type SqlValueType = string | number | boolean | any[];

export default class SqlCondition implements BuilderInterface {
    private _field: string;
    private _operator: SqlConditionOperatorType;
    private _value: SqlValueType;

    constructor(
        operator: SqlConditionOperatorType,
        field: string,
        value: SqlValueType
    ) {
        this._field = field;
        this._operator = operator;
        this._value = value;
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

    public build() {
        return `${this._field} ${this._operator} ${this._parseValue(this._value)}`;
    }
}
