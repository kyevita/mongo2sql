import SqlCondition from './SqlCondition';
import { BuilderInterface } from '../interfaces/BuilderInterface';

export type SqlLogicalOperatorChildType = SqlLogicalOperator | SqlCondition;
export type SqlLogicalOperatorType = 'AND' | 'OR';
export enum SqlLogicalOperatorEnum {
    AND = 'AND',
    OR = 'OR',
}

export default class SqlLogicalOperator implements BuilderInterface {
    private _children: SqlLogicalOperatorChildType[];
    private _operator: SqlLogicalOperatorType;

    constructor(operator: SqlLogicalOperatorType) {
        this._children = [];
        this._operator = operator;
    }

    public static isLogicalOperator(
        value: any
    ): value is SqlLogicalOperatorType {
        return !!SqlLogicalOperatorEnum[value];
    }

    public addChild(child: SqlLogicalOperatorChildType) {
        this._children.push(child);
    }

    public build(): string {
        const childrenLength = this._children.length;
        let output = childrenLength > 1 ? '(' : '';

        for (let i = 0; i < childrenLength; i++) {
            output += this._children[i].build();

            if (i + 1 < childrenLength) {
                output += ` ${this._operator} `;
            }
        }

        output += childrenLength > 1 ? ')' : '';

        return output;
    }

    public get children() {
        return this._children;
    }
}
