export default abstract class Query<
    ActionType,
    FieldsType = string[],
    ConditionsType = string,
> {
    protected _action: ActionType;
    protected _fields: FieldsType;
    protected _collection: string;
    protected _conditions: ConditionsType;

    constructor(
        action: ActionType,
        collection: string,
        conditions: ConditionsType,
        fields: FieldsType
    ) {
        this._action = action;
        this._fields = fields;
        this._collection = collection;
        this._conditions = conditions;
    }

    public get action() {
        return this._action;
    }

    public get fields() {
        return this._fields;
    }

    public get collection() {
        return this._collection;
    }

    public get conditions() {
        return this._conditions;
    }

    public abstract buildQuery(): string;
}
