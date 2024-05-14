import MongoQuery, {
    MongoFieldsType,
    MongoOperatorType,
} from '../classes/query/MongoQuery';
import SqlCondition, { SqlOperatorType } from '../classes/SqlCondition';
import SqlQuery, { SqlActions } from '../classes/query/SqlQuery';
import SqlLogicalOperator, {
    SqlLogicalOperatorChildType,
    SqlLogicalOperatorType,
} from '../classes/SqlLogicalOperator';

const MONGO_TO_SQL_OPERATORS: { [key in MongoOperatorType]: SqlOperatorType } =
    {
        $or: 'OR',
        $and: 'AND',
        $lt: '<',
        $lte: '<=',
        $gt: '>',
        $gte: '>=',
        $ne: '!=',
        $in: 'IN',
    };

export default class QueryTranslatorService {
    private _parseMongoFields(fields: MongoFieldsType) {
        const result: string[] = [];
        const fieldEntries = Object.entries(fields);

        for (const [field, value] of fieldEntries) {
            if (value) {
                result.push(field);
            }
        }

        return result;
    }

    private _getSqlOperator(mongoOperator: string): SqlOperatorType | null {
        return MONGO_TO_SQL_OPERATORS[mongoOperator] ?? null;
    }

    private _handleLogicalOperators(
        operator: SqlLogicalOperatorType,
        value: any
    ) {
        const parentCondition = new SqlLogicalOperator(operator);

        for (const conditions of value) {
            parentCondition.addChild(this._buildSqlQueryConditions(conditions));
        }

        return parentCondition;
    }

    private _handleOperator(
        operator: SqlOperatorType,
        value: any,
        parentKey: string = ''
    ): SqlLogicalOperatorChildType {
        if (SqlLogicalOperator.isLogicalOperator(operator)) {
            return this._handleLogicalOperators(operator, value);
        } else {
            return new SqlCondition(operator, parentKey, value);
        }
    }

    private _buildSqlQueryConditions(
        query: any,
        parentField?: string
    ): SqlLogicalOperator {
        const queryEntries = Object.entries(query);
        const parentCondition = new SqlLogicalOperator('AND');

        for (const [fieldOrOperator, value] of queryEntries) {
            const operator = this._getSqlOperator(fieldOrOperator);

            if (operator) {
                parentCondition.addChild(
                    this._handleOperator(operator, value, parentField)
                );
            } else if (typeof value === 'object') {
                parentCondition.addChild(
                    this._buildSqlQueryConditions(value, fieldOrOperator)
                );
            } else {
                parentCondition.addChild(
                    this._handleOperator('=', value, fieldOrOperator)
                );
            }
        }

        return parentCondition;
    }

    public buildSqlQueryFromMongoQuery(query: MongoQuery): SqlQuery {
        const queryConditions = this._buildSqlQueryConditions(query.conditions);
        const queryFields = this._parseMongoFields(query.fields);

        return new SqlQuery(
            SqlActions.Select,
            queryFields,
            query.collection,
            queryConditions
        );
    }
}
